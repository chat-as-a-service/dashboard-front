import {
  Button,
  Col,
  Divider,
  Flex,
  Row,
  Space,
  Spin,
  Tooltip,
  Typography,
} from 'antd';
import defaultChannelImg from '../../static/images/default-channel-image-1.png';
import {
  CloseOutlined,
  DownOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { MessageLine } from '../message/MessageLine';
import { MessageType } from '../../types/message';
import { CustomUploadFile } from '../../types/attachment';
import { ChatInputBox } from '../message/ChatInputBox';
import { ChannelChatRepliesList } from './ChannelChatRepliesList';
import ChannelChatList from './ChannelChatList';
import { observer } from 'mobx-react-lite';
import { ChatStoreContext } from '../../pages/application/ApplicationRoot';
import { flowResult } from 'mobx';
import { CommonStoreContext } from '../../index';
import { ReactionOpType } from '../../types/reaction';
import { Channel as WFChannel } from '@wingflo/js-sdk';

const { Title } = Typography;
const Box = styled(Col)`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
  background: #fff;
  width: 660px;
`;

const ChannelChatHeader = styled.div`
  border-bottom: 1px solid #e0e0e0;
  flex: 0 0 64px;
  padding: 0 12px 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatMessageBoxWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  position: relative;
  overflow-y: auto;
`;

const ChatInputBoxWrapper = styled.div`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  margin: 0 16px 16px;
`;

const ChatMessageBox = styled.div`
  overflow-y: auto;
  padding-bottom: 16px;
  height: 100%;
  width: 100%;
`;

const ThreadDrawerCol = styled(Col)`
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e0e0e0;
  width: 280px;
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

const ScrollToBottomWrapper = styled.div`
  max-width: 988px;
  width: 100%;
  height: 0;
  position: relative;
  display: flex;
  justify-content: flex-end;
  margin: 0 auto;
`;

const ScrollToBottomButton = styled(Button)`
  position: absolute;
  bottom: 8px;
  right: 16px;
`;
const ChannelChatBox = ({
  chatMessageBoxRef,
  isChatMessageBoxScrollAtBottom,
  scrollChatMessageBoxToBottom,
  replyMessageBoxRef,
  chatBoxBorderColor,
  infoButtonActive,
  onInfoButtonClick,
  channel,
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
}: {
  chatMessageBoxRef: React.RefObject<HTMLDivElement>;
  isChatMessageBoxScrollAtBottom: boolean;
  scrollChatMessageBoxToBottom: () => void;
  replyMessageBoxRef: React.RefObject<HTMLDivElement>;
  chatBoxBorderColor: string;
  infoButtonActive: boolean;
  onInfoButtonClick: () => void;
  channel?: WFChannel;
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
    <Box flex="1 0 auto">
      <ChannelChatHeader>
        <Space>
          <img
            alt={channel?.name ?? 'channel name'}
            src={defaultChannelImg}
            width={32}
            height={32}
            style={{ borderRadius: 4 }}
          />
          <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
            {channel?.name ?? ''}
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
      {/* ChannelChatBody */}
      <Row style={{ flexGrow: 1 }} wrap={false}>
        {/* ChannelChat main chat column (excluding threadbox column) */}
        <Col
          flex="1 0 auto"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc( 100vh - 48px - 64px )',
            width: 380,
          }}
        >
          {/*  chat box */}
          <ChatMessageBoxWrapper className="chat-message-box-wrapper">
            <ChatMessageBox ref={chatMessageBoxRef}>
              {/*<ChatMessageBoxOverlay />*/}
              <ChannelChatList
                loading={messagesLoading}
                messages={messages}
                onMessageSelect={onMessageSelect}
                onReaction={handleReaction}
                onMessageDelete={handleMessageDelete}
                currentUser={commonStore.moderator}
              />
            </ChatMessageBox>
          </ChatMessageBoxWrapper>

          <ScrollToBottomWrapper>
            <Tooltip title="Go to bottom">
              <ScrollToBottomButton
                type="primary"
                shape="circle"
                icon={<DownOutlined />}
                onClick={scrollChatMessageBoxToBottom}
                size="large"
                style={{
                  display: isChatMessageBoxScrollAtBottom ? 'block' : 'none',
                }}
              />
            </Tooltip>
          </ScrollToBottomWrapper>

          {/*chat input*/}
          <ChatInputBoxWrapper className="chat-input-box-wrapper">
            <ChatInputBox
              chatBoxBorderColor={chatBoxBorderColor}
              onSendMessage={onSendMessage}
              onUpload={onUpload}
              uploadFiles={uploadFiles}
              onUploadRemove={onUploadRemove}
              style={{ width: '100%' }}
            />
          </ChatInputBoxWrapper>
        </Col>

        {/* Replies */}
        {selectedMessage && (
          <ThreadDrawerCol flex="0 0 auto">
            <ThreadDrawerHeader justify="space-between" align="center">
              <span style={{ fontSize: 14, fontWeight: 600 }}>Thread</span>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => onMessageSelect(undefined)}
              />
            </ThreadDrawerHeader>
            {/*  selected msg*/}
            {repliesLoading ? (
              <Spin spinning={true} style={{ margin: '50px 0' }} />
            ) : (
              <>
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
                  ref={replyMessageBoxRef}
                >
                  <ChannelChatRepliesList
                    replies={replies}
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
              </>
            )}
          </ThreadDrawerCol>
        )}
      </Row>
    </Box>
  );
};

export default observer(ChannelChatBox);
