import { Button, Divider, Flex, Space, Typography } from 'antd';
import defaultChannelImg from '../../static/images/default-channel-image-1.png';
import {
  CloseOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import { MessageLine } from '../message/MessageLine';
import { UserViewRes } from '../../types/user';
import { MessageType } from '../../types/message';
import { CustomUploadFile } from '../../types/attachment';
import { ChatInputBox } from '../message/ChatInputBox';

const { Text, Title } = Typography;
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

const ThreadMessagesBox = styled.div`
  overflow-y: auto;
`;

export const ChannelChatBox = ({
  chatBoxBorderColor,
  infoButtonActive,
  onInfoButtonClick,
  user,
  sessionToken,
  channelName,
  messages,
  onSendMessage,
  onUpload,
  uploadFiles,
  onUploadRemove,
  onMessageSelect,
  selectedMessage,
  replies,
}: {
  chatBoxBorderColor: string;
  infoButtonActive: boolean;
  onInfoButtonClick: () => void;
  user: UserViewRes;
  sessionToken: string;
  channelName: string;
  messages: MessageType[];
  onSendMessage: (message: string, parentMessage?: MessageType) => void;
  onUpload: (file: CustomUploadFile) => void;
  uploadFiles: CustomUploadFile[];
  onUploadRemove: (file: CustomUploadFile) => void;
  onMessageSelect: (message?: MessageType) => void;
  selectedMessage?: MessageType;
  replies: MessageType[];
}) => {
  const [chatInput, setChatInput] = useState('');
  const [replyChatInput, setReplyChatInput] = useState('');
  // const [selectedMessage, selectMessage] = useState<MessageType>();

  return (
    <Flex
      vertical
      style={{
        background: '#fff',
        flexGrow: 1,
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
          <ChatMessageBox>
            <div>
              {messages.map((message, idx) => {
                let displayFull = false;
                if (
                  idx > 0 &&
                  (messages[idx - 1].user.username !== message.user.username ||
                    message.created_at - messages[idx - 1].created_at > 300000)
                ) {
                  displayFull = true;
                } else if (idx === 0) {
                  displayFull = true;
                }
                return (
                  <MessageLine
                    key={message.uuid}
                    message={message}
                    displayMode={displayFull ? 'full' : 'compact'}
                    onMessageSelect={() => {
                      onMessageSelect(message);
                    }}
                  />
                );
              })}
            </div>
          </ChatMessageBox>

          {/*chat input*/}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flex: '0 0 auto',
              margin: '0px 16px 16px',
            }}
          >
            <ChatInputBox
              chatBoxBorderColor={chatBoxBorderColor}
              chatInput={chatInput}
              onChatInputChange={setChatInput}
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
            <MessageLine message={selectedMessage} displayMode="thread-full" />
            <Divider plain orientation="left">
              {selectedMessage.thread_info?.reply_count ?? 0} replies
            </Divider>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column-reverse',
                flexGrow: 1,
                height: 1,
              }}
            >
              <ThreadMessagesBox>
                {replies.map((message, idx) => {
                  return (
                    <MessageLine
                      key={message.uuid}
                      message={message}
                      displayMode="thread-compact"
                    />
                  );
                })}
                <ChatInputBox
                  chatBoxBorderColor={chatBoxBorderColor}
                  chatInput={replyChatInput}
                  onChatInputChange={setReplyChatInput}
                  onSendMessage={(message) =>
                    onSendMessage(message, selectedMessage)
                  }
                  onUpload={onUpload}
                  uploadFiles={uploadFiles}
                  onUploadRemove={onUploadRemove}
                  style={{
                    margin: '10px 16px 16px',
                  }}
                />
              </ThreadMessagesBox>
            </div>
          </ThreadDrawer>
        )}
      </Flex>
    </Flex>
  );
};
