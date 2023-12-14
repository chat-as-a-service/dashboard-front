import {
  Button,
  Checkbox,
  Form,
  FormInstance,
  Input,
  Layout,
  theme,
  Typography,
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../axiosInstance';
import { AccountRepository } from '../../repository/AccountRepository';
import { observer } from 'mobx-react-lite';
import { CommonStoreContext } from '../../index';
import LogoImg from '../../static/images/wingflo-logo-white-wide-sm.png';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

type FieldType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  tocAgreement?: boolean;
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

const SubmitButton = ({
  form,
  formLoading,
}: {
  form: FormInstance;
  formLoading: boolean;
}) => {
  const [submittable, setSubmittable] = React.useState(false);
  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      },
    );
  }, [values]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      disabled={!submittable}
      block
      style={{ fontWeight: 'bold', height: 38 }}
      loading={formLoading}
    >
      Create account
    </Button>
  );
};
const SignUpPage = () => {
  const [formLoading, setFormLoading] = React.useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const commonStore = useContext(CommonStoreContext);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onFinish = async (values: FieldType) => {
    setFormLoading(true);
    try {
      await axiosInstance.post('/accounts', {
        email: values.email,
        password: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
      });
      const signInRes = await axiosInstance.post('/accounts/signin', {
        email: values.email,
        password: values.password,
      });
      const accessToken = signInRes.data.token;
      localStorage.setItem('accessToken', accessToken);
      commonStore.account = await AccountRepository.whoAmI();

      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${accessToken}`;
      navigate('/onboarding/organization');
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Layout style={{ height: '100vh' }}>
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
                Create your WingFlo account
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
                <Form.Item
                  wrapperCol={{ offset: 0, span: 24 }}
                  style={{ textAlign: 'right' }}
                >
                  <Text>
                    Already have an account?{' '}
                    <Link to="/auth/signin">Sign in</Link>
                  </Text>
                </Form.Item>
                <Form.Item>
                  <Form.Item<FieldType>
                    label="First name"
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your first name',
                      },
                    ]}
                    style={{
                      display: 'inline-block',
                      width: 'calc(50% - 8px)',
                      marginRight: 10,
                      marginBottom: 0,
                    }}
                  >
                    <Input size="large" />
                  </Form.Item>
                  <Form.Item<FieldType>
                    label="Last name"
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: 'Please input your last name',
                      },
                    ]}
                    style={{
                      display: 'inline-block',
                      width: 'calc(50% - 8px)',
                      marginBottom: 0,
                    }}
                  >
                    <Input size="large" />
                  </Form.Item>
                </Form.Item>

                <Form.Item<FieldType>
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your email',
                      type: 'email',
                    },
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

                <Form.Item<FieldType>
                  name="tocAgreement"
                  valuePropName="checked"
                  rules={[
                    {
                      required: true,
                      message: 'You must agree to the terms and conditions',
                    },
                  ]}
                >
                  <Checkbox>
                    I agree to WingFlo's <a href="">Terms of Service</a>{' '}
                    and&nbsp;
                    <a href="">Privacy Policy</a> which includes my consent to
                    receive marketing information from WingFlo. I can
                    unsubscribe from marketing communications at any time.
                  </Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                  <SubmitButton form={form} formLoading={formLoading} />
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

export default observer(SignUpPage);
