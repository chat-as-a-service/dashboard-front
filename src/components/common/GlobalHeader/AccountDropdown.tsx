import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Dropdown,
  Flex,
  MenuProps,
  Space,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import defaultAccountImage from '../../../static/images/default-account-image.svg';
import defaultOrgImage from '../../../static/images/default-org-image.svg';
import axiosInstance from '../../../axiosInstance';
import { OrganizationViewRes } from '../../../types/organization';
import { useNavigate } from 'react-router-dom';
import { AccountRes } from '../../../types/account';
import { OrgProfileImgBox } from './AccountDropdown.styles';

const { Text } = Typography;
const AccountDropdown = ({
  organization,
  accountFullName,
  account,
  onSignOut,
}: {
  organization: OrganizationViewRes | null;
  accountFullName: string;
  account: AccountRes | null;
  onSignOut: () => void;
}) => {
  const navigate = useNavigate();
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
            <img src={defaultOrgImage} width={40} height={40} alt="profile" />
          </OrgProfileImgBox>
          <div>
            <Text strong>{organization?.name}</Text>
            <br />
            <Text type="secondary">
              {organization?.num_apps_in_org} application
              {(organization?.num_apps_in_org ?? 0) > 1 ? 's' : ''}
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
            <img
              src={defaultAccountImage}
              width={40}
              height={40}
              alt="organization profile"
            />
          </OrgProfileImgBox>
          <div>
            <Text strong>{accountFullName}</Text>
            <br />
            <Text type="secondary">{account?.email}</Text>
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
        onSignOut();
        axiosInstance.defaults.headers.common['Authorization'] = undefined;

        navigate('/auth/signin');
      },
    },
  ];

  const {
    token: { colorBgElevated, borderRadiusLG, boxShadowSecondary },
  } = theme.useToken();
  const menuProps = {
    items: profileDropdownItems,
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: colorBgElevated,
    borderRadius: borderRadiusLG,
    boxShadow: boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
    width: 280,
    maxHeight: 320,
    overflow: 'hidden',
    padding: '8px 0',
  };
  return (
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
          <span style={{ marginRight: 10 }}>{organization?.name}</span>
          <img
            alt={accountFullName}
            src={defaultAccountImage}
            width="32"
            height="32"
            style={{ borderRadius: '50%' }}
          />
        </Flex>
      </Button>
    </Dropdown>
  );
};

export default observer(AccountDropdown);
