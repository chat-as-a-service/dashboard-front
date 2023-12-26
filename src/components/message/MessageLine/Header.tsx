import React from 'react';
import { observer } from 'mobx-react-lite';
import { MessageType } from '../../../types/message';
import { DisplayMode } from './MessageLine.types';
import { Space, Tooltip, Typography } from 'antd';
import { Utils } from '../../../core/Util';
import dayjs from 'dayjs';
import styled from 'styled-components';

const { Text } = Typography;

const AvatarTimestamp = styled.time`
  color: #5e5e5e;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`;
const Header = ({
  displayMode,
  message,
}: {
  displayMode: DisplayMode;
  message: MessageType;
}) => {
  if (displayMode === 'compact') return null;
  return (
    <Space>
      <Text strong>{message.user.nickname}</Text>
      <Tooltip
        title={Utils.unixMsTsToDateTimeString(message.created_at)}
        mouseLeaveDelay={0}
        mouseEnterDelay={0}
        overlayInnerStyle={{ fontSize: 12 }}
      >
        <AvatarTimestamp>
          {(() => {
            const ts = dayjs(message.created_at);
            switch (displayMode) {
              case 'full':
                return ts.format('H:mm A');
              case 'thread-full':
                return ts.format('MMM DD [at] H:mm A');
              case 'thread-compact':
                return dayjs().from(ts);
            }
          })()}
        </AvatarTimestamp>
      </Tooltip>
    </Space>
  );
};

export default observer(Header);
