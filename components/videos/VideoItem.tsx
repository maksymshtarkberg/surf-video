import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Video } from "types/types";
import VideoTagItem from "./VideoTagItem";
import { buildVideoUrl } from "utils/navigation";

type Props = {
  video: Video;
  showHd?: boolean;
  showViews?: boolean;
  showDuration?: boolean;
  showTags?: boolean;
  isFirst?: boolean;
};

const VideoItem: FC<Props> = ({
  video,
  showHd = false,
  showViews = false,
  showDuration = false,
  showTags = false,
  isFirst = false,
}) => {
  return (
    <div className="text-main justify-items-center overflow-hidden">
      <Link href={buildVideoUrl(video.slug)}>
        <a>
          <div className="relative group">
            <Image
              className="rounded-xl"
              alt={video.title}
              src={isFirst ? "/images/latest_full.jpg" : "/images/no-image.png"}
              layout={"responsive"}
              width={400}
              height={250}
            />

            {showHd && video.isHD && (
              <span className="bg-secondary py-1 px-2 bg-opacity-90 text-inverted text-xs font-semibold rounded-md absolute top-2 right-2 group-hover:opacity-0 duration-500 ease-in-out">
                LIVE
              </span>
            )}
          </div>

          <div className="mx-2 mt-2 line-clamp-2 mb-2 font-semibold">
            {video.title}
          </div>
        </a>
      </Link>
      {showTags && (
        <div className="mb-2 mx-2 mt-1 flex flex-row content-around flex-wrap">
          {video.categories.length > 0 &&
            video.categories.map((tag) => (
              <VideoTagItem key={tag} role={"category"} tag={tag} />
            ))}
          {video.models.length > 0 &&
            video.models.map((tag) => (
              <VideoTagItem key={tag} role={"city"} tag={tag} />
            ))}
        </div>
      )}
    </div>
  );
};

export default VideoItem;
