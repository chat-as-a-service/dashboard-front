import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Flex, Space, Tooltip, Typography } from 'antd';
import {
  ArrowLeftOutlined,
  SearchOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ApplicationViewRes } from '../../../types/application';

const { Title } = Typography;
const ActionHeader = ({
  collapsed,
  onCollapse,
  application,
}: {
  application: ApplicationViewRes;
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}) => {
  const navigate = useNavigate();
  return (
    <Flex style={{ width: '100%' }} align="center" justify="space-between">
      {collapsed ? (
        <Space>
          <Button
            icon={<VerticalLeftOutlined />}
            type="text"
            size="small"
            style={{ padding: 0 }}
            onClick={() => onCollapse(false)}
          />
        </Space>
      ) : (
        <>
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              onClick={() => navigate(`/${application.uuid}/channels`)}
            />
            <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
              Channels
            </Title>
          </Space>
          <Space.Compact>
            <Tooltip title="Search">
              <Button
                icon={<SearchOutlined />}
                style={{ padding: 0 }}
                type="text"
              />
            </Tooltip>
            <Tooltip title="Hide list">
              <Button
                icon={<VerticalRightOutlined />}
                type="text"
                onClick={() => onCollapse(true)}
              />
            </Tooltip>
          </Space.Compact>
        </>
      )}
    </Flex>
  );
};

export default observer(ActionHeader);
