import React from 'react';
import { observer } from 'mobx-react-lite';
import { Typography } from 'antd';
import { MessageType } from '../../../types/message';
import { Linkify } from './MessageLine.helpers';

const { Paragraph } = Typography;

const MessageContent = ({ message }: { message: MessageType }) => {
  return (
    <Paragraph style={{ margin: 0 }}>
      <Linkify>{message.message}</Linkify>
    </Paragraph>
  );
};

export default observer(MessageContent);
