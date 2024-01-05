import { List } from 'antd';
import styled from 'styled-components';

const Styles = {
  ChannelMemberListItem: styled(List.Item)`
    padding: 0 16px !important;
    display: flex !important;
    align-items: center !important;
    height: 36px;
    line-height: 1.43;

    &:hover {
      cursor: pointer;
      background: rgba(13, 13, 13, 0.04);
    }
  `,
};

export default Styles;
