import React from 'react';
import { observer } from 'mobx-react-lite';
import { Space, Typography } from 'antd';
import SC from './SideBarItem.styles';
import { RightOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const SideBarItem = ({
  title,
  extra,
  onClick,
}: {
  title: string;
  extra?: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <SC.Box justify="space-between" onClick={onClick}>
      <Text strong>{title}</Text>
      <Space size={12}>
        {extra}
        <RightOutlined style={{ fontSize: 12 }} />
      </Space>
    </SC.Box>
  );
};

export default observer(SideBarItem);
