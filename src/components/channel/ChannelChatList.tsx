import React, { SetStateAction } from 'react';
import { MessageType } from '../../types/message';
import { observer } from 'mobx-react-lite';
import { UserListRes } from '../../types/user';
import { ReactionOpType } from '../../types/reaction';
import { Empty, notification, Spin } from 'antd';
import styled from 'styled-components';
import dayjs from 'dayjs';
import MessageLine from '../message/MessageLine';

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  min-height: 100%;
  width: 100%;
`;

const ChannelChatList = ({
  loading,
  messages,
  onMessageSelect,
  onReaction,
  currentUser,
  setChatDropdownMaskVisible,
}: {
  loading: boolean;
  messages: MessageType[];
  onMessageSelect: (message: MessageType) => void;
  onReaction: (
    message: MessageType,
    reaction: string,
    op: ReactionOpType,
  ) => void;
  currentUser: UserListRes | null;
  setChatDropdownMaskVisible: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  if (loading) {
    return (
      <Box>
        <Spin spinning={true} />
      </Box>
    );
  }
  return (
    <Box>
      {notificationContextHolder}
      {messages.length === 0 && !loading && (
        <Empty style={{ margin: '50px 0' }} description="No Messages" />
      )}
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
            wrapperStyle={{ width: '100%' }}
            key={message.uuid}
            message={message}
            displayMode={displayFull ? 'full' : 'compact'}
            onMessageSelect={() => {
              onMessageSelect(message);
            }}
            onReaction={onReaction}
            currentUser={currentUser}
            showDateLine={firstMsgOfTheDay}
            setChatDropdownMaskVisible={setChatDropdownMaskVisible}
            notificationApi={notificationApi}
          />
        );
      })}
    </Box>
  );
};

export default observer(ChannelChatList);
