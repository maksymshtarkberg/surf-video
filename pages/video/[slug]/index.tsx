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
  relatedVideos: Video[];
};

const VideoPage: NextPage<Props> = ({ video, relatedVideos }) => {
  return (
    <div
      className="container max-w-5xl mx-auto min-h-screen px-2 lg:px-0"
      id="cams"
    >
      <VideoSection video={video} relatedVideos={relatedVideos} />
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
  const models = video.models.map((model: string) => model.toLowerCase());
  const relatedVideos = await searchRelatedVideos(
    video.id,
    models,
    3,
    videoPreviewSelector
  );
  return {
    props: {
      video: toJson(video),
      relatedVideos: toJson(relatedVideos),
    },
  };
};

export default VideoPage;
