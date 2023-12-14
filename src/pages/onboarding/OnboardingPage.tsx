import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { CommonStoreContext } from '../../index';
import LogoImg from '../../static/images/wingflo-logo-white-wide-sm.png';

const { Header, Content, Footer, Sider } = Layout;

const OnboardingPage = () => {
  const commonStore = useContext(CommonStoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (commonStore.account?.organization_id != null) {
      navigate('/');
    }
  }, []);

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
            <Outlet />
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}></Footer>
    </Layout>
  );
};

export default observer(OnboardingPage);
