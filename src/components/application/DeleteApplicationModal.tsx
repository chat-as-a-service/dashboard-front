import React from 'react';
import { Form, Input, Modal, Typography } from 'antd';
import { ApplicationRepository } from '../../repository/ApplicationRepository';
import { ApplicationListRes } from '../../types/application';

const { Text } = Typography;

type FormFieldType = {
  applicationName?: string;
};

export const DeleteApplicationModal = ({
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
  const [submittable, setSubmittable] = React.useState(false);
  const formValues: FormFieldType = Form.useWatch([], form);

  React.useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      },
    );
  }, [formValues]);

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

    await ApplicationRepository.deleteApplication(application.id);
    form.resetFields();

    setFormSubmitting(false);
    onOk();
  };

  return (
    <Modal
      title="Delete application?"
      open={open}
      onOk={onFormFinish}
      onCancel={handleCancel}
      maskClosable={false}
      okText="Delete"
      confirmLoading={formSubmitting}
      okButtonProps={{ disabled: !submittable, loading: formSubmitting }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          applicationName: application.name,
        }}
      >
        <Form.Item>
          <Text type="danger">
            Once this application is deleted, your organization will no longer
            be able to access all related API and SDK features, and the data in
            your application can’t be restored.
          </Text>
        </Form.Item>
        <Form.Item>
          <Text>To proceed, enter your application name as shown:</Text>&nbsp;
          <Text keyboard>{application.name}</Text>
        </Form.Item>
        <Form.Item<FormFieldType>
          name="applicationName"
          rules={[
            {
              required: true,
              message: 'Check application name again.',
              validator: (_, value) => {
                if (value === application.name) {
                  return Promise.resolve();
                }
                return Promise.reject();
              },
            },
          ]}
        >
          <Input placeholder="Enter application name"></Input>
        </Form.Item>
      </Form>
    </Modal>
  );
};
