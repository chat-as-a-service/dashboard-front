import React, { useContext, useEffect, useState } from 'react';
import { Button, Flex, Input, Space, Table, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { Link } from 'react-router-dom';
import { UserListRes } from '../../types/user';
import { UserRepository } from '../../repository/UserRepository';
import { CommonStoreContext } from '../../index';
import { observer } from 'mobx-react-lite';
import { Utils } from '../../core/Util';
import { AddUserModal } from '../../components/user/AddUserModal';
import defaultUserImage from '../../static/images/default-user-image-1.svg';

const { Text, Title } = Typography;

const UsersPage = () => {
  const [isAddUserModalOpen, setAddUserModalOpen] = React.useState(false);
  const [isUsersLoading, setUsersLoading] = React.useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [users, setUsers] = useState<UserListRes[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const commonStore = useContext(CommonStoreContext);
  const { selectedApplication } = commonStore;
  const prevUserListAbortController = React.useRef<AbortController>(
    new AbortController(),
  );

  const getUserList = async () => {
    if (commonStore.selectedApplication == null) return;
    return await UserRepository.listUsers(
      commonStore.selectedApplication.id,
      '',
    );
  };
  const handleAddUserModalOk = async () => {
    setAddUserModalOpen(false);
    const users = await getUserList();
    if (users != null) {
      setUsers(users);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<UserListRes> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL, Table.SELECTION_NONE],
  };

  const handleSearch = async (searchKeyword: string) => {
    if (selectedApplication == null) return;
    prevUserListAbortController.current.abort();
    prevUserListAbortController.current = new AbortController();

    setUsersLoading(true);
    const users = await UserRepository.listUsers(
      selectedApplication.id,
      searchKeyword,
      prevUserListAbortController.current.signal,
    );
    setUsers(users);
    setUsersLoading(false);
  };

  useEffect(() => {
    const { selectedApplication } = commonStore;
    if (selectedApplication == null) return;
    (async () => {
      setUsersLoading(true);
      setUsers(await UserRepository.listUsers(selectedApplication.id, ''));
      setUsersLoading(false);
    })();
  }, [commonStore.selectedApplication]);

  const columns: ColumnsType<UserListRes> = [
    {
      title: 'Username',
      dataIndex: 'username',
      render: (text, record) => (
        <Link
          to={`/${commonStore.selectedApplication?.uuid}/users/${record.username}`}
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      render: (text, record) => (
        <Space align="center">
          <img
            width={20}
            height={20}
            src={defaultUserImage}
            style={{ borderRadius: '50%' }}
          />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Created on',
      dataIndex: 'created_at',
      render: (_, record) => Utils.unixTsToDateTimeString(record.created_at),
    },
  ];

  return (
    <div>
      <Flex justify="space-between">
        <Title level={4} style={{ margin: '0 0 20px 0' }}>
          Users
        </Title>
        <Space>
          <Button
            disabled={selectedRowKeys.length === 0}
            type="primary"
            icon={<DeleteOutlined />}
            // onClick={() => set(true)}
          >
            Delete
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddUserModalOpen(true)}
          >
            Create user
          </Button>
        </Space>
      </Flex>

      <Space>
        <Input.Search
          placeholder="Search"
          style={{ width: 225 }}
          onSearch={handleSearch}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.currentTarget.value)}
        />
      </Space>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={users}
        style={{
          marginTop: 20,
        }}
        rowKey={(record) => record.username}
        loading={isUsersLoading}
        pagination={{
          hideOnSinglePage: true,
        }}
      />
      <AddUserModal
        open={isAddUserModalOpen}
        onOk={handleAddUserModalOk}
        onCancel={() => setAddUserModalOpen(false)}
        application={commonStore.selectedApplication}
      />
    </div>
  );
};

export default observer(UsersPage);
