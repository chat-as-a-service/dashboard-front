import { Flex, List } from 'antd';
import React, { useState } from 'react';
import { ApplicationViewRes } from '../../../types/application';
import { observer } from 'mobx-react-lite';
import { ChannelListRes } from '../../../types/channel';
import SC from './ChannelListSideBar.styles';
import ChannelListItem from './ChannelListItem';
import { ChannelListRes as WFChannelListRes } from '@wingflo/js-sdk';
import NormalHeader from './NormalHeader';
import ActionHeader from './ActionHeader';

const ChannelListSideBar = ({
  collapsed,
  onCollapse,
  application,
  channels,
  selectedChannel,
  onSelectChannel,
}: {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  application: ApplicationViewRes;
  channels: ChannelListRes[];
  selectedChannel?: WFChannelListRes;
  onSelectChannel: (channel: ChannelListRes) => void;
}) => {
  const [checkedChannelUuids, setCheckedChannelUuids] = useState<Set<string>>(
    new Set(),
  );
  const [checkMode, setCheckMode] = useState(false);

  return (
    <SC.Box flex="0 0 auto" style={{ width: collapsed ? '24px' : '320px' }}>
      <Flex
        align="center"
        justify="space-between"
        style={{
          height: 64,
          padding: `0 ${collapsed ? 0 : '8px'} 0 ${collapsed ? 0 : '18px'}`,
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        {checkMode ? (
          <ActionHeader
            channels={channels}
            checkedChannelUuids={checkedChannelUuids}
            onCheckAll={(selectAll) => {
              if (selectAll) {
                setCheckedChannelUuids(new Set(channels.map((c) => c.uuid)));
              } else {
                setCheckedChannelUuids(new Set());
              }
            }}
            onUnCheckAll={() => setCheckedChannelUuids(new Set())}
            onCancel={() => {
              setCheckMode(false);
              setCheckedChannelUuids(new Set());
            }}
          />
        ) : (
          <NormalHeader
            collapsed={collapsed}
            onCollapse={onCollapse}
            application={application}
          />
        )}
      </Flex>

      {!collapsed && (
        <List
          itemLayout="vertical"
          dataSource={channels}
          renderItem={(channel) => {
            return (
              <ChannelListItem
                key={channel.uuid}
                channel={channel}
                selectedChannel={selectedChannel}
                onSelect={(channel) => {
                  onSelectChannel(channel);
                  setCheckedChannelUuids(new Set());
                }}
                onCheck={(channelUuid) => {
                  setCheckMode(true);
                  setCheckedChannelUuids((checkedUuids) => {
                    const newSet = new Set(checkedUuids);
                    if (newSet.has(channelUuid)) {
                      newSet.delete(channelUuid);
                    } else {
                      newSet.add(channelUuid);
                    }
                    return newSet;
                  });
                }}
                checkedChannelUuids={checkedChannelUuids}
                checkMode={checkMode}
              />
            );
          }}
        />
      )}
    </SC.Box>
  );
};

export default observer(ChannelListSideBar);
