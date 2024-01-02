import React, { useContext, useEffect, useState } from 'react';
import { Button, Dropdown, Flex, Input, notification, Select, Space, Table, Typography } from 'antd';
import { DeleteOutlined, MoreOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { CommonStoreContext } from '../../index';
import { observer } from 'mobx-react-lite';
import { Utils } from '../../core/Util';
import { ChannelListRes } from '../../types/channel';
import DefaultChannelImg from '../../static/images/default-channel-image-1.png';
import { AddChannelModal } from '../../components/channel/AddChannelModal';
import { UserRepository } from '../../repository/UserRepository';
import { UserListRes } from '../../types/user';
import { ChatStoreContext } from '../application/ApplicationRoot';
import styled from 'styled-components';

const { Text, Title, Paragraph } = Typography;

const ChannelName = styled(Text)`
  font-weight: 500;
`;

const ChannelsTable = styled(Table)`
  & tbody td:nth-child(2) {
    cursor: pointer;

    &:hover ${ChannelName} {
      color: var(--ant-color-primary);
      text-decoration: underline;
    }
  }

  & tbody td:nth-child(2) {
  }
`;

const ChannelsPage = () => {
  const [isAddChannelModalOpen, setAddChannelModalOpen] = React.useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [users, setUsers] = useState<UserListRes[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const commonStore = useContext(CommonStoreContext);
  const chatStore = useContext(ChatStoreContext);
  const { selectedApplication } = commonStore;
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const handleAddChannelModalOk = async () => {
    setAddChannelModalOpen(false);
    setSearchKeyword('');
    if (commonStore.selectedApplication != null) {
      await chatStore.fetchChannels(commonStore.selectedApplication.id);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<ChannelListRes> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
  };

  const handleSearch = async (searchKeyword: string) => {
    if (selectedApplication == null) return;
    await chatStore.fetchChannels(selectedApplication.id, searchKeyword);
  };

  useEffect(() => {
    const { selectedApplication } = commonStore;
    if (selectedApplication == null) return;
    (async () => {
      await chatStore.fetchChannels(selectedApplication.id);
      setUsers(await UserRepository.listUsers(selectedApplication.id, ''));
    })();
  }, [commonStore.selectedApplication]);

  const columns: ColumnsType<ChannelListRes> = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <Flex align="center" gap={12}>
          <img
'      '    alt="Channel profile"
            src={DefaultChannelImg}
            width={32}
            height={32}
            style={{ borderRadius: 4 }}
          />

          <Space.Compact direction="vertical">
            <ChannelName>{text}</ChannelName>
            <Text type='secondary' style={{ fontSize: 12 }}>
              {record.uuid}
            </Text>
          </Space.Compact>
        </Flex>
      ),
      onCell: (record) => {
        return {
          onClick: () => {
            if (commonStore.moderator == null) {
              api.error({
                message: 'Please select a moderator',
              });
            } else {
              navigate(
                `/${commonStore.selectedApplication?.uuid}/channels/${record.uuid}`,
              );
            }
          },
        };
      },
    },
    {
      title: 'Members',
      dataIndex: 'member_count',
      render: (_, record) => (
        <Space align="center">
          <UserOutlined />
          <Text>
            {record.user_count} / {record.max_members}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Last message on',
      dataIndex: 'last_message_at',
      render: (_, record) =>
        record.last_message_at == null
          ? '—'
          : Utils.unixTsToDateTimeString(record.last_message_at), // todo: update this
    },
    {
      title: 'Created on',
      dataIndex: 'created_at',
      render: (_, record) => Utils.unixTsToDateTimeString(record.created_at),
    },
    {
      title: '',
      key: 'uuid',
      render: (_, record) => (
        <Dropdown
          placement="bottomRight"
          menu={{
            onClick: (selectedMenu) => {
              chatStore.selectChannel(record);
              switch (selectedMenu.key) {
                case 'delete':
                  // setIsDeleteAppModalOpen(true);
                  break;
              }
            },
            items: [
              {
                key: 'delete',
                label: 'Delete',
                danger: true,
                disabled: true,
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text">
            <MoreOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Flex justify='space-between' style={{ marginBottom: 20 }}>
        <Title level={1}>Channels</Title>
        <Space>
          <Space>
            <Text type="secondary">Moderator: </Text>

            <Select
              placeholder="Link moderator"
              style={{ width: 240 }}
              value={commonStore.moderator?.id}
              onChange={(value) => {
                commonStore.moderator =
                  users.find((user) => user.id === value) ?? null;
              }}
              options={users.map((user) => ({
                value: user.id,
                label: user.nickname,
              }))}
            />
          </Space>
          <Button type="primary" icon={<DeleteOutlined />} disabled={true}>
            Delete
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddChannelModalOpen(true)}
          >
            Create channel
          </Button>
        </Space>
      </Flex>

      <Paragraph>
        Create and manage channels that allow one-to-one chat or group chat of
        up to 100 members.
      </Paragraph>

      <Space>
        <Input.Search
          placeholder="Search"
          style={{ width: 450 }}
          onSearch={handleSearch}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.currentTarget.value)}
        />
      </Space>

      <ChannelsTable
        rowSelection={rowSelection}
        columns={columns}
        dataSource={chatStore.channels}
        style={{
          marginTop: 20,
        }}
        rowKey={(record) => record.uuid}
        loading={chatStore.channelsState === 'pending'}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
      <AddChannelModal
        open={isAddChannelModalOpen}
        onOk={handleAddChannelModalOk}
        onCancel={() => setAddChannelModalOpen(false)}
        application={commonStore.selectedApplication}
      />
    </div>
  );
};

export default observer(ChannelsPage);
