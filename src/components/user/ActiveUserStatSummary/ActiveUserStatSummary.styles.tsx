import styled from 'styled-components';
import { Descriptions, Space } from 'antd';

const ActiveUserStatSummaryStyles = {
  SummaryLabel: styled(Space)`
    font-size: 16px;
    font-weight: 500;
    line-height: 1.33;
    letter-spacing: -0.3px;
    color: var(--ant-color-text);

    & span {
      color: #5e5e5e;
      font-size: 14px;
    }
  `,

  SummaryStat: styled.div`
    text-align: right;
    font-size: 24px;
    font-weight: 700;
    line-height: 1.33;
    letter-spacing: 0.25px;
    color: var(--ant-color-text);

    & small {
      // todo
    }
  `,

  ActiveUserSummary: styled(Descriptions)``,
};

export default ActiveUserStatSummaryStyles;
