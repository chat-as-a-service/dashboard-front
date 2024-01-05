import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { ChannelMember } from '@wingflo/js-sdk';
import { Badge, List, Skeleton, Space, theme } from 'antd';
import SC from './ChannelMembersDrawer.styles';
import { CrownFilled } from '@ant-design/icons';
import MemberDropdown from './MemberDropdown';
import { ChatStoreContext } from '../../../pages/application/ApplicationRoot';
import InfiniteScroll from 'react-infinite-scroll-component';

const MemberList = ({
  members,
  title,
}: {
  members: ChannelMember[];
  title?: string;
}) => {
  const {
    token: { colorPrimary, colorSuccess, colorTextPlaceholder },
  } = theme.useToken();
  const chatStore = useContext(ChatStoreContext);

  return (
    <>
      {title && (
        <div style={{ padding: '6px 16px' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#858585' }}>
            {title}
          </span>
        </div>
      )}
      <div
        id="scrollableDiv"
        style={{
          maxHeight: 700,
          overflow: 'auto',
        }}
      >
        <InfiniteScroll
          dataLength={members.length}
          next={chatStore.loadMoreChannelMembers}
          hasMore={members.length === 0}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          scrollableTarget="scrollableDiv"
        >
          <List
            itemLayout="vertical"
            dataSource={members}
            split={false}
            renderItem={(channelMember) => {
              return (
                <MemberDropdown
                  channelMember={channelMember}
                  showMenu={
                    channelMember.username !== chatStore.chattingUser?.username
                  }
                >
                  <SC.ChannelMemberListItem key={channelMember.username}>
                    <Space>
                      <Badge
                        color={
                          channelMember.isOnline
                            ? colorSuccess
                            : colorTextPlaceholder
                        }
                        text={<strong>{channelMember.nickname}</strong>}
                      />
                      {channelMember.isOperator && (
                        <CrownFilled style={{ color: colorPrimary }} />
                      )}
                    </Space>
                  </SC.ChannelMemberListItem>
                </MemberDropdown>
              );
            }}
          />
        </InfiniteScroll>
      </div>
    </>
  );
};

export default observer(MemberList);
