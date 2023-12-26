import React from 'react';
import { MessageLine } from '../message/MessageLine';
import { MessageType } from '../../types/message';
import { observer } from 'mobx-react-lite';
import { UserListRes } from '../../types/user';
import { ReactionOpType } from '../../types/reaction';
import dayjs from 'dayjs';
import { Empty, Spin } from 'antd';
import styled from 'styled-components';

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const ChannelChatList = ({
  loading,
  messages,
  onMessageSelect,
  onReaction,
  onMessageDelete,
  currentUser,
}: {
  loading: boolean;
  messages: MessageType[];
  onMessageSelect: (message: MessageType) => void;
  onReaction: (
    message: MessageType,
    reaction: string,
    op: ReactionOpType,
  ) => void;
  onMessageDelete?: (message: MessageType) => void;
  currentUser: UserListRes | null;
}) => {
  if (loading) {
    return (
      <Box>
        <Spin spinning={true} />
      </Box>
    );
  }
  return (
    <Box>
      {messages.length === 0 && !loading && <Empty description="No messages" />}
      {messages.map((message, index) => {
        let displayFull = false;
        let firstMsgOfTheDay = false;

        if (index === 0) {
          firstMsgOfTheDay = true;
        } else {
          const prevMessageDate = dayjs(messages[index - 1].created_at);
          const currentMessageDate = dayjs(message.created_at);
          if (prevMessageDate.diff(currentMessageDate, 'day') > 0) {
            firstMsgOfTheDay = true;
          }
        }

        if (
          index > 0 &&
          (messages[index - 1].user.username !== message.user.username ||
            message.created_at - messages[index - 1].created_at > 300000)
        ) {
          displayFull = true;
        } else if (index === 0) {
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
            onMessageDelete={onMessageDelete}
            onReaction={onReaction}
            currentUser={currentUser}
            showDateLine={firstMsgOfTheDay}
          />
        );
      })}
    </Box>
  );
};

export default observer(ChannelChatList);
