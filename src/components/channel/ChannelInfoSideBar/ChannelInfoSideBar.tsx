import {
  Badge,
  Button,
  Col,
  Collapse,
  Descriptions,
  Flex,
  Typography,
} from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Utils } from '../../../core/Util';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import ChannelMembersDrawer from '../ChannelMembersDrawer';
import { observer } from 'mobx-react-lite';
import SideBarItem from './SideBarItem';

const { Text, Title } = Typography;

const ChannelInfoRightSideBar = styled(Col)`
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e0e0e0;
  position: relative;
  overflow: hidden;
`;

const ChannelInfoRightSideBarHeader = styled(Flex)`
  height: 64px;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
`;

const ChannelInfoSideBar = ({ onClose }: { onClose: () => void }) => {
  const [membersDrawerOpen, setMembersDrawerOpen] = useState(false);
  const sideBarRef = useRef(null);

  return (
    <ChannelInfoRightSideBar flex="320px" ref={sideBarRef}>
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
          defaultActiveKey={['information', 'moderation']}
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
              key: 'moderation',
              label: <Text strong>Channel moderation</Text>,
              onClick: () => {}, // todo
            },
          ]}
        />
        <SideBarItem
          title="Members"
          extra={
            <Badge
              count={`1 / 100`}
              color="#ECECEC"
              style={{
                color: '#5E5E5E',
                fontSize: 11,
                fontWeight: 400,
              }}
            />
          }
          onClick={() => setMembersDrawerOpen(true)}
        />
        <SideBarItem
          title="Banned"
          extra={
            <Badge
              count="0"
              color="#ECECEC"
              style={{
                color: '#5E5E5E',
                fontSize: 11,
                fontWeight: 400,
              }}
            />
          }
        />
        <SideBarItem
          title="Muted"
          extra={
            <Badge
              count="0"
              color="#ECECEC"
              style={{
                color: '#5E5E5E',
                fontSize: 11,
                fontWeight: 400,
              }}
            />
          }
        />
      </div>
      <ChannelMembersDrawer
        open={membersDrawerOpen}
        onOpen={setMembersDrawerOpen}
        getContainer={sideBarRef.current}
      />
    </ChannelInfoRightSideBar>
  );
};

export default observer(ChannelInfoSideBar);
