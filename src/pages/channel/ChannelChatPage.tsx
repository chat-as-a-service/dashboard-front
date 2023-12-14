import React, { useContext, useEffect, useRef, useState } from 'react';
import { Layout, theme } from 'antd';
import { CommonStoreContext } from '../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { UserRepository } from '../../repository/UserRepository';
import { UserViewRes } from '../../types/user';
import { ChannelListSideBar } from '../../components/channel/ChannelListSideBar';
import { ChannelChatBox } from '../../components/channel/ChannelChatBox';
import { ChannelInfoSideBar } from '../../components/channel/ChannelInfoSideBar';
import {
  Channel,
  ChannelListRes,
  MessageCollection,
  WingFloClient,
} from '@wingflo/js-sdk';
import { MessageType } from '../../types/message';
import { CustomUploadFile } from '../../types/attachment';
import { RcFile } from 'antd/es/upload';

const MAX_MESSAGES_TO_KEEP_LOCALLY = 100;
const ChannelChatPage = () => {
  const [channelInfoRightSideBarVisible, setChannelInfoRightSideBarVisible] =
    useState(true);

  const [user, setUser] = useState<UserViewRes>();
  const [channels, setChannels] = useState<ChannelListRes[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [replies, setReplies] = useState<MessageType[]>([]);
  const [selectedMessage, selectMessage] = useState<MessageType>();
  const [selectedChannel, selectChannel] = useState<ChannelListRes>();
  const [sessionToken, setSessionToken] = useState<string>();
  const [uploadFiles, setUploadFiles] = useState<CustomUploadFile[]>([]);

  const commonStore = useContext(CommonStoreContext);
  const { selectedApplication } = commonStore;
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const wingFloClientRef = useRef<WingFloClient>();
  const wingFloChannelRef = useRef<Channel>();
  const wingFloMessageCollectionRef = useRef<MessageCollection>();
  let { channelUuid } = useParams();

  useEffect(() => {
    commonStore.appSidebarCollapsed = true;
    commonStore.appRootLayoutNoPadding = true;

    return () => {
      commonStore.appSidebarCollapsed = false;
      commonStore.appRootLayoutNoPadding = false;
    };
  }, []);

  // todo: replace with moderator check
  useEffect(() => {
    if (selectedApplication == null) return;
    if (commonStore.moderator == null) {
      navigate(`/${selectedApplication.uuid}/channels`);
      return;
    }
    (async () => {
      const user = await UserRepository.viewUser(
        selectedApplication.id,
        commonStore.moderator!.username,
      );
      setUser(user);
      const res = await UserRepository.getUserSessionToken({
        application_id: selectedApplication.id,
        username: user.username,
      });
      setSessionToken(res.session_token);
      if (wingFloClientRef.current == null) {
        const wf = WingFloClient.init({
          appUuid: selectedApplication.uuid,
          serverUrl: process.env.REACT_APP_CHAT_SERVER_URL,
        });
        await wf.connect({
          username: user.username,
          authToken: res.session_token,
        });

        const channels = await wf.listChannels();
        setChannels(channels);
        wingFloClientRef.current = wf;
        if (channels.length > 0) {
          const channelInUrl = channels.find((c) => c.uuid === channelUuid);
          if (channelInUrl) {
            await handleChannelSelect(channelInUrl);
          }
        }
      }
    })();
  }, [channelUuid]);

  const handleMessageSelect = async (selectedMessage?: MessageType) => {
    selectMessage(selectedMessage);
    console.log('selected message', selectedMessage);
    if (wingFloClientRef.current == null || wingFloChannelRef.current == null)
      return;
    setReplies([]);
    if (selectedMessage == null) return;
    const message = await wingFloClientRef.current.getMessage({
      channelUuid: wingFloChannelRef.current.uuid,
      messageUuid: selectedMessage.uuid,
    });

    const replies = await message.getThreadedMessagesByTimestamp({});
    setReplies(replies);

    wingFloMessageCollectionRef.current?.setMessageCollectionHandler({
      onMessagesReceived: (channel, newMessages) => {
        console.log('got message', newMessages);
        console.log('current selected message', selectedMessage);
        const newMessage = newMessages[0];
        if (newMessage.parent_message_uuid == null) {
          setMessages((messages) => [...messages, ...newMessages]);
        } else if (selectedMessage?.uuid === newMessage.parent_message_uuid) {
          console.log('message is a reply to selected message, adding it');
          setReplies((replies) => [...replies, ...newMessages]);
        }
      },
    });
    console.log('replies', replies);
  };

  const handleSendMessage = async (
    message: string,
    parentMessage?: MessageType,
  ) => {
    if (wingFloChannelRef.current == null) return;
    await wingFloChannelRef.current.sendMessage({
      message: message,
      attachments: uploadFiles
        .filter((file) => file.status === 'done')
        .map((file) => ({
          bucket_name: file.bucket!,
          file_key: file.fileKey!,
          original_file_name: file.name,
          content_type: file.type!,
        })),
      parentMessageUuid: parentMessage?.uuid,
    });
    setUploadFiles([]);
  };

  const handleChannelSelect = async (chn: ChannelListRes) => {
    if (wingFloClientRef.current == null) return;
    if (wingFloMessageCollectionRef.current) {
      wingFloMessageCollectionRef.current.dispose();
      console.log(`Disposed of prev msg collection`);
    }
    const selectedChannel = await wingFloClientRef.current.getChannel(chn.uuid);
    await selectedChannel.enter();
    wingFloChannelRef.current = selectedChannel;
    selectChannel(chn);
    const messageCollection = selectedChannel.createMessageCollection({});
    wingFloMessageCollectionRef.current = messageCollection;
    console.log('Registered msg collection ref', messageCollection);
    const messages = await messageCollection.loadPrevious();
    setMessages(messages);
    console.log('registering msg handler');
    messageCollection.setMessageCollectionHandler({
      onMessagesReceived: (channel, newMessages) => {
        console.log('got message', newMessages);
        console.log('current selected message', selectedMessage);
        const newMessage = newMessages[0];
        if (newMessage.parent_message_uuid == null) {
          setMessages((messages) => {
            if (messages.length >= MAX_MESSAGES_TO_KEEP_LOCALLY) {
              // Calculate the starting index for slicing
              const startIndex = messages.length - MAX_MESSAGES_TO_KEEP_LOCALLY;
              // Create a new array with the last 1000 items
              return [...messages.slice(startIndex), ...newMessages];
            }
            return [...messages, ...newMessages];
          });
        } else if (selectedMessage?.uuid === newMessage.parent_message_uuid) {
          console.log('message is a reply to selected message, adding it');
          setReplies((replies) => {
            if (replies.length >= MAX_MESSAGES_TO_KEEP_LOCALLY) {
              // Calculate the starting index for slicing
              const startIndex = messages.length - MAX_MESSAGES_TO_KEEP_LOCALLY;
              // Create a new array with the last 1000 items
              return [...replies.slice(startIndex), ...newMessages];
            }
            return [...replies, ...newMessages];
          });
        }
      },
    });
  };

  const handleAttachmentUpload = async (file: CustomUploadFile) => {
    if (wingFloClientRef.current == null || wingFloChannelRef.current == null)
      return;
    if (file == null) {
      console.warn('no file object', file);
      return;
    }

    setUploadFiles((uploadFiles) => [
      ...uploadFiles,
      {
        ...file,
        name: file.name,
        status: 'uploading',
      },
    ]);
    try {
      const attachment = await wingFloChannelRef.current.uploadFile(
        file as RcFile,
      );
      setUploadFiles((uploadFiles) =>
        uploadFiles.map((f) => {
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
        }),
      );
    } catch (err) {
      console.error('Failed to upload file', err);
      setUploadFiles((uploadFiles) =>
        uploadFiles.map((f) => {
          if (f.uid === file.uid) {
            return {
              ...f,
              status: 'error',
            };
          }
          return f;
        }),
      );
    }
  };

  if (selectedApplication == null || user == null || sessionToken == null)
    return null;

  return (
    <Layout
      style={{
        flexGrow: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        background: '#fff',
      }}
    >
      <ChannelListSideBar
        application={selectedApplication}
        channels={channels}
        selectedChannel={selectedChannel}
        onSelectChannel={handleChannelSelect}
      />
      <ChannelChatBox
        chatBoxBorderColor={token.colorPrimaryBorder}
        infoButtonActive={channelInfoRightSideBarVisible}
        onInfoButtonClick={() =>
          setChannelInfoRightSideBarVisible((visible) => !visible)
        }
        user={user}
        sessionToken={sessionToken}
        channelName={selectedChannel?.name ?? ''}
        messages={messages}
        onSendMessage={handleSendMessage}
        onUpload={handleAttachmentUpload}
        uploadFiles={uploadFiles}
        onUploadRemove={(file) => {
          setUploadFiles((uploadFiles) =>
            uploadFiles.filter((f) => f.uid !== file.uid),
          );
        }}
        selectedMessage={selectedMessage}
        onMessageSelect={handleMessageSelect}
        replies={replies}
      />

      {channelInfoRightSideBarVisible && (
        <ChannelInfoSideBar
          onClose={() => setChannelInfoRightSideBarVisible(false)}
        />
      )}
    </Layout>
  );
};

export default observer(ChannelChatPage);
