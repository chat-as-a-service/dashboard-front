import React from 'react';
import { Modal, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import { MessageType } from '../../types/message';
import MessageLine from './MessageLine/MessageLine';
import styled from 'styled-components';
import { AsyncOpState } from '../../types/common';

const { Text } = Typography;

const MessageWrapper = styled.div`
  border: 1px solid #e0e0e0;
  max-height: 280px;
  overflow-y: auto;
  padding: 18px;
`;

const DeleteMessageModal = ({
  open,
  onOk,
  onCancel,
  message,
  state,
}: {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  message: MessageType;
  state: AsyncOpState;
}) => {
  return (
    <Modal
      title="Delete this message?"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      maskClosable={false}
      okText="Delete"
      confirmLoading={state === 'pending'}
      okButtonProps={{
        danger: true,
        type: 'primary',
        loading: state === 'pending',
      }}
      width={480}
    >
      <p>
        <Text>Once deleted, this message can‘t be restored.</Text>
      </p>
      <MessageWrapper>
        <MessageLine
          innerStyle={{ padding: 0 }}
          message={message}
          displayMode="full"
          showReactions={false}
          showLinkPreview={false}
          showActionBox={false}
          highlightBgOnHover={false}
        />
      </MessageWrapper>
    </Modal>
  );
};

export default observer(DeleteMessageModal);
