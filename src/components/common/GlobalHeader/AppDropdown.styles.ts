import styled from 'styled-components';
import { DownOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';

export const RotatingDownOutlined = styled(DownOutlined)`
  font-size: 10px;
  stroke: #fff;
  stroke-width: 50;
  padding-bottom: 7px;
  & svg {
    transition: all 0.2s ease;
  }
`;

export const HeaderCreateAppButton = styled(Button)`
  height: 32px;
  & span {
    color: var(--ant-color-primary);
  }

  & span.anticon {
    //stroke-width: 40;
    stroke: var(--ant-color-primary);
  }
`;

export const HeaderAppSearchInput = styled(Input)`
  padding: 4px 4px 4px 16px;

  & input:focus {
    outline: none;
  }
`;
