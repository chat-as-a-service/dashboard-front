import React from 'react';
import { observer } from 'mobx-react-lite';
import { Card } from 'antd';
import { MessageType } from '../../../types/message';

const LinkPreview = ({
  message,
  isThread,
}: {
  message: MessageType;
  isThread: boolean;
}) => {
  if (!message.og_tag) return null;
  return (
    <Card
      style={{
        width: isThread ? 200 : 300,
        margin: '10px 0',
        cursor: 'pointer',
      }}
      size={isThread ? 'small' : 'default'}
      onClick={() => window.open(message.og_tag?.url, '_blank')}
      cover={
        message.og_tag.image && (
          <img
            alt={message.og_tag.image_alt ?? message.og_tag.title}
            src={message.og_tag.image}
          />
        )
      }
      bodyStyle={{
        padding: 10,
      }}
    >
      <Card.Meta
        title={
          <span
            style={{
              fontSize: isThread ? 12 : 14,
              fontWeight: 400,
            }}
          >
            {message.og_tag.title}
          </span>
        }
      />
    </Card>
  );
};

export default observer(LinkPreview);
