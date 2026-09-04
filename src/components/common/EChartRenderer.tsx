import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EChartRendererProps {
  options?: echarts.EChartsOption;
  option?: echarts.EChartsOption;
  height?: string | number;
  className?: string;
  onChartClick?: (params: any) => void;
}

export const EChartRenderer: React.FC<EChartRendererProps> = ({
  options,
  option,
  height = '300px',
  className = '',
  onChartClick,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const resolvedOption = options || option || {};

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, undefined, {
        renderer: 'canvas',
      });

      chartInstance.current.on('click', (params) => {
        onChartClick?.(params);
      });
    }

    chartInstance.current.setOption(resolvedOption, true);

    const resizeObserver = new ResizeObserver(() => {
      chartInstance.current?.resize();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [resolvedOption, onChartClick]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height }}
      className={className}
    />
  );
};
