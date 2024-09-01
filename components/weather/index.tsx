import React from "react";
import MapWeather from "./MapWeather";
import {
  HighTempIcon,
  LowTempIcon,
  MediumTempIcon,
  WaterDropIcon,
} from "@ui/WaterIcon";
import { getWindDirectionArrow } from "@db/utils/weatherArrows";
import WaveHeightChart from "components/ChartWeather";
import LineChart from "components/ChartWeather";

type WeatherData = {
  title?: string;
  waveHeight?: number;
  waveDrop?: number;
  windSpeedFT?: number;
  windSpeedSec?: string;
  windDirection?: string;
  windDegrees?: number;
  onshoreWind?: number;
  direction?: string;
  waterTemp?: number;
  airTemp?: number;
  isMap?: boolean;
};

type Props = {
  weatherData: WeatherData[];
};

const data = {
  history: [
    { date: "2024-08-18", waveHeight: 1.2 },
    { date: "2024-08-19", waveHeight: 1.5 },
    { date: "2024-08-20", waveHeight: 1.7 },
    { date: "2024-08-21", waveHeight: 2.0 },
    { date: "2024-08-22", waveHeight: 2.3 },
    { date: "2024-08-23", waveHeight: 2.1 },
    { date: "2024-08-24", waveHeight: 1.8 },
    { date: "2024-08-25", waveHeight: 1.9 },
    { date: "2024-08-26", waveHeight: 2.2 },
    { date: "2024-08-27", waveHeight: 2.4 },
    { date: "2024-08-28", waveHeight: 2.3 },
    { date: "2024-08-29", waveHeight: 2.1 },
    { date: "2024-08-30", waveHeight: 2.0 },
    { date: "2024-08-31", waveHeight: 1.8 },
    { date: "2024-09-01", waveHeight: 1.9 },
  ],
  forecast: [
    { date: "2024-09-02", waveHeight: 2.2 },
    { date: "2024-09-03", waveHeight: 2.3 },
    { date: "2024-09-04", waveHeight: 2.4 },
    { date: "2024-09-05", waveHeight: 2.2 },
    { date: "2024-09-06", waveHeight: 2.1 },
    { date: "2024-09-07", waveHeight: 2.0 },
    { date: "2024-09-08", waveHeight: 2.1 },
  ],
};

const WeatherComponent: React.FC<Props> = ({ weatherData }) => {
  const getWaveHeightColor = (height: number) => {
    if (height < 1) return "bg-red-500";
    if (height >= 2) return "bg-green-500";
    return "bg-orange-500";
  };
  const getWaveHeightText = (height: number) => {
    if (height < 1) return "Unrideable";
    if (height >= 1 && height < 2) return "Poor";
    if (height >= 2 && height < 3) return "Fair";
    if (height >= 3 && height < 6) return "Good";
    if (height >= 6) return "Excellent";
  };

  const getWaveHeightTitle = (height: number) => {
    if (height < 1) return "Shin to knee";
    if (height >= 1 && height < 2) return "Knee to thigh";
    if (height >= 2 && height < 3) return "Thigh to stomach";
    if (height >= 3 && height < 4) return "Waist to Chest";
    if (height >= 4 && height < 5) return "Chest to head";
    if (height >= 5 && height < 6) return "Chest to 1ft overhead";
    if (height >= 6) return "Overhead";
  };

  const getWaveHeightTextColor = (height: number) => {
    if (height < 1) return "text-red-500";
    if (height >= 2) return "text-green-500";
    return "text-orange-500";
  };

  const getTempIcon = (temperature: number) => {
    if (temperature > 30) return <HighTempIcon />;
    if (temperature > 15) return <MediumTempIcon />;
    return <LowTempIcon />;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>
      <div className="grid lg:grid-cols-4 gap-4 md:grid-cols-2">
        {weatherData.map((data, index) => (
          <div
            key={index}
            className="border p-4 text-gray-700 transition-shadow duration-300 ease-in-out shadow-lg rounded-lg overflow-hidden bg-white"
          >
            {data?.waveHeight ? (
              <h3 className="font-bold pb-4">
                {getWaveHeightTitle(data.waveHeight)}
              </h3>
            ) : (
              <h3 className="font-bold pb-4">{data.title}</h3>
            )}
            {data.waveHeight && (
              <>
                <div className="flex justify-between ">
                  <div className="relative flex">
                    <div
                      className={`absolute top-[18px] -left-[32px] h-2 w-[50px] flex-1 rounded-lg rotate-90 ${getWaveHeightColor(
                        data.waveHeight
                      )}`}
                    ></div>
                    <div className="flex flex-col pl-1">
                      <div className="flex items-baseline">
                        <p className="text-[22px] font-bold leading-[24px] tracking-normal whitespace-nowrap lowercase text-gray-900">
                          {data.waveHeight}
                        </p>
                        <p className="text-[12px] font-bold leading-[14px] tracking-normal whitespace-nowrap lowercase text-gray-900">
                          ft
                        </p>
                      </div>
                      <p
                        className={`${getWaveHeightTextColor(data.waveHeight)}`}
                      >
                        {getWaveHeightText(data.waveHeight)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.windSpeedFT && (
                      <div className="flex items-baseline">
                        <p className="p-0 text-base font-bold leading-5 tracking-wide uppercase text-gray-900 inline-block truncate">
                          {data.windSpeedFT}
                        </p>
                        <p className="p-0 text-xs font-bold leading-4 tracking-tight lowercase text-gray-900 inline-block">
                          ft
                        </p>
                      </div>
                    )}
                    {data.windSpeedSec && (
                      <div className="flex items-baseline">
                        <p className="text-sm font-bold leading-5 tracking-wide uppercase text-gray-900 inline-block">
                          {data.windSpeedSec}
                        </p>
                        <p className="p-0 text-xs font-bold leading-4 tracking-tight lowercase text-gray-900 inline-block">
                          s
                        </p>
                      </div>
                    )}
                    {data.windDirection && data.windDegrees && (
                      <div className="flex items-baseline">
                        <p className="text-sm font-bold leading-4 tracking-wide uppercase text-gray-900 inline-block pr-1">
                          {data.windDirection}
                        </p>
                        <p className="text-xs font-bold leading-5 tracking-wide uppercase text-gray-400 inline-block">
                          {data.windDegrees}°
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between">
              {data.onshoreWind && (
                <div className="flex items-baseline">
                  <p className="text-2xl font-bold leading-6 tracking-normal whitespace-nowrap text-gray-900">
                    {data.onshoreWind}
                  </p>
                  <p className="text-xs font-bold leading-4 tracking-tight lowercase text-gray-900 inline-block">
                    kts
                  </p>
                </div>
              )}

              {data.direction && (
                <div className="flex items-center">
                  <p className="text-lg font-bold leading-6 tracking-normal whitespace-nowrap text-gray-900">
                    {data.direction}
                  </p>
                  <div className="w-3 h-3 leading-6 tracking-normal whitespace-nowrap text-gray-900">
                    {getWindDirectionArrow(data.direction)}
                  </div>
                </div>
              )}
            </div>
            {data.waveDrop && (
              <div>
                <p className="text-[22px] font-bold leading-[24px] tracking-normal whitespace-nowrap lowercase text-gray-900">
                  {data.waveDrop}m ↓
                </p>
              </div>
            )}
            <div>
              {data.waterTemp && (
                <div className="flex items-center gap-1">
                  <WaterDropIcon />
                  <p className="pl-2 text-[22px] font-bold leading-[24px] tracking-normal whitespace-nowrap lowercase text-gray-900">
                    {data.waterTemp}°C
                  </p>
                </div>
              )}
              {data.airTemp && (
                <div className="flex items-center gap-1">
                  {getTempIcon(data.airTemp)}
                  <p className="text-xs font-bold leading-5 tracking-wide uppercase text-gray-400 inline-block">
                    {data.airTemp}°C
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <WaveHeightChart data={data} />
    </div>
  );
};

export default WeatherComponent;
