import React from 'react';
import { MessageLine } from '../message/MessageLine';
import { MessageType } from '../../types/message';
import List from 'react-virtualized/dist/commonjs/List';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { observer } from 'mobx-react-lite';
import { UserListRes } from '../../types/user';
import { ReactionOpType } from '../../types/reaction';
import { Empty } from 'antd';
import dayjs from 'dayjs';

const ChannelChatList = ({
  width,
  height,
  messages,
  chatListRef,
  onMessageSelect,
  onReaction,
  onMessageDelete,
  chatListCellMeasurerCache,
  currentUser,
}: {
  width: number;
  height: number;
  messages: MessageType[];
  chatListRef: React.RefObject<List>;
  onMessageSelect: (message: MessageType) => void;
  onReaction: (
    message: MessageType,
    reaction: string,
    op: ReactionOpType,
  ) => void;
  onMessageDelete?: (message: MessageType) => void;
  chatListCellMeasurerCache: CellMeasurerCache;
  currentUser: UserListRes | null;
}) => {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <List
        {...messages.map((message) => message.uuid)}
        ref={chatListRef}
        height={height}
        width={width}
        rowCount={messages.length}
        overscanRowCount={20}
        noContentRenderer={() => <Empty />}
        rowHeight={chatListCellMeasurerCache.rowHeight}
        deferredMeasurementCache={chatListCellMeasurerCache}
        rowRenderer={({ index, key, style, parent }) => {
          let displayFull = false;
          const message = messages[index];
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
            <CellMeasurer
              cache={chatListCellMeasurerCache}
              parent={parent}
              rowIndex={index}
              key={key}
            >
              {({ measure, registerChild }) => (
                <MessageLine
                  registerChild={registerChild}
                  key={key}
                  message={message}
                  displayMode={displayFull ? 'full' : 'compact'}
                  onMessageSelect={() => {
                    onMessageSelect(message);
                  }}
                  onMessageDelete={onMessageDelete}
                  onReaction={onReaction}
                  style={style}
                  currentUser={currentUser}
                  showDateLine={firstMsgOfTheDay}
                  onReRender={measure}
                />
              )}
            </CellMeasurer>
          );
        }}
      />
    </div>
  );
};

export default observer(ChannelChatList);
