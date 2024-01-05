import { Col } from 'antd';
import styled from 'styled-components';

const styles = {
  Box: styled(Col)`
    background-color: #fff;
    border-right: 1px solid #e0e0e0;
    transition: width 0.1s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  `,
};

export default styles;
