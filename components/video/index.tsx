"use client";
import React, { FC, useEffect, useState } from "react";
import { FlagIcon, ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { Video } from "types/types";

import VideoCategories from "./VideoCategories";
import VideoTags from "./VideoTags";
import { fetchAds } from "lib/contentful";
import VideoPlayer from "./VideoPlayer";
import VideosSection from "components/videos/VideosSection";
import WeatherComponent from "components/weather";
import Button from "@ui/Button";
import { useRouter } from "next/router";
type Props = {
  video: Video;
  relatedVideos: Video[];
};

interface Ad {
  contentAddUrl: string;
  contentRedirectUrl: string;
  title: string;
}

const weatherData = [
  {
    waveHeight: 5.2,
    windSpeedFT: 2.8,
    windSpeedSec: "6",
    windDirection: "WNW",
    windDegrees: 300,
  },
  { title: "Onshore Wind", onshoreWind: 11, direction: "NNW", isMap: true },
  {
    title: "Dropping tide",
    waveDrop: 0.3,
    windSpeed: 14,
  },
  {
    title: "Rashguard",
    waterTemp: 28,
    airTemp: 14,
  },
];

const VideoSection: FC<Props> = ({ video, relatedVideos }) => {
  const router = useRouter();

  const handleRouter = () => {
    router.push(`${video.slug}/cut`);
  };
  return (
    <>
      <section className="mt-1">
        <h1 className="font-semibold text-xl md:text-4xl text-center">
          {video.title}
        </h1>
        <div className="w-full flex flex-col text-main">
          <VideoPlayer />
        </div>
        <Button text="Cut" onClickHandler={handleRouter} />
      </section>
      <VideosSection
        headline="Related Videos"
        variant="h3"
        videos={relatedVideos}
      />
      <WeatherComponent weatherData={weatherData} />
    </>
  );
};

export default VideoSection;
