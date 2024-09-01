import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import dynamic from "next/dynamic";
import "chartjs-adapter-date-fns";

const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

type WaveDataPoint = {
  date: string;
  waveHeight: number;
};

type WaveHeightData = {
  history: WaveDataPoint[];
  forecast: WaveDataPoint[];
};

type WaveHeightChartProps = {
  data: WaveHeightData;
};

const WaveHeightChart: React.FC<WaveHeightChartProps> = ({ data }) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const historyData = data.history.map((item) => ({
    x: new Date(item.date).toISOString(),
    y: item.waveHeight,
  }));

  const forecastData = data.forecast.map((item) => ({
    x: new Date(item.date).toISOString(),
    y: item.waveHeight,
  }));

  const chartDataPrev = {
    datasets: [
      {
        label: "Wave Height History for the Previous 2 Weeks",
        data: historyData,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const chartDataFuture = {
    datasets: [
      {
        label: "Wave Height Forecast for the Next Week",
        data: forecastData,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Height: ${context.raw.y} ft`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "day" as const,
          tooltipFormat: "PPP",
        },
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          callback: (value: any, index: number, values: any) => {
            const date = new Date(value);

            if (date.toDateString() === yesterday.toDateString()) {
              return "Yesterday";
            }
            const options = { month: "short", day: "numeric" } as const;

            return index % 2 === 0
              ? new Intl.DateTimeFormat("en-US", options).format(new Date(date))
              : "";
          },
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        title: {
          display: true,
          text: "Wave Height (ft)",
        },
        ticks: {
          callback: (value: any) => `${value} ft`,
        },
      },
    },
  };

  return (
    <div>
      <h2 className="text-xl font-bold mt-5">Wave Height Previous Weeks</h2>
      <Line data={chartDataPrev} options={options} />
      <h2 className="text-xl font-bold mt-5">Wave Height Next Week</h2>
      <Line data={chartDataFuture} options={options} />
    </div>
  );
};

export default WaveHeightChart;
