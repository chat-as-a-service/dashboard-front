import React, { useEffect } from 'react';
import {
  Button,
  Card,
  ConfigProvider,
  Descriptions,
  Divider,
  Dropdown,
  Flex,
  Input,
  Space,
  Table,
  Typography,
} from 'antd';
import defaultOrgImage from '../static/images/default-org-image.svg';
import defaultAppImage from '../static/images/default-app-image.svg';
import styled from 'styled-components';
import { MoreOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { ApplicationRepository } from '../repository/ApplicationRepository';
import { ApplicationListRes } from '../types/application';
import { useTypedOutletContext } from './Root';
import dayjs from 'dayjs';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { AddApplicationModal } from '../components/application/AddApplicationModal';
import { ChangeApplicationNameModal } from '../components/application/ChangeApplicationNameModal';
import { DeleteApplicationModal } from '../components/application/DeleteApplicationModal';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import SimpleBarChart from '../components/common/SimpleBarChart';

const { Title, Text } = Typography;

const OrgImageWrapper = styled.div`
  position: relative;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 12.8px;
  overflow: hidden;
  user-select: none;

  img {
    width: 64px;
    height: 64px;
  }
`;

const AppImageWrapper = styled.div`
  position: relative;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  user-select: none;
  margin-right: 5px;

  img {
    width: 32px;
    height: 32px;
  }
`;

const OrgOverviewRow = styled(Flex)`
  width: 1056px;
  margin: 0 auto 32px auto;
`;

const ApplicationTable = styled(Table)`
  width: 100%;

  & tbody td:nth-child(-n + 2) {
    cursor: pointer;
  }
`;

const DashboardHomePage = () => {
  const [isAddAppModalOpen, setIsAddAppModalOpen] = React.useState(false);
  const [isChangeAppNameModalOpen, setIsChangeAppNameModalOpen] =
    React.useState(false);
  const [isDeleteAppModalOpen, setIsDeleteAppModalOpen] = React.useState(false);
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [selectedApp, selectApp] = React.useState<ApplicationListRes | null>(
    null,
  );

  const { organization, account, applications, setApplications } =
    useTypedOutletContext();
  const prevAppListAbortController = React.useRef<AbortController>(
    new AbortController(),
  );
  const navigate = useNavigate();

  const columns: ColumnsType<ApplicationListRes> = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <Space>
          <AppImageWrapper>
            <img src={defaultAppImage} alt="Application" />
          </AppImageWrapper>
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary">{record.uuid.toUpperCase()}</Text>
          </div>
        </Space>
      ),
      onCell: (record) => {
        return {
          onClick: () => {
            navigate(`/${record.uuid}/overview`);
          },
        };
      },
    },
    {
      title: 'Created on',
      dataIndex: 'created_at',
      render: (_, record) => (
        <Text>
          {dayjs.unix(record.created_at).format('MMM D, YYYY [at] h:mm A')}
        </Text>
      ),
      onCell: (record) => {
        return {
          onClick: () => {
            navigate(`/${record.uuid}/overview`);
          },
        };
      },
    },
    {
      title: '',
      render: (_, record) => (
        <Dropdown
          placement="bottomRight"
          menu={{
            onClick: (selectedMenu) => {
              selectApp(record);
              switch (selectedMenu.key) {
                case 'change_app_name':
                  setIsChangeAppNameModalOpen(true);
                  break;
                case 'delete':
                  setIsDeleteAppModalOpen(true);
                  break;
              }
            },
            items: [
              {
                key: 'change_app_name',
                label: 'Change app name',
              },
              {
                key: 'delete',
                label: 'Delete',
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

  async function getAppList(keyword: string) {
    prevAppListAbortController.current.abort();
    prevAppListAbortController.current = new AbortController();
    return await ApplicationRepository.listApplications(
      keyword,
      prevAppListAbortController.current.signal,
    ).catch((e) => {
      if (axios.isCancel(e)) return;
      throw e;
    });
  }

  useEffect(() => {
    if (account == null) return;
    (async () => {
      const applicationListRes = await getAppList('');
      if (applicationListRes != null) {
        setApplications(applicationListRes);
      }
    })();
  }, [account]);

  const handleAppSearch = async (input: string) => {
    if (account == null) return;

    const applicationListRes = await getAppList(input);
    if (applicationListRes != null) {
      setApplications(applicationListRes);
    }
  };

  const onCreateAppSuccess = async () => {
    setIsAddAppModalOpen(false);
    setSearchKeyword('');
    await handleAppSearch('');
  };

  const onChangeAppNameSuccess = async () => {
    setIsChangeAppNameModalOpen(false);
    setSearchKeyword('');
    await handleAppSearch('');
  };
  const onDeleteAppSuccess = async () => {
    setIsDeleteAppModalOpen(false);
    setSearchKeyword('');
    await handleAppSearch('');
  };

  if (organization == null || account == null) return null;

  return (
    <>
      <Flex
        vertical
        align="center"
        style={{
          width: '100%',
          padding: '24px 0',
        }}
      >
        <OrgOverviewRow align="start" justify="space-between">
          <Space size={15}>
            <OrgImageWrapper>
              <img
                src={defaultOrgImage}
                alt={`Organization ${organization.name}`}
              />
            </OrgImageWrapper>
            <div>
              <Title level={1}>{organization.name}</Title>
              <Text type="secondary">1 members</Text>
              <Divider type="vertical" />
              <Text type="secondary">1 applications</Text>
            </div>
          </Space>
          <Button icon={<SettingOutlined />}>Organization settings</Button>
        </OrgOverviewRow>

        <Flex
          justify="center"
          style={{
            width: '100%',
            padding: '32px 0',
            margin: '0 auto',
            background: '#F7F7F7',
          }}
        >
          <Flex justify="space-between" style={{ width: 1056 }}>
            <div style={{ flex: '1 0 500px' }}>
              <Space style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 18, fontWeight: 600 }}>Chat</Text>
              </Space>
              <Card
                style={{ background: '#fff' }}
                title={
                  <Flex justify="space-between" style={{ padding: '24px 0' }}>
                    <ConfigProvider
                      theme={{
                        components: {
                          Descriptions: {
                            paddingXS: 0,
                          },
                        },
                      }}
                    >
                      <Descriptions
                        size="small"
                        column={1}
                        labelStyle={{ padding: 0, width: 110 }}
                        colon={false}
                        items={[
                          {
                            label: 'Current plan',
                            children: <Text>Free</Text>,
                          },
                          {
                            label: 'Expires on',
                            children: (
                              <Text type="danger">
                                {dayjs(Date.now()).format('MMMM D, YYYY')}
                              </Text>
                            ),
                          },
                        ]}
                      />
                    </ConfigProvider>
                    <Button>Manage</Button>
                  </Flex>
                }
              >
                <Flex justify="space-between" align="center">
                  <Text>Quota</Text>
                  <a style={{ fontWeight: 600 }}>View more quota</a>
                </Flex>
                <div>
                  <SimpleBarChart
                    label="Used monthly active users"
                    used={2}
                    total={1000}
                    barHeight={6}
                    enableTooltip={false}
                    style={{ margin: '10px 0 20px 0' }}
                  />

                  <SimpleBarChart
                    label="Peak concurrent connections"
                    used={2}
                    total={20}
                    barHeight={6}
                    enableTooltip={false}
                  />
                </div>
              </Card>
            </div>
          </Flex>
        </Flex>

        <div
          style={{
            width: 1056,
            padding: '32px 0',
            margin: '0 auto',
          }}
        >
          <Flex
            justify="space-between"
            align="center"
            style={{ width: '100%' }}
          >
            <Space direction="vertical">
              <Title level={1}>Applications</Title>
              <Text type="secondary">
                This organization can have up to {organization.max_applications}{' '}
                applications and currently has {organization.num_apps_in_org}{' '}
                application{organization.num_apps_in_org > 1 ? 's' : ''}.
              </Text>
            </Space>
            <Space style={{ textAlign: 'right' }}>
              <Space>
                <Input.Search
                  placeholder="Search"
                  onChange={(e) => {
                    let input = e.currentTarget.value;
                    setSearchKeyword(input);
                    return debounce(() => handleAppSearch(input), 300);
                  }}
                  value={searchKeyword}
                  style={{ width: 240 }}
                />
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddAppModalOpen(true)}
                >
                  <strong>Create</strong>
                </Button>
              </Space>
            </Space>
          </Flex>
          <ApplicationTable
            columns={columns}
            dataSource={applications}
            rowKey={(record) => record.uuid}
            pagination={{
              hideOnSinglePage: true,
            }}
          />
        </div>
      </Flex>

      <AddApplicationModal
        open={isAddAppModalOpen}
        onOk={onCreateAppSuccess}
        onCancel={() => setIsAddAppModalOpen(false)}
        organizationId={account.organization_id}
      />
      <ChangeApplicationNameModal
        open={isChangeAppNameModalOpen}
        onOk={onChangeAppNameSuccess}
        onCancel={() => setIsChangeAppNameModalOpen(false)}
        application={selectedApp}
      />
      <DeleteApplicationModal
        open={isDeleteAppModalOpen}
        onOk={onDeleteAppSuccess}
        onCancel={() => setIsDeleteAppModalOpen(false)}
        application={selectedApp}
      />
    </>
  );
};
export default observer(DashboardHomePage);
