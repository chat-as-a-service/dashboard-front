import React, { useEffect } from 'react';
import {
  Button,
  Col,
  Divider,
  Dropdown,
  Input,
  Layout,
  Row,
  Space,
  Table,
  theme,
  Typography,
} from 'antd';
import defaultOrgImage from '../static/images/default-org-image.svg';
import defaultAppImage from '../static/images/default-app-image.svg';
import styled from 'styled-components';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
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

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const OrgImage = styled.img``;

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
  margin-right: 20px;

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

const OrgOverviewBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1056px;
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
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const columns: ColumnsType<ApplicationListRes> = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <Space style={{ cursor: 'pointer' }}>
          <AppImageWrapper>
            <img src={defaultAppImage} />
          </AppImageWrapper>
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary">{record.uuid.toUpperCase()}</Text>
          </div>
        </Space>
      ),
      onCell: (record, rowIdx) => {
        return {
          onClick: (event) => {
            navigate(`/${record.uuid}/overview`);
          },
        };
      },
    },
    {
      title: 'Created on',
      dataIndex: 'created_at',
      render: (_, record) => (
        <Text style={{ cursor: 'pointer' }}>
          {dayjs.unix(record.created_at).format('MMM D, YYYY [at] h:mm A')}
        </Text>
      ),
    },
    {
      title: '',
      key: 'uuid',
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
    <Layout style={{ padding: '24px 0', background: colorBgContainer }}>
      <Content
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <OrgOverviewBox>
          <OrgImageWrapper>
            <img src={defaultOrgImage} />
          </OrgImageWrapper>
          <div>
            <Title level={4} style={{ margin: '0 0 0 0' }}>
              {organization.name}
            </Title>
            <Text type="secondary">1 members</Text>
            <Divider type="vertical" />
            <Text type="secondary">1 applications</Text>
          </div>
        </OrgOverviewBox>

        <Row style={{ maxWidth: 1056, width: '100%', alignItems: 'center' }}>
          <Col span={15}>
            <Title level={4}>Applications</Title>
            <Text type="secondary">
              This organization can have up to {organization.max_applications}{' '}
              applications and currently has {organization.num_apps_in_org}{' '}
              application{organization.num_apps_in_org > 1 ? 's' : ''}.
            </Text>
          </Col>
          <Col span={9} style={{ textAlign: 'right' }}>
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
          </Col>
        </Row>

        <Row style={{ maxWidth: 1056, width: '100%', marginTop: 10 }}>
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={applications}
              pagination={{
                hideOnSinglePage: true,
              }}
            />
          </Col>
        </Row>
      </Content>
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
    </Layout>
  );
};
export default observer(DashboardHomePage);
