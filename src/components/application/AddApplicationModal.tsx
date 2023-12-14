import React from 'react';
import { Form, Input, Modal } from 'antd';
import { ApplicationRepository } from '../../repository/ApplicationRepository';

type FormFieldType = {
  applicationName?: string;
};

export const AddApplicationModal = ({
  open,
  onOk,
  onCancel,
  organizationId,
}: {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  organizationId?: number;
}) => {
  const [formSubmitting, setFormSubmitting] = React.useState(false);
  const [form] = Form.useForm();
  const formValues: FormFieldType = Form.useWatch([], form);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const onFormFinish = async () => {
    if (organizationId == null) return;
    try {
      await form.validateFields();
    } catch (e) {
      console.warn('Form validation failed', e);
      return;
    }
    setFormSubmitting(true);

    await ApplicationRepository.createApplication({
      name: formValues.applicationName!,
    });
    form.resetFields();

    setFormSubmitting(false);
    onOk();
  };

  return (
    <Modal
      title="Create application"
      open={open}
      onOk={onFormFinish}
      onCancel={handleCancel}
      maskClosable={false}
      okText="Create"
      confirmLoading={formSubmitting}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item<FormFieldType>
          label="Application name"
          name="applicationName"
          rules={[
            {
              required: true,
              message: 'Please input an application name',
            },
            {
              message: 'Application name must be less than 100 characters',
              max: 100,
            },
          ]}
        >
          <Input placeholder="Enter application name"></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
};
