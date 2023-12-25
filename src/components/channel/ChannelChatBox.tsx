import { Button, Divider, Flex, Space, Spin, Typography } from 'antd';
import defaultChannelImg from '../../static/images/default-channel-image-1.png';
import {
  CloseOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { MessageLine } from '../message/MessageLine';
import { MessageType } from '../../types/message';
import { CustomUploadFile } from '../../types/attachment';
import { ChatInputBox } from '../message/ChatInputBox';
import List from 'react-virtualized/dist/commonjs/List';
import { ChannelChatRepliesList } from './ChannelChatRepliesList';
import ChannelChatList from './ChannelChatList';
import { observer } from 'mobx-react-lite';
import { ChatStoreContext } from '../../pages/application/ApplicationRoot';
import { flowResult } from 'mobx';
import { CellMeasurerCache } from 'react-virtualized';
import { CommonStoreContext } from '../../index';
import { ReactionOpType } from '../../types/reaction';

const { Title } = Typography;
const ChannelChatHeader = styled.div`
  border-bottom: 1px solid #e0e0e0;
  height: 64px;
  padding: 0 12px 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatMessageBox = styled.div`
  flex: 1 1 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
`;

const ThreadDrawer = styled(Flex)`
  width: 280px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e0e0e0;
`;

const ThreadDrawerHeader = styled(Flex)`
  padding: 12px 10px 12px 16px;
`;

const ChatMessageBoxOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 100;
`;

const ChannelChatBox = ({
  chatMessageBoxRef,
  chatMessageBoxWidth,
  chatMessageBoxHeight,
  chatBoxBorderColor,
  infoButtonActive,
  onInfoButtonClick,
  channelName,
  messages,
  onSendMessage,
  onUpload,
  uploadFiles,
  onUploadRemove,
  onReplyUploadRemove,
  onMessageSelect,
  selectedMessage,
  replies,
  messagesLoading,
  repliesLoading,
  replyUploadFiles,
  onReplyUpload,
  chatListRef,
  repliesListRef,
  chatListCellMeasurerCache,
}: {
  chatMessageBoxRef: (instance: Element | null) => void;
  chatMessageBoxWidth: number;
  chatMessageBoxHeight: number;
  chatBoxBorderColor: string;
  infoButtonActive: boolean;
  onInfoButtonClick: () => void;
  channelName: string;
  messages: MessageType[];
  onSendMessage: (message: string, parentMessage?: MessageType) => void;
  onUpload: (file: CustomUploadFile) => void;
  uploadFiles: CustomUploadFile[];
  onUploadRemove: (file: CustomUploadFile) => void;
  onReplyUploadRemove: (file: CustomUploadFile) => void;
  onMessageSelect: (message?: MessageType) => void;
  selectedMessage?: MessageType;
  replies: MessageType[];
  messagesLoading: boolean;
  repliesLoading: boolean;
  replyUploadFiles: CustomUploadFile[];
  onReplyUpload: (file: CustomUploadFile) => void;
  chatListRef: React.RefObject<List>;
  repliesListRef: React.RefObject<List>;
  chatListCellMeasurerCache: CellMeasurerCache;
}) => {
  const chatStore = useContext(ChatStoreContext);
  const commonStore = useContext(CommonStoreContext);

  const handleReaction = async (
    message: MessageType,
    reaction: string,
    op: ReactionOpType,
  ) => {
    if (op === 'add') {
      await flowResult(chatStore.addReaction(message.uuid, reaction));
    } else {
      await flowResult(chatStore.deleteReaction(message.uuid, reaction));
    }
  };

  const handleMessageDelete = async (message: MessageType) => {
    console.debug('deleting msg', message.uuid);
    await flowResult(chatStore.deleteMessage(message.uuid));
  };

  return (
    <Flex
      vertical
      style={{
        background: '#fff',
        flexGrow: 1,
        minWidth: 500,
      }}
    >
      <ChannelChatHeader>
        <Space>
          <img
            src={defaultChannelImg}
            width={32}
            height={32}
            style={{ borderRadius: 4 }}
          />
          <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
            {channelName}
          </Title>
        </Space>
        <Space>
          <Button icon={<UserAddOutlined />} type="text" />
          <Button
            icon={<InfoCircleOutlined />}
            type={infoButtonActive ? 'primary' : 'text'}
            onClick={onInfoButtonClick}
          />
        </Space>
      </ChannelChatHeader>
      <Flex style={{ flexGrow: 1 }}>
        <Flex vertical style={{ flexGrow: 1 }}>
          {/*  chat box */}
          <ChatMessageBox ref={chatMessageBoxRef}>
            {/*<ChatMessageBoxOverlay />*/}
            <Spin
              spinning={messagesLoading}
              style={{ height: '100%', width: '100%' }}
            />
            <ChannelChatList
              width={chatMessageBoxWidth}
              height={chatMessageBoxHeight}
              messages={messages}
              chatListRef={chatListRef}
              onMessageSelect={onMessageSelect}
              onReaction={handleReaction}
              onMessageDelete={handleMessageDelete}
              chatListCellMeasurerCache={chatListCellMeasurerCache}
              currentUser={commonStore.moderator}
            />
          </ChatMessageBox>

          {/*chat input*/}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flex: '0 0 auto',
              margin: 16,
            }}
          >
            <ChatInputBox
              chatBoxBorderColor={chatBoxBorderColor}
              onSendMessage={onSendMessage}
              onUpload={onUpload}
              uploadFiles={uploadFiles}
              onUploadRemove={onUploadRemove}
              style={{ width: '100%' }}
            />
          </div>
        </Flex>
        {selectedMessage && (
          <ThreadDrawer>
            <ThreadDrawerHeader justify="space-between" align="center">
              <span style={{ fontSize: 14, fontWeight: 600 }}>Thread</span>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => onMessageSelect(undefined)}
              />
            </ThreadDrawerHeader>
            {/*  selected msg*/}
            <MessageLine
              message={selectedMessage}
              displayMode="thread-full"
              onReaction={handleReaction}
              currentUser={commonStore.moderator}
            />
            <Divider plain orientation="left">
              {selectedMessage.thread_info?.reply_count ?? 0} replies
            </Divider>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                height: 1,
              }}
            >
              <Spin
                spinning={repliesLoading}
                style={{ height: '100%', width: '100%' }}
              />
              <ChannelChatRepliesList
                replies={replies}
                repliesListRef={repliesListRef}
                onReaction={handleReaction}
                currentUser={commonStore.moderator}
              />
              <ChatInputBox
                chatBoxBorderColor={chatBoxBorderColor}
                onSendMessage={(message) =>
                  onSendMessage(message, selectedMessage)
                }
                onUpload={onReplyUpload}
                uploadFiles={replyUploadFiles}
                onUploadRemove={onReplyUploadRemove}
                style={{
                  margin: '10px 16px 16px',
                }}
              />
            </div>
          </ThreadDrawer>
        )}
      </Flex>
    </Flex>
  );
};

export default observer(ChannelChatBox);
