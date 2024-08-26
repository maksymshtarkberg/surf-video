import { connectToDb } from "@db/database";
import {
  getVideoById,
  getVideoBySlug,
  searchRelatedVideos,
} from "@db/services/videos.service";
import { GetServerSideProps, NextPage } from "next";
import { Video } from "types/types";
import { getVideoId, toJson } from "utils/helpers";
import VideoSection from "components/video";
import VideosSection from "components/videos/VideosSection";
import { videoFullSelector, videoPreviewSelector } from "@db/selectors";
import { video as videoConfig } from "tube.config";
import { getSEOTags } from "@db/services/tags.service";
import TagsSection from "components/tags/TagSection";

type Props = {
  video: Video;
};

const VideoPage: NextPage<Props> = ({ video }) => {
  return (
    <div
      className="container max-w-5xl mx-auto min-h-screen px-2 lg:px-0 py-12"
      id="cams"
    >
      <VideoSection video={video} />
      {/* <VideosSection
        headline="Most Related Videos"
        variant="h2"
        videos={relevantVideos}
      /> */}
      {/* <TagsSection headline="Popular Searches" variant="h2" tags={tags} /> */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  if (!slug) {
    return { redirect: { destination: "/", permanent: true } };
  }
  await connectToDb();
  const video = await getVideoBySlug(slug as string, true, videoFullSelector);
  if (!video) {
    return { redirect: { destination: "/", permanent: true } };
  }

  return {
    props: {
      video: toJson(video),
    },
  };
};

export default VideoPage;
