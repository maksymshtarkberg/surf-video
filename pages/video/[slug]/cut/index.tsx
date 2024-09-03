import VideoCutAndDownload from "components/VideoCut&Download";
import { GetServerSideProps, NextPage } from "next";

type Props = {};

const VideoCut: NextPage<Props> = () => {
  return (
    <>
      <VideoCutAndDownload />
    </>
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
