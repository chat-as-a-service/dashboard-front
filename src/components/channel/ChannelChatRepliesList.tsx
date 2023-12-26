import React, { SetStateAction } from 'react';
import { MessageLine } from '../message/MessageLine';
import { MessageType } from '../../types/message';
import { UserListRes } from '../../types/user';
import { ReactionOpType } from '../../types/reaction';
import { Empty } from 'antd';

export const ChannelChatRepliesList = ({
  replies,
  onReaction,
  currentUser,
  setChatDropdownMaskVisible,
}: {
  replies: MessageType[];
  onReaction: (
    message: MessageType,
    reaction: string,
    op: ReactionOpType,
  ) => void;
  currentUser: UserListRes | null;
  setChatDropdownMaskVisible: React.Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div>
      {replies.length === 0 && (
        <Empty description="No replies" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {replies.map((reply) => {
        return (
          <MessageLine
            key={reply.uuid}
            message={reply}
            displayMode="thread-compact"
            onReaction={onReaction}
            currentUser={currentUser}
            setChatDropdownMaskVisible={setChatDropdownMaskVisible}
          />
        );
      })}
    </div>
  );
};
