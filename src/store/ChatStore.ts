import { flow, makeAutoObservable, observable, runInAction, set } from 'mobx';
import { ChannelListRes } from '../types/channel';
import { MessageType } from '../types/message';
import { CustomUploadFile } from '../types/attachment';
import { ChannelRepository } from '../repository/ChannelRepository';
import {
  Attachment,
  Channel as WFChannel,
  ChannelListRes as WFChannelListRes,
  Message,
  MessageCollection,
  WingFloClient,
} from '@wingflo/js-sdk';
import { UserViewRes } from '../types/user';
import { UserRepository } from '../repository/UserRepository';
import { RcFile } from 'antd/es/upload';
import { AsyncOpState } from '../types/common';

const MAX_MESSAGES_TO_KEEP_LOCALLY = 100;

class ChatStore {
  // channels used for listing channels
  channels: ChannelListRes[] = [];
  channelsState: AsyncOpState = 'done';
  selectedChannel?: ChannelListRes;

  // channels used in chat page
  chatChannels: WFChannelListRes[] = [];
  chatChannelsState: AsyncOpState = 'done';
  selectedChatChannel?: WFChannelListRes;
  chatChannel?: WFChannel;
  chattingUser?: UserViewRes;
  messageCollection?: MessageCollection;

  chatMessages = observable<MessageType>([]);
  chatMessagesState: AsyncOpState = 'done';

  chatRepliesState: AsyncOpState = 'done';
  selectedMessage?: MessageType;
  selectedChatMessage?: Message;
  chatReplies: MessageType[] = [];
  uploadFiles: CustomUploadFile[] = [];
  replyUploadFiles: CustomUploadFile[] = [];
  channelListAbortController = new AbortController();
  wingFloClient?: WingFloClient;

  deleteMessageState: AsyncOpState = 'done';

  constructor() {
    makeAutoObservable(this, {
      selectChannel: flow,
      selectChatMessage: flow,
      selectChatChannel: flow,
    });
  }

  async fetchChannels(appId: number, searchKeyword: string = '') {
    this.channels = [];
    this.channelsState = 'pending';
    this.channelListAbortController.abort();
    this.channelListAbortController = new AbortController();
    try {
      const channels = await ChannelRepository.listChannels(
        appId,
        searchKeyword,
        this.channelListAbortController.signal,
      );
      runInAction(() => {
        this.channels = channels;
        this.channelsState = 'done';
      });
    } catch (error) {
      this.channelsState = 'error';
    }
  }

  async initWfClient(appId: number, appUuid: string, username: string) {
    this.wingFloClient = WingFloClient.init({
      appUuid: appUuid,
      serverUrl: process.env.REACT_APP_CHAT_SERVER_URL,
    });
    const user = await UserRepository.viewUser(appId, username);

    const res = await UserRepository.getUserSessionToken({
      application_id: appId,
      username: username,
    });
    await this.wingFloClient.connect({
      username: user.username,
      authToken: res.session_token,
    });
    runInAction(() => {
      this.chattingUser = user;
    });
  }

  async fetchChatChannels() {
    if (this.wingFloClient == null) return;
    this.chatChannels = [];
    this.chatChannelsState = 'pending';
    try {
      const channels = await this.wingFloClient.listChannels();
      runInAction(() => {
        this.chatChannels = channels;
        this.chatChannelsState = 'done';
      });
    } catch (error) {
      runInAction(() => {
        this.chatChannelsState = 'error';
      });
    }
  }

  *selectChatChannel(
    channel: WFChannelListRes,
    onMessageReceived?: (message: MessageType) => void,
  ) {
    if (this.wingFloClient == null) {
      console.warn('cannot select channel. wingflo client is not initialized.');
      return;
    }
    this.chatMessagesState = 'pending';
    this.chatMessages.clear();
    this.chatReplies = [];
    this.selectedMessage = undefined;
    this.selectedChatMessage = undefined;
    this.messageCollection?.dispose();
    this.selectedChatChannel = channel;
    const selectedChannel: WFChannel = yield this.wingFloClient.getChannel(
      channel.uuid,
    );
    console.debug('selected channel', selectedChannel);
    yield selectedChannel.enter();
    console.debug('entered channel', selectedChannel);
    const messageCollection = selectedChannel.createMessageCollection({});
    this.chatMessages = yield messageCollection.loadPrevious();
    this.chatChannel = selectedChannel;
    this.messageCollection = messageCollection;
    this.chatMessagesState = 'done';
    messageCollection.setMessageCollectionHandler({
      onMessagesReceived: (channel, newMessages) => {
        const newMessage = newMessages[0];
        if (newMessage.parent_message_uuid == null) {
          console.debug('new message received', newMessage);
          const startIndex =
            this.chatMessages.length - MAX_MESSAGES_TO_KEEP_LOCALLY;
          // set(this.chatMessages, [...this.chatMessages, ...newMessages]);
          console.debug(
            'msg list updated because we got a new msg.',
            this.chatMessages.map((m) => m.uuid),
          );

          runInAction(() => {
            this.chatMessages.replace([
              ...this.chatMessages,
              // ...this.chatMessages.slice(startIndex),
              ...newMessages,
            ]);
          });
          onMessageReceived?.(newMessage);
        } else if (
          this.selectedChatMessage?.uuid === newMessage.parent_message_uuid
        ) {
          const startIndex =
            this.chatReplies.length - MAX_MESSAGES_TO_KEEP_LOCALLY;
          this.chatReplies = [
            ...this.chatReplies.slice(startIndex),
            ...newMessages,
          ];
        }
      },
      onMessagesUpdated: (channel, updatedMessages) => {
        const updatedMessage = updatedMessages[0];
        console.debug('message updated', updatedMessage.uuid);
        if (updatedMessage.parent_message_uuid == null) {
          const index = this.chatMessages.findIndex(
            (m) => m.uuid === updatedMessage.uuid,
          );
          console.debug('index', index);

          if (index !== -1) {
            console.debug(
              `updating message (uuid: ${updatedMessage.uuid}) at index ${index}`,
            );
            // let newList = [...this.chatMessages];
            // newList[index] = updatedMessage;
            runInAction(() => {
              this.chatMessages[index] = updatedMessage;
            });
          }
        } else if (
          this.selectedChatMessage?.uuid === updatedMessage.parent_message_uuid
        ) {
          const index = this.chatReplies.findIndex(
            (m) => m.uuid === updatedMessage.uuid,
          );
          if (index !== -1) {
            set(this.chatReplies, index, updatedMessage);
          }
        }
      },
      onMessageDeleted: (channel, deletedMessageUuid) => {
        const msgToDelete = this.chatMessages.find(
          (m) => m.uuid === deletedMessageUuid,
        );
        if (msgToDelete != null) {
          this.chatMessages.remove(msgToDelete);
        }
      },
    });
  }

  *sendMessage(message: string, parentMessage?: MessageType) {
    if (this.wingFloClient == null) {
      console.warn('wingflo client is not initialized, cannot send message');
      return;
    }
    if (this.chatChannel == null) {
      console.warn('chat channel is not selected, cannot send message');
      return;
    }

    yield this.chatChannel.sendMessage({
      message: message,
      attachments: this.uploadFiles
        .filter((file) => file.status === 'done')
        .map((file) => ({
          bucket_name: file.bucket!,
          file_key: file.fileKey!,
          original_file_name: file.name,
          content_type: file.type!,
        })),
      parentMessageUuid: parentMessage?.uuid,
    });
    if (parentMessage == null) {
      this.uploadFiles = [];
    } else {
      this.replyUploadFiles = [];
    }
  }

  selectChannel(channel: ChannelListRes) {
    this.selectedChannel = channel;
  }

  *selectChatMessage(selectedMessage?: MessageType) {
    if (this.wingFloClient == null || this.chatChannel == null) {
      console.warn('wingflo client or chat channel is not initialized');
      return;
    }

    this.selectedMessage = selectedMessage;
    if (selectedMessage == null) return;
    this.chatReplies = [];
    this.chatRepliesState = 'pending';

    const msg: Message = yield this.wingFloClient.getMessage({
      channelUuid: this.chatChannel.uuid,
      messageUuid: selectedMessage.uuid,
    });
    console.debug('fetched msg', msg);
    const replies: MessageType[] = yield msg.getThreadedMessagesByTimestamp(
      new Date().valueOf(),
    );
    console.debug('fetched replies', replies);

    this.messageCollection?.dispose();
    this.messageCollection?.setMessageCollectionHandler({
      onMessagesReceived: (channel, newMessages) => {
        const newMessage = newMessages[0];
        if (newMessage.parent_message_uuid == null) {
          const startIndex =
            this.chatMessages.length - MAX_MESSAGES_TO_KEEP_LOCALLY;
          this.chatMessages.replace([
            ...this.chatMessages.slice(startIndex),
            ...newMessages,
          ]);
        } else if (msg.uuid === newMessage.parent_message_uuid) {
          const startIndex =
            this.chatReplies.length - MAX_MESSAGES_TO_KEEP_LOCALLY;
          this.chatReplies = [
            ...this.chatReplies.slice(startIndex),
            ...newMessages,
          ];
        }
      },
      onMessagesUpdated: (channel, updatedMessages) => {
        const updatedMessage = updatedMessages[0];
        console.debug('message updated', updatedMessage);
        if (updatedMessage.parent_message_uuid == null) {
          const index = this.chatMessages.findIndex(
            (m) => m.uuid === updatedMessage.uuid,
          );
          if (index !== -1) {
            this.chatMessages[index] = updatedMessage;
          }
        } else if (msg.uuid === updatedMessage.parent_message_uuid) {
          const index = this.chatReplies.findIndex(
            (m) => m.uuid === updatedMessage.uuid,
          );
          if (index !== -1) {
            this.chatReplies[index] = updatedMessage;
          }
        }
      },
    });

    this.chatReplies = replies;
    this.selectedChatMessage = msg;
    this.chatRepliesState = 'done';
  }

  *handleAttachmentUpload(file: CustomUploadFile) {
    if (this.wingFloClient == null || this.chatChannel == null) {
      console.warn('wingflo client or chat channel is not initialized');
      return;
    }
    if (file == null) {
      console.warn('no file object', file);
      return;
    }
    this.uploadFiles.push({
      ...file,
      name: file.name,
      status: 'uploading',
    });

    try {
      const attachment: Attachment = yield this.chatChannel.uploadFile(
        file as RcFile,
      );
      this.uploadFiles = this.uploadFiles.map((f) => {
        if (f.uid === file.uid) {
          return {
            ...f,
            status: 'done',
            url: attachment.url,
            fileKey: attachment.fileKey,
            bucket: attachment.bucket,
            type: attachment.contentType,
          };
        }
        return f;
      });
    } catch (err) {
      console.error('Failed to upload file', err);
      this.uploadFiles = this.uploadFiles.map((f) => {
        if (f.uid === file.uid) {
          return {
            ...f,
            status: 'error',
          };
        }
        return f;
      });
    }
  }

  *handleReplyAttachmentUpload(file: CustomUploadFile) {
    if (this.wingFloClient == null || this.chatChannel == null) {
      console.warn('wingflo client or chat channel is not initialized');
      return;
    }
    if (file == null) {
      console.warn('no file object', file);
      return;
    }
    this.replyUploadFiles.push({
      ...file,
      name: file.name,
      status: 'uploading',
    });

    try {
      const attachment: Attachment = yield this.chatChannel.uploadFile(
        file as RcFile,
      );
      this.replyUploadFiles = this.replyUploadFiles.map((f) => {
        if (f.uid === file.uid) {
          return {
            ...f,
            status: 'done',
            url: attachment.url,
            fileKey: attachment.fileKey,
            bucket: attachment.bucket,
            type: attachment.contentType,
          };
        }
        return f;
      });
    } catch (err) {
      console.error('Failed to upload file', err);
      this.replyUploadFiles = this.replyUploadFiles.map((f) => {
        if (f.uid === file.uid) {
          return {
            ...f,
            status: 'error',
          };
        }
        return f;
      });
    }
  }

  handleAttachmentUploadRemove(file: CustomUploadFile) {
    this.uploadFiles = this.uploadFiles.filter((f) => f.uid !== file.uid);
  }

  handleReplyAttachmentUploadRemove(file: CustomUploadFile) {
    this.replyUploadFiles = this.replyUploadFiles.filter(
      (f) => f.uid !== file.uid,
    );
  }

  *addReaction(messageUuid: string, reaction: string) {
    if (this.wingFloClient == null || this.chatChannel == null) {
      console.warn('wingflo client or chat channel is not initialized');
      return;
    }

    const msg: Message = yield this.wingFloClient.getMessage({
      channelUuid: this.chatChannel.uuid,
      messageUuid: messageUuid,
    });
    console.debug('fetched msg', msg.uuid);
    msg.addReaction(reaction);
  }

  *deleteReaction(messageUuid: string, reaction: string) {
    if (this.wingFloClient == null || this.chatChannel == null) {
      console.warn('wingflo client or chat channel is not initialized');
      return;
    }

    const msg: Message = yield this.wingFloClient.getMessage({
      channelUuid: this.chatChannel.uuid,
      messageUuid: messageUuid,
    });
    console.debug('fetched msg', msg.uuid);
    msg.deleteReaction(reaction);
  }

  *deleteMessage(message: MessageType) {
    if (this.wingFloClient == null || this.chatChannel == null) {
      console.warn('wingflo client or chat channel is not initialized');
      return;
    }
    this.deleteMessageState = 'pending';
    try {
      yield this.chatChannel.deleteMessage(message.uuid);
      this.deleteMessageState = 'done';
    } catch (e) {
      console.error('Failed to delete message', e);
      this.deleteMessageState = 'error';
    }
    console.debug('deleted msg', message.uuid);
  }

  getMessageUserReactedMap(
    messageUuid: string,
    username: string,
  ): Record<string, boolean> {
    const map: Record<string, boolean> = {};
    const msg = this.chatMessages.find((m) => m.uuid === messageUuid);
    if (msg == null) {
      console.warn(
        'cannot find message to create user reacted map for message uuid:',
        messageUuid,
      );
      return map;
    }
    for (const reaction of msg.reactions) {
      if (reaction.user.username === username) {
        map[reaction.reaction] = true;
      }
    }
    return map;
  }
}

export default ChatStore;
