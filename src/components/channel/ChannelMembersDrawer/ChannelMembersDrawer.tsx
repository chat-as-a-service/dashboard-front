import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Badge, Button, Checkbox, Drawer, Flex, Space, Typography } from 'antd';
import { ArrowLeftOutlined, UserAddOutlined } from '@ant-design/icons';
import { ChatStoreContext } from '../../../pages/application/ApplicationRoot';
import { flowResult } from 'mobx';
import MemberList from './MemberList';
import { MemberListQueryOrder } from '@wingflo/js-sdk';

const { Title } = Typography;

const ChannelMembersDrawer = ({
  open,
  onOpen,
  getContainer,
}: {
  open: boolean;
  onOpen: (flag: boolean) => void;
  getContainer: HTMLElement | null;
}) => {
  const chatStore = useContext(ChatStoreContext);
  const { chatChannel, selectedChatChannel, channelMemberListQueryOrder } =
    chatStore;

  useEffect(() => {
    if (selectedChatChannel == null) return;
    (async () => {
      await flowResult(chatStore.listChannelMembers());
    })();
  }, [chatStore, chatChannel, channelMemberListQueryOrder]);

  /**
   * 1. When "Operators first" is checked, show operators first, then members
   * 2. When "Operators first" is NOT checked, show mixed list
   */
  const showMemberList = () => {
    if (channelMemberListQueryOrder === 'OPERATOR_THEN_MEMBER_ALPHABETICAL') {
      return (
        <>
          {chatStore.channelOperators.length > 0 && (
            <MemberList
              members={chatStore.channelOperators}
              title="Operators"
            />
          )}
          <MemberList
            members={chatStore.channelNormalMembers}
            title="Members"
          />
        </>
      );
    } else {
      return <MemberList members={chatStore.channelNormalMembers} />;
    }
  };

  return (
    <Drawer
      title={
        <Flex justify="space-between" style={{ height: 63 }} align="center">
          <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
            Members
          </Title>

          <Badge
            count={`${selectedChatChannel?.user_count ?? 0} / ${
              selectedChatChannel?.max_members ?? 0
            }`}
            color="#ECECEC"
            style={{
              color: '#5E5E5E',
              fontSize: 11,
              fontWeight: 400,
            }}
          />
        </Flex>
      }
      getContainer={getContainer ?? false}
      placement="right"
      onClose={() => onOpen(false)}
      open={open}
      width="100%"
      closeIcon={<ArrowLeftOutlined />}
      mask={false}
      contentWrapperStyle={{ boxShadow: 'none' }}
      drawerStyle={{
        outline: 'none',
      }}
      styles={{
        header: {
          borderBottom: '1px solid #e0e0e0',
          padding: '0 16px 0 8px',
        },
        body: { padding: 0 },
      }}
      rootStyle={{
        position: 'absolute',
      }}
    >
      <div style={{ textAlign: 'right' }}>
        <Space style={{ padding: '8px 16px' }}>
          <Checkbox
            style={{ display: 'flex', flexDirection: 'row-reverse' }}
            checked={
              channelMemberListQueryOrder ===
              'OPERATOR_THEN_MEMBER_ALPHABETICAL'
            }
            onChange={(e) => {
              const order: MemberListQueryOrder = e.target.checked
                ? 'OPERATOR_THEN_MEMBER_ALPHABETICAL'
                : 'MEMBER_NICKNAME_ALPHABETICAL';
              chatStore.changeChannelMemberListOrder(order);
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600 }}>
              Operators first
            </span>
          </Checkbox>
        </Space>
      </div>
      {showMemberList()}
      <div style={{ padding: '8px 16px' }}>
        <Button
          block
          onClick={() => {
            // todo
          }}
        >
          Invite <UserAddOutlined />
        </Button>
      </div>
    </Drawer>
  );
};

export default observer(ChannelMembersDrawer);
