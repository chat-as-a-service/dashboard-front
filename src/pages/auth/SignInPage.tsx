import React from 'react';
import { Alert, Button, Form, Input, Layout, theme, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axiosInstance from '../../axiosInstance';
import { AccountRepository } from '../../repository/AccountRepository';
import LogoImg from '../../static/images/wingflo-logo-white-wide-sm.png';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

type FieldType = {
  email?: string;
  password?: string;
};

const StyledForm = styled(Form)`
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  margin: 0px auto;
  width: 100%;
  padding: 24px;
`;

const FormContainer = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  width: 100%;
  max-width: 488px;
`;

const SignInPage = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [form] = Form.useForm();

  const onFinish = async (values: FieldType) => {
    setErrorMsg(undefined);
    setLoading(true);
    try {
      const signInRes = await AccountRepository.signIn(
        values.email!,
        values.password!,
      );
      localStorage.setItem('accessToken', signInRes.token);
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${signInRes.token}`;
      navigate('/');
    } catch (err) {
      setErrorMsg('Failed to authenticate');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Header
        style={{ display: 'flex', alignItems: 'center', paddingLeft: 20 }}
      >
        <img alt="WingFlo logo" src={LogoImg} height={35} />
      </Header>
      <Content style={{ padding: '0 50px', height: '100%' }}>
        <Layout style={{ padding: '24px 0', background: '#fff' }}>
          <Content
            style={{
              padding: '0 24px',
              minHeight: 800,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <FormContainer>
              <Title style={{ textAlign: 'center' }}>
                Sign into your account
              </Title>

              <StyledForm
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 24 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
                requiredMark={false}
              >
                {errorMsg && (
                  <Form.Item>
                    <Alert
                      message="Error"
                      description="This is an error message about copywriting."
                      type="error"
                      showIcon
                    />
                  </Form.Item>
                )}
                <Form.Item
                  wrapperCol={{ offset: 0, span: 24 }}
                  style={{ textAlign: 'right' }}
                >
                  <Text>
                    Don't have an account?{' '}
                    <Link to="/auth/signup">Sign up</Link>
                  </Text>
                </Form.Item>
                <Form.Item<FieldType>
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email' },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Please input your password' },
                  ]}
                >
                  <Input.Password size="large" />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    style={{ fontWeight: 'bold', height: 38 }}
                  >
                    Sign in
                  </Button>
                </Form.Item>
              </StyledForm>
            </FormContainer>
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}></Footer>
    </Layout>
  );
};
export default SignInPage;
