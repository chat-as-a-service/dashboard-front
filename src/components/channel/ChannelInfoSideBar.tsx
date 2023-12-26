import {
  Badge,
  Button,
  Col,
  Collapse,
  Descriptions,
  Drawer,
  Flex,
  List,
  Typography,
} from 'antd';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import { Utils } from '../../core/Util';
import React, { useState } from 'react';
import styled from 'styled-components';

const { Text, Title } = Typography;

const ChannelInfoRightSideBar = styled(Col)`
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e0e0e0;
  position: relative;
`;

const ChannelInfoRightSideBarHeader = styled(Flex)`
  height: 64px;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
`;

const ChannelMemberListItem = styled(List.Item)`
  padding: 0 16px !important;
  display: flex !important;
  align-items: center !important;
  height: 36px;
  line-height: 1.43;

  &:hover {
    cursor: pointer;
    background: rgba(13, 13, 13, 0.04);
  }
`;
export const ChannelInfoSideBar = ({ onClose }: { onClose: () => void }) => {
  const [membersDrawerOpen, setMembersDrawerOpen] = useState(false);

  return (
    <ChannelInfoRightSideBar flex="320px">
      {/*  channel info */}
      <ChannelInfoRightSideBarHeader justify="space-between" align="center">
        <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
          Channel information
        </Title>
        <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
      </ChannelInfoRightSideBarHeader>
      <div style={{ flexGrow: 1 }}>
        <Collapse
          bordered={false}
          style={{
            backgroundColor: '#FFF',
            borderBottom: '1px solid #e0e0e0',
          }}
          collapsible="header"
          expandIconPosition="end"
          items={[
            {
              key: 'information',
              label: <Text strong>Information</Text>,
              children: (
                <Descriptions
                  size="small"
                  colon={false}
                  column={1}
                  labelStyle={{ padding: 0, width: 90 }}
                  items={[
                    {
                      key: 'created_at',
                      label: 'Created on',
                      children: Utils.unixTsToDateTimeString(
                        new Date().valueOf(),
                      ),
                    },
                    {
                      key: 'uuid',
                      label: 'UUID',
                      children: <Text copyable>2392304230482034820398420</Text>,
                    },
                  ]}
                />
              ),
            },
            {
              key: 'members',
              label: <Text strong>Members</Text>,
              onClick: () => setMembersDrawerOpen(true),
              extra: (
                <Badge
                  count={`1 / 100`}
                  color="#ECECEC"
                  style={{
                    color: '#5E5E5E',
                    fontSize: 11,
                    fontWeight: 400,
                  }}
                />
              ),
            },
          ]}
          defaultActiveKey={['1']}
        />
      </div>
      <Drawer
        title={
          <Flex justify="space-between" style={{ height: 63 }} align="center">
            <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
              Members
            </Title>

            <Badge
              count={`1 / 100`}
              color="#ECECEC"
              style={{
                color: '#5E5E5E',
                fontSize: 11,
                fontWeight: 400,
              }}
            />
          </Flex>
        }
        getContainer={false}
        placement="right"
        onClose={() => setMembersDrawerOpen(false)}
        open={membersDrawerOpen}
        width="100%"
        closeIcon={<ArrowLeftOutlined />}
        mask={false}
        contentWrapperStyle={{ boxShadow: 'none' }}
        drawerStyle={{
          outline: 'none',
        }}
        styles={{
          header: {
            borderBottom: '1px solid #e0e0e0',
            padding: '0 16px 0 8px',
          },
          body: { padding: 0 },
        }}
      >
        <Typography.Paragraph
          color="#858585"
          style={{ fontSize: 12, fontWeight: 600, padding: '6px 16px' }}
        >
          Members
        </Typography.Paragraph>

        <List
          itemLayout="vertical"
          dataSource={[1]}
          renderItem={(channelMember, idx) => {
            return (
              <ChannelMemberListItem key={idx}>
                <Badge status="default" text={<strong>Member 1</strong>} />
              </ChannelMemberListItem>
            );
          }}
        />
      </Drawer>
    </ChannelInfoRightSideBar>
  );
};
