import { Button, Col, Flex, List, Space, theme, Typography } from 'antd';
import {
  ArrowLeftOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import defaultChannelImg from '../../static/images/default-channel-image-1.png';
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ApplicationViewRes } from '../../types/application';
import { type ChannelListRes } from '@wingflo/js-sdk';

const { Text, Title } = Typography;

const Box = styled(Col)`
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
`;

const ChannelListItem = styled(Flex)<{
  $borderColor: string;
  $selected: boolean;
}>`
  padding: 12px 16px 12px 8px;
  cursor: pointer;
  width: 100%;
  box-shadow: ${(props) =>
    props.$selected ? `inset 2px 0 0 0 ${props.$borderColor}` : 'none'};
  background-color: ${(props) => (props.$selected ? '#ECECEC' : 'none')};

  &:hover {
    background: #f7f7f7;
  }
`;

export const ChannelListSideBar = ({
  application,
  channels,
  selectedChannel,
  onSelectChannel,
}: {
  application: ApplicationViewRes;
  channels: ChannelListRes[];
  selectedChannel?: ChannelListRes;
  onSelectChannel: (channel: ChannelListRes) => void;
}) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <Box flex="320px">
      <Flex
        align="center"
        justify="space-between"
        style={{
          height: 64,
          padding: '0 8px',
          borderBottom: '1px solid #E0E0E0',
        }}
      >
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
        <Button icon={<SearchOutlined />} type="text" size="large" />
        {/*  todo: hide list button */}
      </Flex>

      <List
        itemLayout="vertical"
        dataSource={channels}
        renderItem={(channel) => {
          return (
            <List.Item
              key={channel.uuid}
              style={{ padding: 0 }}
              onClick={() => onSelectChannel(channel)}
            >
              <ChannelListItem
                align="start"
                gap="small"
                $borderColor={token.colorPrimaryBorder}
                $selected={selectedChannel?.uuid === channel.uuid}
              >
                <img
                  src={defaultChannelImg}
                  width={20}
                  height={20}
                  style={{ borderRadius: 4, marginLeft: 8 }}
                />
                <div style={{ width: '100%' }}>
                  <Flex justify="space-between" style={{ width: '100%' }}>
                    <Typography.Text strong style={{ display: 'block' }}>
                      {channel.name}
                    </Typography.Text>

                    <span
                      style={{
                        color: '#5E5E5E',
                        fontSize: 12,
                        fontWeight: 400,
                      }}
                    >
                      4 hours ago
                    </span>
                  </Flex>
                  <Space style={{ width: '100%' }}>
                    <UserOutlined />
                    <span
                      style={{
                        color: '#5E5E5E',
                        fontSize: 12,
                        fontWeight: 400,
                      }}
                    >
                      {channel.user_count} / {channel.max_members}
                    </span>
                  </Space>
                  <Text
                    style={{
                      color: '#0D0D0D',
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  >
                    {channel.uuid}
                  </Text>
                </div>
              </ChannelListItem>
            </List.Item>
          );
        }}
      />
    </Box>
  );
};
