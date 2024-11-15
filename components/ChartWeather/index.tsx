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
import { useRouter } from "next/router";

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
  const router = useRouter();

  const [activeChart, setActiveChart] = useState<
    "history" | "forecast" | "combined"
  >("history");

  const historyData = data.history.map((item) => ({
    x: new Date(item.date).toISOString(),
    y: item.waveHeight,
  }));

  const forecastData = data.forecast.map((item) => ({
    x: new Date(item.date).toISOString(),
    y: item.waveHeight,
  }));

  const combinedData = [
    {
      label: "Wave Height History",
      data: historyData,
      borderColor: "blue",
      backgroundColor: "rgba(0, 0, 255, 0.2)",
      fill: true,
      tension: 0.4,
    },
    {
      label: "Wave Height Forecast",
      data: forecastData,
      borderColor: "red",
      backgroundColor: "rgba(255, 0, 0, 0.2)",
      fill: true,
      tension: 0.4,
    },
  ];

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

            if (date.toDateString() === new Date().toDateString()) {
              return "Today";
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
    <>
      <div className="relative my-10 flex flex-wrap justify-between">
        {activeChart !== "combined" && (
          <button
            onClick={() => setActiveChart("combined")}
            className="px-4 py-2 rounded bg-green-500 text-white mb-2"
          >
            Show Combined
          </button>
        )}
        {(activeChart === "forecast" || activeChart === "combined") && (
          <button
            onClick={() => setActiveChart("history")}
            className="px-4 py-2 rounded bg-blue-500 text-white mb-2"
          >
            Show Prev Weeks
          </button>
        )}
        {(activeChart === "history" || activeChart === "combined") && (
          <button
            onClick={() => setActiveChart("forecast")}
            className="px-4 py-2 rounded bg-red-500 text-white mb-2"
          >
            Show Next Week
          </button>
        )}
      </div>

      <div className="relative w-full mt-6 mb-8 h-64 sm:h-80 md:h-96 lg:h-[500px]">
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            activeChart === "history" ? "opacity-100 z-10" : "opacity-0 z-0"
          } absolute inset-0`}
        >
          <h2 className="text-xl font-bold mb-4">Wave Height Previous Weeks</h2>
          <Line data={chartDataPrev} options={options} />
        </div>
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            activeChart === "forecast" ? "opacity-100 z-10" : "opacity-0 z-0"
          } absolute inset-0`}
        >
          <h2 className="text-xl font-bold mb-4">Wave Height Next Week</h2>
          <Line data={chartDataFuture} options={options} />
        </div>
        <div
          className={`transition-opacity duration-500 ease-in-out ${
            activeChart === "combined" ? "opacity-100 z-10" : "opacity-0 z-0"
          } absolute inset-0`}
        >
          <h2 className="text-xl font-bold mb-4">Combined Wave Height</h2>
          <Line data={{ datasets: combinedData }} options={options} />
        </div>
      </div>
    </>
  );
};

export default WaveHeightChart;
