import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Checkbox, Flex, Space } from 'antd';
import SC from './ActionHeader.styles';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ChannelListRes } from '../../../types/channel';

const ActionHeader = ({
  channels,
  checkedChannelUuids,
  onCheckAll,
  onUnCheckAll,
  onCancel,
}: {
  channels: ChannelListRes[];
  checkedChannelUuids: Set<string>;
  onCheckAll: (selectAll: boolean) => void;
  onUnCheckAll: () => void;
  onCancel: () => void;
}) => {
  return (
    <Flex justify="space-between" align="center" style={{ width: '100%' }}>
      <Space>
        {checkedChannelUuids.size > 0 ? (
          <>
            <Checkbox indeterminate onClick={onUnCheckAll} />
            <Button type="text" icon={<EditOutlined />} />
            {/*<Button type="text"  /> todo: metadata */}
            {/*<Button type="text"  /> todo: admin msg */}
            <Button type="text" icon={<DeleteOutlined />} />
          </>
        ) : (
          <Checkbox
            checked={channels.length === checkedChannelUuids.size}
            onChange={(val) => onCheckAll(val.target.checked)}
          >
            Select All
          </Checkbox>
        )}
      </Space>
      {checkedChannelUuids.size > 0 ? (
        <SC.SelectedText>1 Selected</SC.SelectedText>
      ) : (
        <Button
          type="link"
          style={{ fontWeight: 500, padding: 3 }}
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
    </Flex>
  );
};

export default observer(ActionHeader);
