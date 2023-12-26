import React, { SetStateAction, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { Avatar, Button, Divider } from 'antd';
import defaultUserImage from '../../../static/images/default-user-image-1.svg';
import {
  MessageLineActionBoxDropdownType,
  MessageType,
} from '../../../types/message';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { UserListRes } from '../../../types/user';
import { ReactionOpType } from '../../../types/reaction';
import { useConditionalOutsideAlerter } from '../../../hooks/useOutsideAlerter';
import { observer } from 'mobx-react-lite';
import ActionBox from './ActionBox';
import DeleteMessageModal from '../DeleteMessageModal';
import { ChatStoreContext } from '../../../pages/application/ApplicationRoot';
import { flowResult } from 'mobx';
import { NotificationInstance } from 'antd/es/notification/interface';
import Reactions from './Reactions';
import LinkPreview from './LinkPreview';
import MessageContent from './MessageContent';
import UploadFiles from './UploadFiles';
import { DisplayMode } from './MessageLine.types';
import Header from './Header';
import MessageTimestampLeft from './MessageTimestampLeft';

dayjs.extend(relativeTime);

const Box = styled.div<{
  $openedDropdown: MessageLineActionBoxDropdownType;
  $highlightBgOnHover: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  letter-spacing: -0.1px;
  line-height: 20px;
  position: relative;
  background: ${({ $openedDropdown, $highlightBgOnHover }) => {
    if (!$highlightBgOnHover) return 'inherit';
    return $openedDropdown == null ? 'inherit' : 'rgba(13, 13, 13, 0.04)';
  }};

  &:hover {
    background: ${({ $highlightBgOnHover }) =>
      $highlightBgOnHover ? 'rgba(13, 13, 13, 0.04)' : 'inherit'};
  }
`;

const InnerBox = styled.div`
  width: 100%;
  max-width: 972px;
  padding: 8px calc(8px * 2) 8px 16px;
  display: flex;
`;

const LeftCol = styled.div`
  width: 45px;
  flex: 0 0 auto;
`;
const MessageLine = ({
  wrapperStyle,
  style,
  innerStyle,
  message,
  displayMode,
  showLinkPreview = true,
  showReactions = true,
  showActionBox = true,
  highlightBgOnHover = true,
  onMessageSelect,
  onReaction,
  currentUser = null,
  showDateLine = false,
  setChatDropdownMaskVisible,
  notificationApi,
}: {
  wrapperStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  message: MessageType;
  displayMode: DisplayMode;
  showLinkPreview?: boolean;
  showReactions?: boolean;
  showActionBox?: boolean;
  highlightBgOnHover?: boolean;
  onMessageSelect?: (message: MessageType) => void;
  onReaction?: (
    message: MessageType,
    reaction: string,
    op: ReactionOpType,
  ) => void;
  currentUser?: UserListRes | null;
  showDateLine?: boolean;
  setChatDropdownMaskVisible?: React.Dispatch<SetStateAction<boolean>>;
  notificationApi?: NotificationInstance;
}) => {
  const chatStore = useContext(ChatStoreContext);
  const [actionBoxOpen, setActionBoxOpen] = React.useState(false);
  const [isLeftTimestampVisible, setIsLeftTimestampVisible] =
    React.useState(false);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [openedDropdown, setOpenedDropdown] =
    React.useState<MessageLineActionBoxDropdownType>(null);
  const [isDeleteMessageModalVisible, setDeleteMessageModalVisible] =
    React.useState(false);

  useConditionalOutsideAlerter(boxRef, actionBoxOpen, () => {
    setOpenedDropdown(null);
    setActionBoxOpen(false);
    setChatDropdownMaskVisible?.(false);
  });

  const isThread = useMemo(() => {
    return displayMode === 'thread-full' || displayMode === 'thread-compact';
  }, [displayMode]);

  const userReactedMap = chatStore.getMessageUserReactedMap(
    message.uuid,
    currentUser?.username ?? '',
  );

  const handleReactionButtonClick = (reaction: string) => {
    setOpenedDropdown(null);
    setChatDropdownMaskVisible?.(false);
    onReaction?.(
      message,
      reaction,
      userReactedMap?.[reaction] ?? false ? 'delete' : 'add',
    );
  };

  const handleMouseEnter = () => {
    setActionBoxOpen(true);
    setIsLeftTimestampVisible(true);
  };

  const handleMouseLeave = () => {
    if (openedDropdown == null) {
      setActionBoxOpen(false);
    }
    setIsLeftTimestampVisible(false);
  };

  const handleMoreAction = (key: string) => {
    switch (key) {
      case 'edit':
        break;
      case 'delete':
        setDeleteMessageModalVisible(true);
        break;
    }
    setOpenedDropdown(null);
    setChatDropdownMaskVisible?.(false);
  };

  const handleActionButtonClick = (
    buttonType: MessageLineActionBoxDropdownType | 'reply',
  ) => {
    switch (buttonType) {
      case 'reactions':
      case 'more':
        setOpenedDropdown((openedDropdown) => {
          if (openedDropdown === buttonType) {
            setChatDropdownMaskVisible?.(false);
            return null;
          }
          setChatDropdownMaskVisible?.(true);
          return buttonType;
        });
        break;
      case 'reply':
        setOpenedDropdown(null);
        setChatDropdownMaskVisible?.(false);
        break;
    }
  };

  const handleDeleteMsgConfirm = async () => {
    await flowResult(chatStore.deleteMessage(message));
    setDeleteMessageModalVisible(false);
    notificationApi?.success({
      message: 'Message deleted',
      placement: 'bottomLeft',
    });
  };

  return (
    <>
      <div style={wrapperStyle}>
        {showDateLine && (
          <Divider plain orientationMargin="0">
            <div
              style={{
                padding: '8px 20px',
                fontWeight: 600,
                fontSize: 12,
                border: '1px solid #E0E0E0',
                borderRadius: 20,
                color: '#5E5E5E',
              }}
            >
              {dayjs(message.created_at).format('dddd, MMMM, D')}
            </div>
          </Divider>
        )}
        <Box
          style={style}
          ref={boxRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          $openedDropdown={openedDropdown}
          $highlightBgOnHover={highlightBgOnHover}
        >
          <InnerBox style={innerStyle}>
            <LeftCol>
              {displayMode === 'compact' ? (
                <MessageTimestampLeft
                  message={message}
                  visible={isLeftTimestampVisible}
                />
              ) : (
                <Avatar size={32} src={defaultUserImage} />
              )}
            </LeftCol>
            <div style={{ flexGrow: 1 }}>
              <Header displayMode={displayMode} message={message} />
              <MessageContent message={message} />

              {showLinkPreview && (
                <LinkPreview message={message} isThread={isThread} />
              )}

              {showReactions && (
                <Reactions
                  message={message}
                  userReactedMap={userReactedMap}
                  onReaction={onReaction}
                />
              )}

              <UploadFiles message={message} />

              {!isThread && message.thread_info && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => onMessageSelect?.(message)}
                >
                  {message.thread_info.reply_count} replies
                </Button>
              )}
            </div>
          </InnerBox>

          {!isThread && showActionBox && (
            <ActionBox
              open={actionBoxOpen}
              handleActionButtonClick={handleActionButtonClick}
              handleReactionButtonClick={handleReactionButtonClick}
              handleMoreAction={handleMoreAction}
              messageLineRef={boxRef}
              message={message}
              currentUser={currentUser}
              onMessageSelect={onMessageSelect}
              openedDropdown={openedDropdown}
            />
          )}
        </Box>
      </div>

      <DeleteMessageModal
        open={isDeleteMessageModalVisible}
        onOk={handleDeleteMsgConfirm}
        onCancel={() => setDeleteMessageModalVisible(false)}
        message={message}
        state={chatStore.deleteMessageState}
      />
    </>
  );
};

export default observer(MessageLine);
