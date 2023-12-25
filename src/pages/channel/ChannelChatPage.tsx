import React, { useContext, useEffect, useState } from 'react';
import { Layout, theme } from 'antd';
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
import List from 'react-virtualized/dist/commonjs/List';
import { CellMeasurerCache } from 'react-virtualized';
import { useMeasure } from '@uidotdev/usehooks';

const messagesListCellMeasurerCache = new CellMeasurerCache({
  fixedWidth: true,
});

const ChannelChatPage = () => {
  const [channelInfoRightSideBarVisible, setChannelInfoRightSideBarVisible] =
    useState(true);

  const commonStore = useContext(CommonStoreContext);
  const chatStore = useContext(ChatStoreContext);
  const { selectedApplication } = commonStore;
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const chatListRef = React.useRef<List>(null);
  const repliesListRef = React.useRef<List>(null);
  const [chatMessageBoxRef, { width, height }] = useMeasure();
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
          chatStore.selectChatChannel(
            defaultSelectedChannel,
            handleMessageUpdate,
          ),
        );
      }
      console.debug('fetched chat channels');
    })();
  }, [channelUuid, commonStore.moderator]);

  const handleMessageUpdate = (messageUuid?: string) => {
    // messagesListCellMeasurerCache.clearAll();
    // chatListRef.current?.recomputeRowHeights();
    // chatListRef.current?.render();
  };

  const handleMessageSelect = async (selectedMessage?: MessageType) => {
    await flowResult(chatStore.selectChatMessage(selectedMessage));
  };

  const handleSendMessage = async (
    message: string,
    parentMessage?: MessageType,
  ) => {
    await flowResult(chatStore.sendMessage(message, parentMessage));
    if (parentMessage == null) {
      chatListRef.current?.scrollToRow(chatStore.chatMessages.length - 1);
    } else {
      repliesListRef.current?.scrollToRow(chatStore.chatReplies.length - 1);
    }
  };

  const handleChannelSelect = async (chn: ChannelListRes) => {
    console.debug('handling channel select');
    messagesListCellMeasurerCache.clearAll();
    await flowResult(chatStore.selectChatChannel(chn));
    chatListRef.current?.recomputeRowHeights();
    chatListRef.current?.scrollToRow(chatStore.chatMessages.length - 1);
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
        channels={chatStore.channels}
        selectedChannel={chatStore.selectedChatChannel}
        onSelectChannel={handleChannelSelect}
      />
      <ChannelChatBox
        chatMessageBoxRef={chatMessageBoxRef}
        chatMessageBoxWidth={width ?? 300}
        chatMessageBoxHeight={height ?? 300}
        chatBoxBorderColor={token.colorPrimaryBorder}
        infoButtonActive={channelInfoRightSideBarVisible}
        onInfoButtonClick={() =>
          setChannelInfoRightSideBarVisible((visible) => !visible)
        }
        channelName={chatStore.chatChannel?.name ?? ''}
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
        chatListRef={chatListRef}
        repliesListRef={repliesListRef}
        chatListCellMeasurerCache={messagesListCellMeasurerCache}
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
