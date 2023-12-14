import React from 'react';
import { Button, Card, Col, Descriptions, Flex, Row, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import type { DescriptionsProps } from 'antd/es/descriptions';
import defaultAppImage from '../../static/images/default-app-image.svg';
import styled from 'styled-components';
import { useAppOutletContext } from './ApplicationRoot';
import { Utils } from '../../core/Util';
import dayjs from 'dayjs';

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
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title={
              <Flex
                justify="space-between"
                align="center"
                style={{ height: 90 }}
              >
                <Flex align="center">
                  <AppImageBox>
                    <img width="32" height="32" src={defaultAppImage} />
                  </AppImageBox>
                  <Title level={4} style={{ margin: 0 }}>
                    {application.name}
                  </Title>
                </Flex>
                <Button type="text" icon={<SettingOutlined />}>
                  Settings
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
          <Card style={{ borderColor: '#E0E0E0', height: 320 }}>
            <Title level={4} style={{ margin: 0 }}>
              Quick links
            </Title>
            <Text>Coming soon</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ApplicationOverviewPage;
