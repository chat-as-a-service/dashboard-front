import styled from 'styled-components';

const SimpleBarChartStyles = {
  Container: styled.div`
    position: relative;
  `,

  BaseBar: styled.div<{ $barHeight: number }>`
    position: relative;
    height: ${({ $barHeight }) => $barHeight}px;
    width: 100%;
    background: #ececec;
  `,

  ActiveBar: styled.div<{ $progressPercentage: number; $barHeight: number }>`
    position: absolute;
    top: 0;
    height: ${({ $barHeight }) => $barHeight}px;
    background: var(--ant-color-primary);
    width: ${({ $progressPercentage }) => $progressPercentage}%;
    transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  `,

  ActiveIndicator: styled.div<{
    $progressPercentage: number;
    $barHeight: number;
  }>`
    position: absolute;
    top: ${({ $barHeight }) => $barHeight + 2}px;
    left: ${({ $progressPercentage }) =>
      `calc(${$progressPercentage}% - 2.5px)`};
    width: 5px;
    height: 5px;
    border-radius: 2.5px;
    background: var(--ant-color-primary); // todo: change to secondary

    &::before {
      position: absolute;
      content: '';
      width: 1px;
      height: ${({ $barHeight }) => $barHeight + 4}px;
      top: ${({ $barHeight }) => $barHeight * -1 - 2}px;
      left: 2px;
      background: var(--ant-color-primary);
    }
  `,

  ActiveMarker: styled.div<{
    $offset: number;
    $barHeight: number;
  }>`
    position: absolute;
    will-change: transform;
    top: 0;
    left: 0;
    transform: ${({ $barHeight, $offset }) =>
      `translate3d(${$offset}px, ${$barHeight + 12}px, 0px)`};

    & > div {
      padding: 4px;
      font-size: 11px;
      line-height: 12px;
      font-weight: 600;
      letter-spacing: 0.25px;
      text-align: center;
      border-radius: 3px;
      text-transform: uppercase;
      white-space: nowrap;
      background-color: var(
        --ant-color-primary
      ); // todo: change to secondary color
      color: #fff;
    }
  `,

  BarTooltip: styled.ul`
    position: absolute;
    height: 128px;
    top: -46px;
    left: 10px;
    margin: 0;
    display: grid;
    grid-template-columns: auto;
    row-gap: 12px;
    z-index: 500;
    border-radius: 4px;
    background-color: white;
    padding: 12px 16px;
    min-width: 191px;
    list-style: none;
    pointer-events: none;
    box-shadow:
      0 3px 5px -3px rgba(13, 13, 13, 0.04),
      0 3px 14px 2px rgba(13, 13, 13, 0.08),
      0 8px 10px 1px rgba(13, 13, 13, 0.12);
  `,

  BarTooltipBadgeText: styled.span`
    font-size: 12px;
    color: #5e5e5e;
  `,
  BarTooltipBadgeStat: styled.span`
    font-size: 20px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.25px;

    & small {
      font-size: 12px;
      font-weight: 600;
      margin-left: 4px;
    }
  `,
};

export default SimpleBarChartStyles;
