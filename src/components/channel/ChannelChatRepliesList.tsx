import React from 'react';
import { MessageLine } from '../message/MessageLine';
import { MessageType } from '../../types/message';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import List from 'react-virtualized/dist/commonjs/List';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { UserListRes } from '../../types/user';
import { ReactionOpType } from '../../types/reaction';

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultWidth: 280,
  defaultHeight: 50,
});
export const ChannelChatRepliesList = ({
  replies,
  repliesListRef,
  onReaction,
  currentUser,
}: {
  replies: MessageType[];
  repliesListRef: React.RefObject<List>;
  onReaction: (
    message: MessageType,
    reaction: string,
    op: ReactionOpType,
  ) => void;
  currentUser: UserListRes | null;
}) => {
  console.log('replies', replies);
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AutoSizer disableWidth>
        {({ height }) => (
          <List
            ref={repliesListRef}
            height={height}
            width={280}
            rowCount={replies.length}
            overscanRowCount={100}
            rowHeight={cache.rowHeight}
            deferredMeasurementCache={cache}
            rowRenderer={({ index, key, style, parent }) => {
              const reply = replies[index];
              return (
                <CellMeasurer
                  cache={cache}
                  parent={parent}
                  rowIndex={index}
                  key={key}
                >
                  <MessageLine
                    key={key}
                    style={style}
                    message={reply}
                    displayMode="thread-compact"
                    onReaction={onReaction}
                    currentUser={currentUser}
                  />
                </CellMeasurer>
              );
            }}
          />
        )}
      </AutoSizer>
    </div>
  );
};
