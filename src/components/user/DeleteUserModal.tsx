import { Modal, Space, Table, Typography } from 'antd';
import React, { useEffect } from 'react';
import { ApplicationListRes } from '../../types/application';
import { UserRepository } from '../../repository/UserRepository';
import { UserListRes } from '../../types/user';
import { ColumnsType } from 'antd/es/table';
import defaultUserImage from '../../static/images/default-user-image-1.svg';

const { Text } = Typography;

export const DeleteUserModal = ({
  open,
  onOk,
  onCancel,
  application,
  usersToDelete,
}: {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  application: ApplicationListRes | null;
  usersToDelete: UserListRes[];
}) => {
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  if (application == null) return null;

  const onDeleteConfirm = async () => {
    setLoading(true);

    try {
      await UserRepository.deleteUsers({
        application_id: application.id,
        deleting_usernames: usersToDelete.map((user) => user.username),
      });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    onOk();
  };

  const columns: ColumnsType<UserListRes> = [
    {
      title: 'Username',
      dataIndex: 'username',
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
            style={{ borderRadius: '50%', marginRight: 10 }}
          />
          <Text>{text}</Text>
        </Space>
      ),
    },
  ];
  return (
    <Modal
      title="Delete users"
      open={open}
      onOk={onDeleteConfirm}
      onCancel={onCancel}
      maskClosable={false}
      okText="Delete"
      confirmLoading={loading}
      okButtonProps={{ danger: true, type: 'primary', loading }}
      width={640}
    >
      <p>
        <Typography.Text>
          This will permanently delete the selected users from your application.
        </Typography.Text>
      </p>

      <Table
        size="small"
        columns={columns}
        dataSource={usersToDelete}
        style={{ margin: '20px 0 30px 0' }}
        pagination={{
          hideOnSinglePage: true,
          pageSize: 5,
        }}
      />
    </Modal>
  );
};
