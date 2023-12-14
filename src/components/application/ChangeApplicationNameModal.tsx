import React from 'react';
import { Form, Input, Modal } from 'antd';
import { ApplicationRepository } from '../../repository/ApplicationRepository';
import { ApplicationListRes } from '../../types/application';

type FormFieldType = {
  applicationName?: string;
};

export const ChangeApplicationNameModal = ({
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
  const formValues: FormFieldType = Form.useWatch([], form);

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

    await ApplicationRepository.editApplication(application.id, {
      name: formValues.applicationName!,
    });
    form.resetFields();

    setFormSubmitting(false);
    onOk();
  };

  return (
    <Modal
      title="Change app name"
      open={open}
      onOk={onFormFinish}
      onCancel={handleCancel}
      maskClosable={false}
      okText="Save"
      confirmLoading={formSubmitting}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          applicationName: application.name,
        }}
      >
        <Form.Item<FormFieldType>
          label="App name"
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
