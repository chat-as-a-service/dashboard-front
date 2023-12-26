import { Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';
import { ApplicationListRes } from '../../types/application';
import { ChannelRepository } from '../../repository/ChannelRepository';

type FormFieldType = {
  name?: string;
};

export const AddChannelModal = ({
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

    await ChannelRepository.createChannel({
      application_id: application.id,
      name: form.getFieldValue('name'),
    });
    form.resetFields();

    setFormSubmitting(false);
    onOk();
  };

  return (
    <Modal
      title="Create a channel"
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
        <Form.Item<FormFieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input a channel name' }]}
        >
          <Input size="large" placeholder="Enter channel name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
