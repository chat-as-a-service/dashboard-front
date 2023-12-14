import { Button, Col, Form, Input, Layout, Row, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ApplicationRepository } from '../../repository/ApplicationRepository';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

type FieldType = {
  appName?: string;
};

const StyledForm = styled(Form)``;

const FormContainer = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  max-width: 800px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin: 0px auto;
  width: 800px;
  height: 312px;
  padding: 32px 40px 24px;
  background: #fff;
`;
const OnboardingCreateAppSubPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values: FieldType) => {
    console.log('Success:', values);
    await ApplicationRepository.createApplication({
      name: values.appName!,
    });
    navigate('/');
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <FormContainer>
      <Row>
        <Col span={10}>
          <Title>Create application</Title>
        </Col>
        <Col span={14}>
          <StyledForm
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item<FieldType>
              label="Application name"
              name="appName"
              rules={[{ required: true, message: 'Please input your email' }]}
            >
              <Input size="large" placeholder="Enter application name" />
            </Form.Item>

            <Form.Item
              wrapperCol={{ offset: 0, span: 24 }}
              style={{ textAlign: 'right' }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{ fontWeight: 'bold', height: 38, width: 80 }}
              >
                Create
              </Button>
            </Form.Item>
          </StyledForm>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default OnboardingCreateAppSubPage;
