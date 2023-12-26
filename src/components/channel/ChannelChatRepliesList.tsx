import React from 'react';
import { MessageLine } from '../message/MessageLine';
import { MessageType } from '../../types/message';
import { UserListRes } from '../../types/user';
import { ReactionOpType } from '../../types/reaction';
import { Empty } from 'antd';

export const ChannelChatRepliesList = ({
  replies,
  onReaction,
  currentUser,
}: {
  replies: MessageType[];
  onReaction: (
    message: MessageType,
    reaction: string,
    op: ReactionOpType,
  ) => void;
  currentUser: UserListRes | null;
}) => {
  return (
    <div>
      {replies.length === 0 && (
        <Empty description="No replies" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {replies.map((reply, index) => {
        return (
          <MessageLine
            key={reply.uuid}
            message={reply}
            displayMode="thread-compact"
            onReaction={onReaction}
            currentUser={currentUser}
          />
        );
      })}
    </div>
  );
};
