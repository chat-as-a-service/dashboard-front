import React, { createContext, useContext, useEffect, useState } from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import {
  HomeOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Link,
  Outlet,
  useLocation,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { ApplicationRepository } from '../../repository/ApplicationRepository';
import { ApplicationViewRes } from '../../types/application';
import { CommonStoreContext } from '../../index';
import styled from 'styled-components';
import ChatStore from '../../store/ChatStore';

const { Content, Sider } = Layout;

const SideMenuHeader = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
  color: #858585;
  user-select: none;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.09;
  transition:
    color 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s,
    height,
    padding;
  padding: 16px 16px 8px 20px;
  white-space: nowrap;
`;
const chatStore = new ChatStore();

export const ChatStoreContext = createContext<ChatStore>(chatStore);
const ApplicationRoot = () => {
  const [selectedSideMenu, selectSideMenu] = useState('');
  let { appUuid } = useParams();
  const commonStore = useContext(CommonStoreContext);
  const location = useLocation();

  useEffect(() => {
    let pathParts = location.pathname.split('/');
    switch (pathParts?.[2]) {
      case 'overview':
        selectSideMenu('overview');
        break;
      case 'users':
        selectSideMenu('users');
        break;
      case 'settings':
        selectSideMenu('settings');
        break;
      case 'channels':
        selectSideMenu('channels');
        break;
    }

    if (appUuid == null) return;

    (async () => {
      commonStore.selectedApplication =
        await ApplicationRepository.viewApplicationByUuid(appUuid);
    })();
  }, [appUuid, commonStore, location]);

  if (appUuid == null || commonStore.selectedApplication == null) {
    return null;
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'overview',
      label: <Link to={`/${appUuid}/overview`}>Overview</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: 'users',
      label: <Link to={`/${appUuid}/users`}>Users</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'channels',
      label: <Link to={`/${appUuid}/channels`}>Channels</Link>,
      icon: <MessageOutlined />,
    },
    {
      key: 'settings',
      label: <Link to={`/${appUuid}/settings`}>Settings</Link>,
      icon: <SettingOutlined />,
    },
  ];

  return (
    <ChatStoreContext.Provider value={chatStore}>
      <Layout style={{ flexGrow: 1, height: '100%' }}>
        <Sider
          width={250}
          theme="light"
          style={{
            borderRight: '1px solid #dedede',
            background: '#F7F7F7',
          }}
          collapsed={commonStore.appSidebarCollapsed}
        >
          {commonStore.appSidebarCollapsed ? null : (
            <SideMenuHeader>
              <span>APPLICATION</span>
            </SideMenuHeader>
          )}

          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0, background: '#F7F7F7' }}
            items={menuItems}
            onSelect={(item) => {
              console.log(item);
              selectSideMenu(item.key);
            }}
            selectedKeys={[selectedSideMenu]}
          />
        </Sider>
        <Content
          style={{
            padding:
              selectedSideMenu === 'settings' ||
              commonStore.appRootLayoutNoPadding
                ? 0
                : '32px 40px 80px 40px',
            background: '#fff',
          }}
        >
          <Outlet context={{ application: commonStore.selectedApplication }} />
        </Content>
      </Layout>
    </ChatStoreContext.Provider>
  );
};

type ContextType = {
  application?: ApplicationViewRes;
};

export function useAppOutletContext() {
  return useOutletContext<ContextType>();
}

export default observer(ApplicationRoot);
