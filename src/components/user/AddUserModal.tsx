import { Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';
import { ApplicationListRes } from '../../types/application';
import { UserRepository } from '../../repository/UserRepository';

type AddUserFormFieldType = {
  username?: string;
  nickname?: string;
};

export const AddUserModal = ({
  open,
  onOk,
  onCancel,
  application,
}: {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  application: ApplicationListRes | null;
}) => {
  const [formSubmitting, setFormSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    return () => {
      form.resetFields();
      setFormSubmitting(false);
    };
  }, []);

  if (application == null) return null;

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const onFormFinish = async () => {
    try {
      await form.validateFields();
    } catch (e) {
      console.warn('Form validation failed', e);
      return;
    }
    setFormSubmitting(true);

    await UserRepository.createUser({
      application_id: application.id,
      username: form.getFieldValue('username'),
      nickname: form.getFieldValue('nickname'),
    });
    form.resetFields();

    setFormSubmitting(false);
    onOk();
  };

  return (
    <Modal
      title="New user"
      open={open}
      onOk={onFormFinish}
      onCancel={handleCancel}
      maskClosable={false}
      okText="Create"
      confirmLoading={formSubmitting}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        autoComplete="off"
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item<AddUserFormFieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input a username' }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item<AddUserFormFieldType>
          label="Nickname"
          name="nickname"
          rules={[{ required: true, message: 'Please input a nickname' }]}
        >
          <Input size="large" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
