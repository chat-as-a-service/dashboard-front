import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useElementSize } from 'usehooks-ts';
import { Badge, Flex } from 'antd';
import useMousePosition from '../../../hooks/useMousePosition';
import useResizeObserver from '../../../hooks/useResizeObserver';
import SC from './SimpleBarChart.styles';

const SimpleBarChart = ({
  used,
  total,
  label,
  legend = '',
  percentageDecimalPlace = 0,
  markerSuffix,
  barHeight = 32,
  enableTooltip = true,
  style,
}: {
  used: number;
  total: number;
  label: string;
  legend?: string;
  percentageDecimalPlace?: number;
  markerSuffix?: string;
  barHeight?: number;
  enableTooltip?: boolean;
  style?: React.CSSProperties;
}) => {
  const [activeBarRef, { width: activeBarWidth }] = useElementSize();
  const [activeMarkerRef, { width: activeMarkerWidth }] = useElementSize();
  const { x: mouseX, y: mouseY } = useMousePosition();
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const [baseBarBounds, setBaseBarBounds] = useState({
    xStart: 0,
    xEnd: 0,
    yStart: 0,
    yEnd: 0,
  });

  const onBaseBarResize = useCallback(
    (baseBarElement: HTMLDivElement) => {
      const { x, y, width } = baseBarElement.getBoundingClientRect();
      setBaseBarBounds({
        xStart: x,
        xEnd: x + width,
        yStart: y,
        // barHeight is used to only detect mouse hover over the bar itself, not the ActiveMarker element.
        yEnd: y + barHeight,
      });
    },
    [barHeight],
  );

  const baseBarRef = useResizeObserver<HTMLDivElement>(onBaseBarResize);

  const progressPercentage = useMemo(() => {
    return (used / total) * 100;
  }, [used, total]);

  const activeMarkerOffset = useMemo(() => {
    return Math.max(0, activeBarWidth - activeMarkerWidth / 2);
  }, [activeBarWidth, activeMarkerWidth]);

  const containerHeight = useMemo(() => {
    return barHeight + 5 + 20 + 10; // barHeight + pointer + marker + margin btw marker and bar
  }, [barHeight]);

  const isMouseHoveringBaseBar = useMemo(() => {
    if (mouseX == null || mouseY == null) return false;
    const { xStart, xEnd, yStart, yEnd } = baseBarBounds;
    return (
      mouseX >= xStart && mouseX <= xEnd && mouseY <= yEnd && mouseY >= yStart
    );
  }, [mouseX, mouseY, baseBarBounds]);

  useEffect(() => {
    if (isMouseHoveringBaseBar) {
      setTooltipLeft((mouseX ?? 0) - baseBarBounds.xStart + 10);
    }
  }, [mouseX, isMouseHoveringBaseBar, baseBarBounds]);

  return (
    <SC.Container style={style}>
      <Flex
        justify="space-between"
        align="center"
        style={{ fontSize: 12, height: 24 }}
      >
        <label>{label}</label>
        <label>{total.toLocaleString()}</label>
      </Flex>

      <div style={{ height: containerHeight }}>
        <SC.BaseBar ref={baseBarRef} $barHeight={barHeight}>
          <SC.ActiveBar
            ref={activeBarRef}
            $progressPercentage={progressPercentage}
            $barHeight={barHeight}
          />
          <SC.ActiveIndicator
            $progressPercentage={progressPercentage}
            $barHeight={barHeight}
          />
          <SC.ActiveMarker
            ref={activeMarkerRef}
            $offset={activeMarkerOffset}
            $barHeight={barHeight}
          >
            <div>
              {used}
              {markerSuffix}
            </div>
          </SC.ActiveMarker>

          {enableTooltip && (
            <SC.BarTooltip
              style={{
                opacity: isMouseHoveringBaseBar ? 1 : 0,
                left: tooltipLeft,
              }}
            >
              <li>
                <div style={{ marginBottom: 4 }}>
                  <Badge
                    status="processing"
                    text={
                      <SC.BarTooltipBadgeText>{legend}</SC.BarTooltipBadgeText>
                    }
                  />
                </div>
                <SC.BarTooltipBadgeStat>
                  {used.toLocaleString()}
                  <small>
                    ({progressPercentage.toFixed(percentageDecimalPlace)}%)
                  </small>
                </SC.BarTooltipBadgeStat>
              </li>
              <li>
                <div style={{ marginBottom: 4 }}>
                  <Badge
                    status="default"
                    text={
                      <SC.BarTooltipBadgeText>Remaining</SC.BarTooltipBadgeText>
                    }
                  />
                </div>
                <SC.BarTooltipBadgeStat>
                  {(total - used).toLocaleString()}{' '}
                  <small>
                    (
                    {(100 - progressPercentage).toFixed(percentageDecimalPlace)}
                    %)
                  </small>
                </SC.BarTooltipBadgeStat>
              </li>
            </SC.BarTooltip>
          )}
        </SC.BaseBar>
      </div>
    </SC.Container>
  );
};

export default observer(SimpleBarChart);
