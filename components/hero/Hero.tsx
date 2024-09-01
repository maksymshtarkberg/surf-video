import Pagination from "components/pagination";
import VideosSection from "components/videos/VideosSection";
import { NextPage } from "next";
import { TagRole, Video } from "types/types";
import config from "tube.config";
import { buildTagUrl } from "utils/navigation";
import { useRouter } from "next/router";

type Props = {
  page: number;
  keyword: string;
  videos: Video[];
  role: TagRole;
};

const Hero: NextPage<Props> = ({ videos, page, keyword, role }) => {
  const router = useRouter();

  const configData = config[role];

  const handlePrevPage = () => {
    router.push(buildTagUrl(keyword, role, page - 1));
    console.log("PREV", page);
  };

  const handleNextPage = () => {
    router.push(buildTagUrl(keyword, role, page + 1));
    console.log("NEXT", page);
  };
  return (
    <div
      className="container max-w-5xl mx-auto min-h-screen px-2 lg:px-0"
      id="cams"
    >
      <VideosSection headline={`${keyword}`} videos={videos} />
      <Pagination
        hrefPrevPage={handlePrevPage}
        hrefNextPage={handleNextPage}
        currentPage={page}
        maxPage={configData.maxPage}
      />
    </div>
  );
};

export default Hero;
