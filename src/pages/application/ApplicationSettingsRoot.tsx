import React, { useContext, useEffect, useState } from 'react';
import { Layout, Menu, MenuProps, Typography } from 'antd';
import { CommonStoreContext } from '../../index';
import { observer } from 'mobx-react-lite';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { UserRepository } from '../../repository/UserRepository';
import { UserViewRes } from '../../types/user';
import styled from 'styled-components';

const { Text, Title } = Typography;
const { Content, Sider } = Layout;

const SideMenuHeader = styled.div`
  height: 40px;
  user-select: none;
  text-transform: uppercase;
  transition:
    color 0.15s cubic-bezier(0.4, 0, 0.2, 1) 0s,
    height,
    padding;
  padding: 16px 16px 8px 20px;
  white-space: nowrap;
`;
const ApplicationSettingsPage = () => {
  const [selectedSideMenu, selectSideMenu] = useState('');

  let { appUuid } = useParams();
  const [user, setUser] = useState<UserViewRes>();
  const commonStore = useContext(CommonStoreContext);
  const { selectedApplication } = commonStore;
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const { selectedApplication } = commonStore;
    if (selectedApplication == null) return;
    (async () => {})();
  }, [commonStore.selectedApplication]);

  useEffect(() => {
    if (selectedApplication == null || username == null) return;
    (async () => {
      setUser(await UserRepository.viewUser(selectedApplication.id, username));
    })();
  }, [username, selectedApplication]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'application',
      label: 'Application',
      children: [
        {
          key: 'general',
          label: <Link to={`/${appUuid}/settings/general`}>General</Link>,
        },
      ],
    },
  ];

  return (
    <Layout style={{ flexGrow: 1, height: '100%' }}>
      <Sider
        title="Settings"
        width={230}
        theme="light"
        style={{
          boxShadow: 'inset -1px 0 #ECECEC',
          padding: '0px 28px',
        }}
      >
        <Title level={5}>Settings</Title>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{
            height: '100%',
            borderRight: 0,
          }}
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
          padding: '24px 32px',
          background: '#fff',
        }}
      >
        <Outlet context={{ application: commonStore.selectedApplication }} />
      </Content>
    </Layout>
  );
};

export default observer(ApplicationSettingsPage);
