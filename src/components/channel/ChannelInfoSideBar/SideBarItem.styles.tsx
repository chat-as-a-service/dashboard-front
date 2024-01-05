import { Flex } from 'antd';
import styled from 'styled-components';

const styles = {
  Box: styled(Flex)`
    padding: 12px 16px;
    transition: background 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
    cursor: pointer;
    border-bottom: 1px solid var(--ant-color-border);

    &:hover {
      background: #f7f7f7;
    }
  `,
};

export default styles;
