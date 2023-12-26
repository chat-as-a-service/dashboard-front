import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Space } from 'antd';
import { ReactionOpType, ReactionToEmojiMap } from '../../../types/reaction';
import { MessageType, ReactionType } from '../../../types/message';

const Reactions = ({
  message,
  onReaction,
  userReactedMap,
}: {
  message: MessageType;
  userReactedMap: Record<string, boolean>;
  onReaction?: (
    message: MessageType,
    reaction: string,
    op: ReactionOpType,
  ) => void;
}) => {
  const reactionMap = useMemo(() => {
    const map: Record<string, ReactionType[]> = {};
    for (const reaction of message.reactions
      .slice()
      .sort((a, b) => a.reaction.localeCompare(b.reaction))) {
      map[reaction.reaction] = [...(map[reaction.reaction] ?? []), reaction];
    }
    return map;
  }, [message.reactions]);

  return (
    <Space style={{ marginTop: 5 }}>
      {Object.entries(reactionMap).map(([reaction, reactions]) => {
        const userAlreadyReacted = userReactedMap?.[reaction] ?? false;
        return (
          <Button
            key={reaction}
            size="small"
            icon={ReactionToEmojiMap[reaction]}
            type={userAlreadyReacted ? 'primary' : 'text'}
            onClick={() =>
              onReaction?.(
                message,
                reaction,
                userAlreadyReacted ? 'delete' : 'add',
              )
            }
          >
            <span>{reactions.length}</span>
          </Button>
        );
      })}
    </Space>
  );
};

export default observer(Reactions);
