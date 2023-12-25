import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Dropdown,
  Space,
  Tooltip,
  Typography,
  Upload,
} from 'antd';
import { Utils } from '../../core/Util';
import defaultUserImage from '../../static/images/default-user-image-1.svg';
import { MessageType, ReactionType } from '../../types/message';
import dayjs from 'dayjs';
import {
  MessageOutlined,
  MoreOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import relativeTime from 'dayjs/plugin/relativeTime';
import { UserListRes } from '../../types/user';
import { ReactionOpType } from '../../types/reaction';
import { useOutsideAlerter } from '../../hooks/useOutsideAlerter';

dayjs.extend(relativeTime);
const { Text, Paragraph } = Typography;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  letter-spacing: -0.1px;
  line-height: 20px;
  position: relative;

  &:hover {
    background: rgba(13, 13, 13, 0.04);
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
`;

const MessageTimestamp = styled.time`
  opacity: 0;
  color: #808080;
  font-size: 12px;

  ${Box}:hover & {
    opacity: 1;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const AvatarTimestamp = styled.time`
  color: #5e5e5e;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

const ActionBoxBox = styled.div`
  //width: 150px;
  height: 40px;
  position: absolute;
  top: -23px;
  right: 50px;
  border: 1px solid #dedede;
  background: #fff;
  border-radius: 5px;
  padding: 0 5px;
  align-items: center;
`;

const DateLine = styled(Divider)``;

const reactionToEmojiMap: Record<string, string> = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😡',
  check: '✅',
  clap: '👏',
};

const Linkify = ({ children }: { children: string }) => {
  const isUrl = (word: string) => {
    const urlPattern =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
    return word.match(urlPattern);
  };

  const addMarkup = (word: string) => {
    return isUrl(word) ? `<a href='${word}' target='_blank'>${word}</a>` : word;
  };

  const words = children?.split(' ') ?? [];
  const formatedWords = words.map((w, i) => addMarkup(w));
  const html = formatedWords.join(' ');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export const MessageLine = ({
  message,
  displayMode,
  onMessageSelect,
  onMessageDelete,
  style,
  onReaction,
  currentUser,
  showDateLine = false,
  onReRender,
  registerChild,
}: {
  message: MessageType;
  displayMode: 'compact' | 'full' | 'thread-full' | 'thread-compact';
  onMessageSelect?: (message: MessageType) => void;
  onMessageDelete?: (message: MessageType) => void;
  style?: React.CSSProperties;
  onReaction: (
    message: MessageType,
    reaction: string,
    op: ReactionOpType,
  ) => void;
  currentUser: UserListRes | null;
  showDateLine?: boolean;
  onReRender?: () => void;
  registerChild?: (element?: Element) => void;
}) => {
  const [reactionPopConfirmOpen, setReactionPopConfirmOpen] =
    React.useState(false);
  const [actionBoxOpen, setActionBoxOpen] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const reactionBoxRef = React.useRef(null);
  const actionBoxRef = React.useRef(null);

  useOutsideAlerter(
    boxRef,
    () => {
      setReactionPopConfirmOpen(false);
      setActionBoxOpen(false);
    },
    reactionBoxRef.current,
  );

  const isThread = useMemo(() => {
    return displayMode === 'thread-full' || displayMode === 'thread-compact';
  }, [displayMode]);

  const reactionMap = useMemo(() => {
    const map: Record<string, ReactionType[]> = {};
    for (const reaction of message.reactions.sort((a, b) =>
      a.reaction.localeCompare(b.reaction),
    )) {
      map[reaction.reaction] = [...(map[reaction.reaction] ?? []), reaction];
    }
    return map;
  }, [message.reactions]);

  const userReactedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const reaction of message.reactions) {
      if (reaction.user.username === currentUser?.username) {
        map[reaction.reaction] = true;
      }
    }
    return map;
  }, [currentUser?.username, message.reactions]);

  const handleReactionButtonClick = (e: React.MouseEvent, reaction: string) => {
    e.preventDefault();
    setReactionPopConfirmOpen(false);
    onReaction(
      message,
      reaction,
      userReactedMap?.[reaction] ?? false ? 'delete' : 'add',
    );
  };

  const handleMouseEnter = () => {
    setActionBoxOpen(true);
  };

  const handleMouseLeave = () => {
    if (!reactionPopConfirmOpen) {
      setActionBoxOpen(false);
    }
  };

  const handleMoreAction = (key: string, message: MessageType) => {
    switch (key) {
      case 'edit':
        break;
      case 'delete':
        onMessageDelete?.(message);
        break;
    }
  };

  return (
    <>
      {/* @ts-ignore */}
      <div style={style} ref={registerChild}>
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
          ref={boxRef}
          onMouseEnter={() => handleMouseEnter()}
          onMouseLeave={handleMouseLeave}
        >
          <InnerBox>
            <LeftCol>
              {displayMode === 'compact' ? (
                <Tooltip
                  title={Utils.unixMsTsToDateTimeString(message.created_at)}
                  mouseLeaveDelay={0}
                  mouseEnterDelay={0}
                  overlayInnerStyle={{ fontSize: 12 }}
                >
                  <MessageTimestamp>
                    {dayjs(message.created_at).format('HH:mm')}
                  </MessageTimestamp>
                </Tooltip>
              ) : (
                <Avatar size={32} src={defaultUserImage} />
              )}
            </LeftCol>
            <div>
              {(displayMode === 'full' ||
                displayMode === 'thread-full' ||
                displayMode === 'thread-compact') && (
                <Space>
                  <Text strong>{message.user.nickname}</Text>
                  <Tooltip
                    title={Utils.unixMsTsToDateTimeString(message.created_at)}
                    mouseLeaveDelay={0}
                    mouseEnterDelay={0}
                    overlayInnerStyle={{ fontSize: 12 }}
                  >
                    <AvatarTimestamp>
                      {(() => {
                        const ts = dayjs(message.created_at);
                        switch (displayMode) {
                          case 'full':
                            return ts.format('H:mm A');
                          case 'thread-full':
                            return ts.format('MMM DD [at] H:mm A');
                          case 'thread-compact':
                            return dayjs().from(ts);
                        }
                      })()}
                    </AvatarTimestamp>
                  </Tooltip>
                </Space>
              )}
              <Paragraph style={{ margin: 0 }}>
                <Linkify>{message.message}</Linkify>
              </Paragraph>
              {message.og_tag && (
                <Card
                  style={{
                    width:
                      displayMode === 'full' || displayMode === 'compact'
                        ? 300
                        : '80%',
                    margin: '10px 0',
                    cursor: 'pointer',
                  }}
                  size={isThread ? 'small' : 'default'}
                  onClick={() => window.open(message.og_tag?.url, '_blank')}
                  cover={
                    message.og_tag.image && (
                      <img
                        alt={message.og_tag.image_alt ?? ''}
                        src={message.og_tag.image}
                        onLoad={onReRender}
                      />
                    )
                  }
                >
                  <Card.Meta title={message.og_tag.title} />
                </Card>
              )}
              {/* Reactions */}
              <Space style={{ marginTop: 5 }}>
                {Object.entries(reactionMap).map(([reaction, reactions]) => {
                  const userAlreadyReacted =
                    userReactedMap?.[reaction] ?? false;
                  return (
                    <Button
                      size="small"
                      icon={reactionToEmojiMap[reaction]}
                      type={userAlreadyReacted ? 'primary' : 'text'}
                      onClick={() =>
                        onReaction(
                          message,
                          reaction,
                          userAlreadyReacted ? 'delete' : 'add',
                        )
                      }
                    >
                      <span>{reactions.length}</span>
                    </Button>
                  );
                })}
              </Space>

              {message.attachments.length > 0 && (
                <Upload
                  listType="picture"
                  className="upload-list-inline"
                  defaultFileList={message.attachments.map(
                    (attachment, idx) => ({
                      uid: idx.toString(),
                      name: attachment.original_file_name,
                      type: attachment.content_type,
                      url: attachment.download_signed_url,
                      status: 'done',
                    }),
                  )}
                ></Upload>
              )}
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

          {!isThread && (
            <ActionBoxBox
              style={{ display: actionBoxOpen ? 'flex' : 'none' }}
              ref={actionBoxRef}
            >
              <Tooltip
                open={reactionPopConfirmOpen}
                placement="bottomRight"
                trigger={['click']}
                color="#fff"
                overlayInnerStyle={{ padding: 5 }}
                title={
                  <Space>
                    <Button
                      icon="👍"
                      type="text"
                      onClick={(e) => handleReactionButtonClick(e, 'like')}
                    />
                    <Button
                      icon="✅"
                      type="text"
                      onClick={(e) => handleReactionButtonClick(e, 'check')}
                    />
                    <Button
                      icon="👏"
                      type="text"
                      onClick={(e) => handleReactionButtonClick(e, 'clap')}
                    />
                  </Space>
                }
              >
                <Button
                  icon={<SmileOutlined />}
                  type="text"
                  onClick={() => setReactionPopConfirmOpen((open) => !open)}
                />
              </Tooltip>
              <Tooltip title="Reply in thread">
                <Button
                  icon={<MessageOutlined />}
                  type="text"
                  onClick={() => {
                    onMessageSelect?.(message);
                    setReactionPopConfirmOpen(false);
                  }}
                />
              </Tooltip>
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    {
                      key: 'edit',
                      label: 'Edit',
                      disabled: message.user.username !== currentUser?.username,
                    },
                    {
                      key: 'delete',
                      label: 'Delete',
                      disabled: message.user.username !== currentUser?.username,
                    },
                  ],
                  onClick: ({ key }) => {
                    handleMoreAction(key, message);
                    setReactionPopConfirmOpen(false);
                  },
                }}
              >
                <Button icon={<MoreOutlined />} type="text" size="small" />
              </Dropdown>
            </ActionBoxBox>
          )}
        </Box>
      </div>
    </>
  );
};
