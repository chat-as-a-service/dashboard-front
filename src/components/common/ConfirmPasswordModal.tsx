import React, { ReactNode } from 'react';
import { Input, Modal, Typography } from 'antd';

const { Text } = Typography;

type FormFieldType = {
  applicationName?: string;
};

export const ConfirmPasswordModal = ({
  open,
  onSubmit,
  onCancel,
  subTitle,
}: {
  open: boolean;
  onSubmit: (
    password: string,
    setLoading: (modalOpen: boolean) => void,
  ) => Promise<void>;
  onCancel: () => void;
  subTitle?: ReactNode;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState('');

  const handleCancel = () => {
    onCancel();
  };

  const handleOk = async () => {
    await onSubmit(password, setLoading);
    setPassword('');
  };

  return (
    <Modal
      title="Confirm password"
      width={480}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      okText="OK"
      confirmLoading={loading}
    >
      <p>
        <Text>{subTitle}</Text>
      </p>
      <Input.Password
        size="large"
        placeholder="Enter account password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
    </Modal>
  );
};
