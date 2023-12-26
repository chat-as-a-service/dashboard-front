import React from 'react';
import { observer } from 'mobx-react-lite';
import { MessageType } from '../../../types/message';
import { Utils } from '../../../core/Util';
import dayjs from 'dayjs';
import { Tooltip } from 'antd';
import styled from 'styled-components';

const MessageTimestamp = styled.time`
  color: #808080;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`;
const MessageTimestampLeft = ({
  message,
  visible,
}: {
  message: MessageType;
  visible: boolean;
}) => {
  return (
    <Tooltip
      title={Utils.unixMsTsToDateTimeString(message.created_at)}
      mouseLeaveDelay={0}
      mouseEnterDelay={0}
      overlayInnerStyle={{ fontSize: 12 }}
    >
      <MessageTimestamp style={{ opacity: visible ? 1 : 0 }}>
        {dayjs(message.created_at).format('HH:mm')}
      </MessageTimestamp>
    </Tooltip>
  );
};

export default observer(MessageTimestampLeft);
