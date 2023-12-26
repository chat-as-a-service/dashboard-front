import React, { useContext, useEffect, useMemo } from 'react';
import {
  Button,
  Dropdown,
  Flex,
  Layout,
  MenuProps,
  Space,
  Spin,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import {
  Link,
  Outlet,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import defaultAccountImage from '../static/images/default-account-image.svg';
import defaultOrgImage from '../static/images/default-org-image.svg';
import styled from 'styled-components';
import { AccountRepository } from '../repository/AccountRepository';
import { AccountRes } from '../types/account';
import { OrganizationViewRes } from '../types/organization';
import { OrganizationRepository } from '../repository/OrganizationRepository';
import { ApplicationListRes } from '../types/application';
import { ApplicationRepository } from '../repository/ApplicationRepository';
import { CommonStoreContext } from '../index';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import LogoImg from '../static/images/wingflo-logo-white-wide-sm.png';
import axiosInstance from '../axiosInstance';

const { Header, Content } = Layout;
const { Text } = Typography;

const OrgProfileImgBox = styled.div`
  position: relative;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  user-select: none;
`;

type ContextType = {
  account?: AccountRes;
  organization?: OrganizationViewRes;
  applications: ApplicationListRes[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationListRes[]>>;
};

const NotificationContext = React.createContext({
  name: 'NotificationContext',
});

const Root = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = React.useState<ApplicationListRes[]>(
    [],
  );
  let { appUuid } = useParams();
  const commonStore = useContext(CommonStoreContext);

  const {
    token: { colorBgElevated, borderRadiusLG, boxShadowSecondary },
  } = theme.useToken();

  useEffect(() => {
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken == null) {
      navigate('/auth/signin');
    } else {
      (async () => {
        try {
          commonStore.account = await AccountRepository.whoAmI();
          commonStore.organization =
            await OrganizationRepository.getOrganization(
              commonStore.account.organization_id,
            );
          commonStore.applications =
            await ApplicationRepository.listApplications();
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response) {
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            }
          }
          navigate('/auth/signin');
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (appUuid == null) return;
    (async () => {
      await ApplicationRepository.viewApplicationByUuid(appUuid);
    })();
  }, [appUuid]);

  const contentStyle: React.CSSProperties = {
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  const profileDropdownItems: MenuProps['items'] = [
    {
      key: 'orgOverview',
      disabled: true,
      label: (
        <Space
          style={{
            padding: '8px 0px',
            cursor: 'default',
          }}
        >
          <OrgProfileImgBox>
            <img src={defaultOrgImage} width={40} height={40} />
          </OrgProfileImgBox>
          <div>
            <Text strong>{commonStore.organization?.name}</Text>
            <br />
            <Text type="secondary">
              {commonStore.organization?.num_apps_in_org} application
              {(commonStore.organization?.num_apps_in_org ?? 0) > 1 ? 's' : ''}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      key: 'orgGeneral',
      label: <Tooltip title="comming soon">General</Tooltip>,
      disabled: true,
    },
    {
      label: <Tooltip title="comming soon">Applications</Tooltip>,
      key: 'orgApplications',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'accountOverview',
      disabled: true,
      label: (
        <Space
          style={{
            padding: '8px 0spx',
            cursor: 'default',
          }}
        >
          <OrgProfileImgBox>
            <img src={defaultAccountImage} width={40} height={40} />
          </OrgProfileImgBox>
          <div>
            <Text strong>{commonStore.accountFullName}</Text>
            <br />
            <Text type="secondary">{commonStore.account?.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      key: 'accountProfile',
      label: <Tooltip title="comming soon">Profile</Tooltip>,
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      label: 'Sign out',
      key: 'signOut',
      onClick: () => {
        window.localStorage.removeItem('accessToken');
        commonStore.reset();
        axiosInstance.defaults.headers.common['Authorization'] = undefined;

        navigate('/auth/signin');
      },
    },
  ];
  const menuProps = {
    items: profileDropdownItems,
  };
  const notificationContextValue = useMemo(
    () => ({ name: 'NotificationContext' }),
    [],
  );
  if (commonStore.account == null || commonStore.organization == null)
    return <Spin></Spin>;

  return (
    <NotificationContext.Provider value={notificationContextValue}>
      <Layout
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <Header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 48,
            paddingRight: '10px',
            paddingLeft: 20,
          }}
        >
          <Flex align="center" gap={20}>
            <Link to="/" style={{ lineHeight: 0 }}>
              <img alt="WingFlo logo" src={LogoImg} height={35} />
            </Link>

            <Dropdown
              menu={{
                items: commonStore.applications.map((app) => ({
                  key: app.uuid,
                  label: <Link to={`/${app.uuid}/overview`}>{app.name}</Link>,
                  style: { padding: '10px 15px' },
                })),
              }}
              trigger={['click']}
              dropdownRender={(menu) => (
                <div
                  style={{
                    ...contentStyle,
                    width: 280,
                  }}
                >
                  {React.cloneElement(menu as React.ReactElement, {
                    style: menuStyle,
                  })}
                </div>
              )}
            >
              <Button
                type="text"
                size="large"
                onClick={(e) => e.preventDefault()}
                style={{
                  color: '#fff',
                  fontSize: 14,
                  width: 160,
                  textAlign: 'left',
                }}
              >
                <Space>
                  {commonStore.selectedApplication != null
                    ? commonStore.selectedApplication.name
                    : 'Select application'}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Flex>
          <Dropdown
            menu={menuProps}
            trigger={['click']}
            dropdownRender={(menu) => (
              <div
                style={{
                  ...contentStyle,
                  width: 250,
                }}
              >
                {React.cloneElement(menu as React.ReactElement, {
                  style: menuStyle,
                })}
              </div>
            )}
          >
            <Button type="text" style={{ color: '#fff', height: '100%' }}>
              <Flex align="center">
                <span style={{ marginRight: 10 }}>
                  {commonStore.organization?.name}
                </span>
                <img
                  src={defaultAccountImage}
                  width="32"
                  height="32"
                  style={{ borderRadius: '50%' }}
                />
              </Flex>
            </Button>
          </Dropdown>
        </Header>
        <Content
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            // height: '100%',
          }}
        >
          <Outlet
            context={{
              account: commonStore.account,
              organization: commonStore.organization,
              applications,
              setApplications,
            }}
          />
        </Content>
      </Layout>
    </NotificationContext.Provider>
  );
};
export default observer(Root);

export function useTypedOutletContext() {
  return useOutletContext<ContextType>();
}
