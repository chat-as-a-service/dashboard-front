import { Flex, Space, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

const styles = {
  CheckBoxCol: styled.div`
    flex: 0 0 auto;
    text-align: right;
    overflow: hidden;
    transition:
      width 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s,
      opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  `,

  ContentCol: styled(Space)`
    flex: 1 1 auto;
    display: flex;
  `,
  Box: styled(Flex)<{
    $borderColor: string;
    $selected: boolean;
  }>`
    display: flex;
    gap: 0;
    padding: 12px 16px 12px 8px;
    cursor: pointer;
    width: 100%;
    box-shadow: ${(props) =>
      props.$selected ? `inset 2px 0 0 0 ${props.$borderColor}` : 'none'};
    background-color: ${(props) => (props.$selected ? '#ECECEC' : 'none')};
    transition: background 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;

    &:hover {
      background: #f7f7f7;
    }
  `,

  ChannelUuid: styled.div`
    margin-top: 8px;
    color: #0d0d0d;
    font-size: 12px;
    font-weight: 400;
    height: 16px;
    width: 245px;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
};

export default styles;
