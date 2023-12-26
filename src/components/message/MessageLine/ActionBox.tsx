import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, ConfigProvider, Dropdown, Space, Tooltip } from 'antd';
import { ReactionToEmojiMap } from '../../../types/reaction';
import {
  MessageOutlined,
  MoreOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import {
  MessageLineActionBoxDropdownType,
  MessageType,
} from '../../../types/message';
import { UserListRes } from '../../../types/user';

const Box = styled.div`
  display: flex;
  height: 40px;
  position: absolute;
  top: -23px;
  right: 50px;
  border: 1px solid #dedede;
  background: #fff;
  border-radius: 5px;
  padding: 0 5px;
  align-items: center;
  z-index: 900;
`;

const ActionBox = ({
  open,
  openedDropdown,
  messageLineRef,
  handleReactionButtonClick,
  handleActionButtonClick,
  onMessageSelect,
  message,
  currentUser,
  handleMoreAction,
}: {
  open: boolean;
  openedDropdown: MessageLineActionBoxDropdownType;
  messageLineRef: React.RefObject<HTMLDivElement>;
  handleReactionButtonClick: (reaction: string) => void;
  handleActionButtonClick: (
    buttonType: MessageLineActionBoxDropdownType | 'reply',
  ) => void;
  onMessageSelect?: (message: MessageType) => void;
  message: MessageType;
  currentUser: UserListRes | null;
  handleMoreAction: (key: string) => void;
}) => {
  if (!open) return null;
  return (
    <ConfigProvider
      theme={{
        token: {
          motionDurationMid: '0s',
          motionDurationFast: '0s',
        },
      }}
    >
      <Box>
        <Tooltip
          open={openedDropdown === 'reactions'}
          placement="bottomRight"
          color="#fff"
          getPopupContainer={() =>
            messageLineRef.current ?? window.document.body
          }
          overlayInnerStyle={{ padding: 5 }}
          zIndex={1100}
          mouseEnterDelay={0}
          mouseLeaveDelay={0}
          title={
            <Space wrap>
              {Object.entries(ReactionToEmojiMap).map(([reaction, emoji]) => (
                <Button
                  key={reaction}
                  icon={emoji}
                  type="text"
                  onClick={() => handleReactionButtonClick(reaction)}
                />
              ))}
            </Space>
          }
        >
          <Button
            icon={<SmileOutlined />}
            type="text"
            onClick={() => handleActionButtonClick('reactions')}
          />
        </Tooltip>
        <Tooltip
          title="Reply in thread"
          mouseEnterDelay={0}
          mouseLeaveDelay={0}
        >
          <Button
            icon={<MessageOutlined />}
            type="text"
            onClick={() => {
              onMessageSelect?.(message);
              handleActionButtonClick('reply');
            }}
          />
        </Tooltip>
        <Dropdown
          overlayStyle={{ zIndex: 1100 }}
          open={openedDropdown === 'more'}
          placement="bottomRight"
          getPopupContainer={() =>
            messageLineRef.current ?? window.document.body
          }
          menu={{
            items: [
              {
                key: 'edit',
                label: 'Edit',
                disabled: message.user.username !== currentUser?.username,
              },
              {
                type: 'divider',
              },
              {
                danger: true,
                key: 'delete',
                label: 'Delete',
                disabled: message.user.username !== currentUser?.username,
              },
            ],
            onClick: ({ key }) => {
              handleMoreAction(key);
            },
          }}
        >
          <Tooltip title="More actions" mouseEnterDelay={0} mouseLeaveDelay={0}>
            <Button
              icon={<MoreOutlined />}
              type="text"
              size="small"
              onClick={() => handleActionButtonClick('more')}
            />
          </Tooltip>
        </Dropdown>
      </Box>
    </ConfigProvider>
  );
};

export default observer(ActionBox);
