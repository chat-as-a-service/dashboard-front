import React, { createContext, useContext, useEffect, useState } from 'react';
import { Button, Layout, Menu, MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
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
  width: 100%;
  height: 32px;
  color: #858585;
  user-select: none;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.09;
  padding: 8px 16px 8px 20px;
`;

const CustomSider = styled(Sider)`
  border-right: 1px solid #dedede;
  position: relative;
  padding: 8px 0;
`;
const CustomMenu = styled(Menu)`
  background: #f7f7f7;
  height: 100%;
  border-right: 0;
  font-weight: 500;

  & li.ant-menu-item-selected {
    font-weight: 600;
    background-color: #d9e6ff;
  }
`;

const SiderCollapseBtn = styled(Button)<{ $collapsed: boolean }>`
  position: absolute;
  top: 6px;
  right: ${({ $collapsed }) => ($collapsed ? '12px' : '8px')};
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
      <Layout style={{ flexGrow: 1, height: '100%', width: '100%' }}>
        <CustomSider
          width={216}
          collapsedWidth={56}
          theme="light"
          collapsed={commonStore.appSidebarCollapsed}
        >
          <SideMenuHeader>
            {!commonStore.appSidebarCollapsed && <span>APPLICATION</span>}
          </SideMenuHeader>
          <SiderCollapseBtn
            $collapsed={commonStore.appSidebarCollapsed}
            icon={
              commonStore.appSidebarCollapsed ? (
                <DoubleRightOutlined />
              ) : (
                <DoubleLeftOutlined />
              )
            }
            type="text"
            onClick={() =>
              (commonStore.appSidebarCollapsed =
                !commonStore.appSidebarCollapsed)
            }
          />

          <CustomMenu
            mode="inline"
            items={menuItems}
            onSelect={(item) => {
              selectSideMenu(item.key);
            }}
            selectedKeys={[selectedSideMenu]}
          />
        </CustomSider>
        <Content
          style={{
            padding:
              selectedSideMenu === 'settings' ||
              commonStore.appRootLayoutNoPadding
                ? 0
                : '32px 40px 80px 40px',
            display: 'flex',
            overflow: 'auto',
          }}
        >
          <div
            style={{
              flex: '1 0 auto',
              width: 1000,
            }}
          >
            <Outlet
              context={{ application: commonStore.selectedApplication }}
            />
          </div>
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
