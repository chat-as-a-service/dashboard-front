import React from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';

import { RightOutlined, SettingOutlined } from '@ant-design/icons';
import defaultAppImage from '../../static/images/default-app-image.svg';
import styled from 'styled-components';
import { useAppOutletContext } from './ApplicationRoot';
import dayjs from 'dayjs';
import SimpleBarChart from '../../components/common/SimpleBarChart/SimpleBarChart';
import { Link } from 'react-router-dom';
import ActiveUserStatSummary from '../../components/user/ActiveUserStatSummary';

const { Text, Title } = Typography;

const AppImageBox = styled.div`
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
  margin-right: 20px;
`;

const ApplicationOverviewPage = () => {
  const { application } = useAppOutletContext();

  if (application == null) return null;
  return (
    <div>
      <Row gutter={32}>
        <Col span={12}>
          <Card
            headStyle={{ borderBottom: '1px solid #e0e0e0' }}
            title={
              <Flex
                justify="space-between"
                align="center"
                style={{ height: 90 }}
              >
                <Flex align="center">
                  <AppImageBox>
                    <img
                      width="32"
                      height="32"
                      src={defaultAppImage}
                      alt="Application"
                    />
                  </AppImageBox>
                  <Title level={1}>{application.name}</Title>
                </Flex>
                <Button type="text">
                  <Space align="center">
                    Settings
                    <SettingOutlined />
                  </Space>
                </Button>
              </Flex>
            }
            style={{ borderColor: '#E0E0E0', height: 320 }}
          >
            <Descriptions
              title="Application"
              items={[
                {
                  key: 'createdOn',
                  label: 'Created on',
                  children: (
                    <Text>
                      {dayjs
                        .unix(application.created_at)
                        .format('MMMM D, YYYY')}
                    </Text>
                  ),
                },
                {
                  key: 'appId',
                  label: 'Application ID',
                  children: (
                    <Text copyable>{application.uuid.toUpperCase()}</Text>
                  ),
                },
              ]}
              column={1}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ background: '#f7f7f7', height: 320, border: 'none' }}>
            <Title level={1}>Quick links</Title>
            <div style={{ marginTop: 24 }}>
              <Text>Coming soon</Text>
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Flex
            justify="space-between"
            align="center"
            style={{ margin: '40px 0 20px' }}
          >
            <Text style={{ fontSize: 18, color: '#5e5e5e', fontWeight: 600 }}>
              Chat
            </Text>
            <Space>
              <Text style={{ color: '#5e5e5e' }}>
                Last updated on{' '}
                {dayjs(Date.now()).format('MMM D, YY [at] h:mm A')} (UTC)
              </Text>

              <Tag style={{ background: '#fff', color: '#5e5e5e' }}>
                {dayjs(Date.now()).fromNow()}
              </Tag>
            </Space>
          </Flex>

          <div>
            <Flex
              gap={32}
              style={{ padding: '22px 24px', border: '1px solid #E0E0E0' }}
            >
              <div style={{ flex: '1 0 470px' }}>
                {/* quota */}
                <Space style={{ marginBottom: 20 }}>
                  <Title level={3}>Quota</Title>
                </Space>
                <Flex justify="end" gap="small" style={{ marginBottom: 30 }}>
                  <Badge
                    status="processing"
                    text={
                      <span style={{ color: '#5e5e5e', fontWeight: 400 }}>
                        Current application
                      </span>
                    }
                  />
                  <Badge
                    status="default"
                    text={
                      <span style={{ color: '#5e5e5e', fontWeight: 400 }}>
                        Remaining
                      </span>
                    }
                  />
                </Flex>

                <SimpleBarChart
                  label="Used monthly active users"
                  legend="Current application"
                  used={2}
                  total={1000}
                  percentageDecimalPlace={2}
                />

                <SimpleBarChart
                  label="Peak concurrent connections"
                  legend="Current application"
                  used={3}
                  total={20}
                  markerSuffix=" (HIGHEST)"
                  style={{ margin: '16px 0 12px 0' }}
                />
                <Link to="">
                  <strong>
                    View more quota <RightOutlined />
                  </strong>
                </Link>
              </div>

              <ActiveUserStatSummary style={{ flex: '1 0 470px' }} />
            </Flex>

            <Divider />
            <Divider />
            <Divider />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ApplicationOverviewPage;
