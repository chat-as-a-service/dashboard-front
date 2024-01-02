import React from 'react';
import { observer } from 'mobx-react-lite';
import { Descriptions, Space, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import SC from './ActiveUserStatSummary.styles';

const { Text, Title } = Typography;

const ActiveUserStatSummary = ({ style }: { style?: React.CSSProperties }) => {
  const itemStyle = { padding: '20px 24px' };
  return (
    <div style={style}>
      <Space align="center" style={{ marginBottom: 20 }}>
        <Title level={3}>Summary</Title>
        <Tooltip title="Summary of active users and peak concurrent connections">
          <InfoCircleOutlined />
        </Tooltip>
      </Space>

      <Descriptions
        colon={false}
        column={1}
        contentStyle={{
          textAlign: 'right',
          width: '100%',
          display: 'block',
        }}
        labelStyle={{
          background: '#fff',
          borderRight: 'none',
        }}
        bordered
        items={[
          {
            label: (
              <SC.SummaryLabel direction="vertical">
                <div>Monthly active users</div>
                <Text type="secondary">December 1 - 28, 2023</Text>
              </SC.SummaryLabel>
            ),
            children: <SC.SummaryStat>2</SC.SummaryStat>,
            style: itemStyle,
          },
          {
            label: (
              <SC.SummaryLabel direction="vertical">
                Daily active users
                <Text type="secondary">&nbsp;</Text>
              </SC.SummaryLabel>
            ),
            children: <SC.SummaryStat>2</SC.SummaryStat>,
            style: itemStyle,
          },
          {
            label: (
              <SC.SummaryLabel direction="vertical">
                <Space>
                  Peak concurrent connections
                  <Tooltip
                    title={`The highest number of active connections to WinFlo server 
                          through all devices and opened browser tabs of users.`}
                  >
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
                <Text type="secondary">December 1 - 28, 2023</Text>
              </SC.SummaryLabel>
            ),
            children: <SC.SummaryStat>3</SC.SummaryStat>,
            style: itemStyle,
          },
        ]}
      />
    </div>
  );
};

export default observer(ActiveUserStatSummary);
