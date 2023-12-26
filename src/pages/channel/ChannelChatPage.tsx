import React, { useContext, useEffect, useState } from 'react';
import { Row, theme } from 'antd';
import { CommonStoreContext } from '../../index';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { ChannelListSideBar } from '../../components/channel/ChannelListSideBar';
import ChannelChatBox from '../../components/channel/ChannelChatBox';
import { ChannelInfoSideBar } from '../../components/channel/ChannelInfoSideBar';
import { ChannelListRes } from '@wingflo/js-sdk';
import { MessageType } from '../../types/message';
import { CustomUploadFile } from '../../types/attachment';
import { ChatStoreContext } from '../application/ApplicationRoot';
import { flowResult } from 'mobx';
import { useScrollBottom } from '../../hooks/useScrollBottom';

const ChannelChatPage = () => {
  const [channelInfoRightSideBarVisible, setChannelInfoRightSideBarVisible] =
    useState(true);

  const commonStore = useContext(CommonStoreContext);
  const chatStore = useContext(ChatStoreContext);
  const { selectedApplication } = commonStore;
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const chatMessageBoxRef = React.useRef<HTMLDivElement>(null);
  const replyMessageBoxRef = React.useRef<HTMLDivElement>(null);
  const [isChatMessageBoxScrollAtBottom, scrollChatMessageBoxToBottom] =
    useScrollBottom(chatMessageBoxRef);
  const [_, scrollReplyMessageBoxToBottom] =
    useScrollBottom(replyMessageBoxRef);
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
    if (selectedApplication == null) {
      console.debug('no selected application');
      return;
    }
    if (commonStore.moderator == null) {
      navigate(`/${selectedApplication.uuid}/channels`);
      return;
    }
    (async () => {
      await chatStore.initWfClient(
        selectedApplication.id,
        selectedApplication.uuid,
        commonStore.moderator!.username,
      );
      console.debug('wf client initialized');
      await chatStore.fetchChatChannels();
      const defaultSelectedChannel = chatStore.channels.find(
        (ch) => ch.uuid === channelUuid,
      );
      if (defaultSelectedChannel != null) {
        await flowResult(
          chatStore.selectChatChannel(defaultSelectedChannel, handleNewMessage),
        );
      }
      console.debug('fetched chat channels');
    })();
  }, [channelUuid, commonStore.moderator]);

  const handleNewMessage = (message: MessageType) => {
    if (message.user.username === commonStore.moderator?.username) {
      if (message.parent_message_uuid == null) {
        scrollChatMessageBoxToBottom();
      } else if (
        message.parent_message_uuid === chatStore.selectedMessage?.uuid
      ) {
        scrollReplyMessageBoxToBottom();
      }
    }
  };

  const handleMessageSelect = async (selectedMessage?: MessageType) => {
    await flowResult(chatStore.selectChatMessage(selectedMessage));
  };

  const handleSendMessage = async (
    message: string,
    parentMessage?: MessageType,
  ) => {
    await flowResult(chatStore.sendMessage(message, parentMessage));
    if (chatMessageBoxRef.current != null) {
      if (parentMessage == null) {
        scrollChatMessageBoxToBottom();
      } else {
        scrollReplyMessageBoxToBottom();
      }
    }
  };

  const handleChannelSelect = async (chn: ChannelListRes) => {
    console.debug('handling channel select');
    await flowResult(chatStore.selectChatChannel(chn));
    if (chatMessageBoxRef.current != null) {
      console.debug(
        'scrolling to bottom',
        chatMessageBoxRef.current.scrollHeight,
      );
      chatMessageBoxRef.current.scrollTop =
        chatMessageBoxRef.current.scrollHeight;
    }
  };

  const handleAttachmentUpload = async (file: CustomUploadFile) => {
    await flowResult(chatStore.handleAttachmentUpload(file));
  };

  if (selectedApplication == null || commonStore.moderator == null) {
    console.debug(
      `no selected application: ${selectedApplication} or chatting user: ${chatStore.chattingUser}}`,
    );
    return null;
  }

  return (
    <Row
      wrap={false}
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
        channels={chatStore.channels}
        selectedChannel={chatStore.selectedChatChannel}
        onSelectChannel={handleChannelSelect}
      />
      <ChannelChatBox
        chatMessageBoxRef={chatMessageBoxRef}
        isChatMessageBoxScrollAtBottom={isChatMessageBoxScrollAtBottom}
        scrollChatMessageBoxToBottom={scrollChatMessageBoxToBottom}
        replyMessageBoxRef={replyMessageBoxRef}
        chatBoxBorderColor={token.colorPrimaryBorder}
        infoButtonActive={channelInfoRightSideBarVisible}
        onInfoButtonClick={() =>
          setChannelInfoRightSideBarVisible((visible) => !visible)
        }
        channel={chatStore.chatChannel}
        messages={chatStore.chatMessages}
        replies={chatStore.chatReplies}
        onSendMessage={handleSendMessage}
        onUpload={handleAttachmentUpload}
        uploadFiles={chatStore.uploadFiles}
        onUploadRemove={chatStore.handleAttachmentUploadRemove}
        onReplyUploadRemove={chatStore.handleReplyAttachmentUploadRemove}
        selectedMessage={chatStore.selectedMessage}
        onMessageSelect={handleMessageSelect}
        messagesLoading={chatStore.chatMessagesState === 'pending'}
        repliesLoading={chatStore.chatRepliesState === 'pending'}
        replyUploadFiles={chatStore.replyUploadFiles}
        onReplyUpload={async (file) => {
          await flowResult(chatStore.handleReplyAttachmentUpload(file));
        }}
      />

      {channelInfoRightSideBarVisible && (
        <ChannelInfoSideBar
          onClose={() => setChannelInfoRightSideBarVisible(false)}
        />
      )}
    </Row>
  );
};

export default observer(ChannelChatPage);
