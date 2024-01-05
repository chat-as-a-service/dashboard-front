import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Avatar,
  Divider,
  Dropdown,
  MenuProps,
  Space,
  theme,
  Typography,
} from 'antd';
import defaultUserImage from '../../../static/images/default-user-image-1.svg';
import { ChannelMember } from '@wingflo/js-sdk';

const { Text } = Typography;

const MemberDropdown = ({
  channelMember,
  children,
  showMenu,
}: {
  channelMember: ChannelMember;
  children: React.ReactNode;
  showMenu: boolean;
}) => {
  const { token } = theme.useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    boxShadow: token.boxShadowSecondary,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
    padding: '8px 0',
  };

  const itemStyle: React.CSSProperties = {
    borderRadius: 0,
    padding: '6px 16px',
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'mute',
      label: 'Mute',
      style: itemStyle,
      onClick: () => {
        // todo
      },
    },
    {
      key: 'ban',
      label: 'Ban',
      style: itemStyle,
      onClick: () => {
        // todo
      },
    },
    {
      type: 'divider',
      style: {
        margin: '8px 0',
      },
    },
    {
      danger: true,
      key: 'deactivate',
      label: 'Deactivate',
      style: itemStyle,
      onClick: () => {
        // todo
      },
    },
  ];

  return (
    <Dropdown
      trigger={['click']}
      arrow={false}
      placement="bottomLeft"
      align={{ offset: [-30, 0] }}
      menu={{ items: menuItems }}
      dropdownRender={(menu) => (
        <div style={{ ...contentStyle, width: 320 }}>
          {/*user info row*/}
          <div style={{ display: 'flex', gap: 14, padding: 16 }}>
            <div>
              {/* TODO */}
              <Avatar src={defaultUserImage} size={40} alt="User profile" />
            </div>

            <Space.Compact direction="vertical" style={{ flex: '1 1 auto' }}>
              <Text strong>{channelMember.nickname}</Text>

              <Text type="secondary" style={{ fontSize: 12 }}>
                Username:{' '}
                <Text type="secondary" style={{ fontSize: 12 }} copyable>
                  {channelMember.username}
                </Text>
              </Text>
            </Space.Compact>
          </div>
          {showMenu && (
            <>
              <Divider style={{ margin: 0 }} />

              {React.cloneElement(menu as React.ReactElement, {
                style: menuStyle,
              })}
            </>
          )}
        </div>
      )}
    >
      {children}
    </Dropdown>
  );
};

export default observer(MemberDropdown);
