import VideoCutAndDownload from "components/VideoCut&Download";
import VideoListTimeline from "components/VideoListTimeline/VideoListTimeline";
import { GetServerSideProps, NextPage } from "next";
import { useRef } from "react";

type Props = {};

const VideoCut: NextPage<Props> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="bg-slate-700">
      <div className="container max-w-5xl mx-auto min-h-screen px-2 pb-10 lg:px-0 ">
        <VideoCutAndDownload videoRef={videoRef} />
        <div className="flex justify-between">
          <VideoListTimeline />
          <p>Play</p>
          <p>Cut</p>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  // if (!slug) {
  //   return { redirect: { destination: "/", permanent: true } };
  // }
  return {
    props: {},
  };
};

export default VideoCut;
