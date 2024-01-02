import React, { useContext, useEffect, useState } from 'react';
import {
  Badge,
  Button,
  ConfigProvider,
  Descriptions,
  Flex,
  Input,
  Space,
  Typography,
} from 'antd';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { CommonStoreContext } from '../../index';
import { observer } from 'mobx-react-lite';
import { Utils } from '../../core/Util';
import { useNavigate, useParams } from 'react-router-dom';
import { UserRepository } from '../../repository/UserRepository';
import { UserViewRes } from '../../types/user';
import defaultUserImage from '../../static/images/default-user-image-1.svg';
import { DeleteUserModal } from '../../components/user/DeleteUserModal';

const { Text, Title } = Typography;

const UserDetailPage = () => {
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = React.useState(false);
  const [user, setUser] = useState<UserViewRes>();
  const commonStore = useContext(CommonStoreContext);
  const { selectedApplication } = commonStore;
  const { username } = useParams();
  const navigate = useNavigate();

  const handleDeleteUserModalOk = async () => {
    setDeleteUserModalOpen(false);
    setTimeout(() => {
      window.location.href = `/${selectedApplication?.uuid}/users`;
    }, 500);
  };

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

  return (
    <ConfigProvider
      theme={{
        components: {
          Descriptions: {
            labelBg: 'transparent',
            titleMarginBottom: 12,
          },
        },
      }}
    >
      <div style={{ display: 'inline-block' }}>
        <div style={{ width: 980 }}>
          <Flex justify="space-between" style={{ marginBottom: 20 }}>
            <Space align="center" style={{ marginBottom: 10 }}>
              <Button
                icon={<ArrowLeftOutlined />}
                type="text"
                style={{ marginRight: 5 }}
                onClick={() => navigate(`/${selectedApplication?.uuid}/users`)}
              />
              <Title level={1}>{user?.username}</Title>
            </Space>
            <Space>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => setDeleteUserModalOpen(true)}
              >
                Delete
              </Button>
            </Space>
          </Flex>
          <Descriptions
            title="User information"
            column={1}
            style={{ marginBottom: 40 }}
            labelStyle={{
              width: '50%',
              border: 0,
              fontWeight: 500,
              fontSize: 16,
              padding: 24,
            }}
            bordered
            items={[
              {
                key: 'username',
                label: 'Username',
                children: (
                  <Input
                    size="large"
                    disabled
                    value={user?.username}
                    style={{ cursor: 'text' }}
                  />
                ),
              },
              {
                key: 'created_at',
                label: 'Created at',
                children: user?.created_at && (
                  <Text>{Utils.unixTsToDateTimeString(user.created_at)}</Text>
                ),
              },
              {
                key: 'nickname',
                label: 'Nickname',
                children: <Input size="large" defaultValue={user?.nickname} />,
              },
              {
                key: 'profile_picture_url',
                label: 'Profile URL',
                children: (
                  <Flex align="center" style={{ width: '100%' }}>
                    <img
                      width={40}
                      height={40}
                      src={defaultUserImage}
                      style={{ borderRadius: '50%', marginRight: 10 }}
                    />
                    <Input
                      size="large"
                      defaultValue={user?.nickname}
                      style={{ flexGrow: 1 }}
                    />
                  </Flex>
                ),
              },
            ]}
          />

          <Descriptions
            title="Chat"
            column={1}
            labelStyle={{
              width: '50%',
              border: 0,
              fontWeight: 500,
              fontSize: 16,
              padding: 24,
            }}
            bordered
            items={[
              {
                key: 'status',
                label: 'Status',
                children: <Badge status="default" text="Offline" />,
              },
              {
                key: 'last_seen_at',
                label: 'Last seen on',
                children: <p>—</p>,
              },
              {
                key: 'channels_joined',
                label: 'Channels',
                children: (
                  <div>
                    <Text strong>Joined channels</Text>
                    <br />
                    <Text type="secondary">
                      Number of channels joined by this user.
                    </Text>
                    <br />
                    <p>
                      <Typography.Link>
                        0 channels <RightOutlined />
                      </Typography.Link>
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
      <DeleteUserModal
        open={isDeleteUserModalOpen}
        onOk={handleDeleteUserModalOk}
        onCancel={() => setDeleteUserModalOpen(false)}
        application={commonStore.selectedApplication}
        usersToDelete={user == null ? [] : [user]}
      />
    </ConfigProvider>
  );
};

export default observer(UserDetailPage);
