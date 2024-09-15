import React, { FC } from "react";
import VideoItem from "./VideoItem";
import Headline from "@ui/Headline";
import { HeadlineVariant, Video } from "types/types";

type Props = {
  headline: string;
  variant?: HeadlineVariant;
  videos: Video[];
};

const VideosSection: FC<Props> = ({ headline, videos, variant = "h1" }) => {
  return (
    <section className="mt-5">
      <Headline variant={variant} text={headline} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gird-cols-4 gap-5 my-6">
        {videos.length === 0 ? (
          <p>No videos available</p>
        ) : (
          videos.map((video, index) => (
            <VideoItem
              key={video.id}
              video={video}
              showHd
              showViews
              showDuration
              isFirst={index === 0}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default VideosSection;
