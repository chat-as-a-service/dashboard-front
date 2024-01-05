import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import SC from './ChannelListItem.styles';
import defaultChannelImg from '../../../static/images/default-channel-image-1.png';
import { Checkbox, Flex, List, Space, theme, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { ChannelListRes } from '../../../types/channel';
import dayjs from 'dayjs';
import { ChannelListRes as WFChannelListRes } from '@wingflo/js-sdk';

const { Text } = Typography;

const ChannelListItem = ({
  channel,
  onSelect,
  selectedChannel,
  onCheck,
  checkedChannelUuids,
  checkMode,
}: {
  channel: ChannelListRes;
  selectedChannel?: WFChannelListRes;
  onSelect: (channel: ChannelListRes) => void;
  onCheck: (channelUuid: string) => void;
  checkedChannelUuids: Set<string>;
  checkMode: boolean;
}) => {
  const {
    token: { colorPrimaryBorder },
  } = theme.useToken();

  const [hovered, setHovered] = React.useState(false);

  const showCheckBox = useMemo(() => {
    return checkMode || hovered;
  }, [checkMode, hovered]);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <List.Item
      key={channel.uuid}
      style={{ padding: 0 }}
      onClick={() => onSelect(channel)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SC.Box
        align="start"
        gap="small"
        $borderColor={colorPrimaryBorder}
        $selected={selectedChannel?.uuid === channel.uuid}
      >
        <SC.CheckBoxCol
          style={{
            width: showCheckBox ? 28 : 0,
            opacity: showCheckBox ? 1 : 0,
          }}
        >
          <Checkbox
            onClick={(e) => {
              e.stopPropagation();
              onCheck(channel.uuid);
            }}
            checked={checkedChannelUuids.has(channel.uuid)}
          />
        </SC.CheckBoxCol>
        <SC.ContentCol align="start">
          <img
            src={defaultChannelImg}
            width={20}
            height={20}
            style={{ borderRadius: 4, marginLeft: 8 }}
            alt="channel"
          />
          <div style={{ width: '100%' }}>
            <Flex
              justify="space-between"
              style={{ width: '100%', display: 'flex', position: 'relative' }}
            >
              <Typography.Text strong style={{ display: 'block' }}>
                {channel.name}
              </Typography.Text>

              <time
                style={{
                  color: '#5E5E5E',
                  fontSize: 12,
                  fontWeight: 400,
                  textAlign: 'right',
                  flex: '1 0 0%',
                  position: 'relative',
                  top: 2,
                }}
              >
                {dayjs(channel.created_at).fromNow()}
              </time>
            </Flex>
            <Space style={{ width: '100%', marginTop: 4 }}>
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
            <SC.ChannelUuid>{channel.uuid}</SC.ChannelUuid>
          </div>
        </SC.ContentCol>
      </SC.Box>
    </List.Item>
  );
};

export default observer(ChannelListItem);
