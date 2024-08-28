import { connectToDb } from "@db/database";
import { countVideos, searchVideos } from "@db/services/videos.service";
import Pagination from "components/pagination";
import VideosSection from "components/videos/VideosSection";
import { videoPreviewSelector } from "@db/selectors";
import { GetServerSideProps, NextPage } from "next";
import { TagRole, Video } from "types/types";
import {
  getPage,
  getTagRoleByRoute,
  toJson,
  validateTagRole,
} from "utils/helpers";
import config from "tube.config";
import { buildTagUrl } from "utils/navigation";
import { useRouter } from "next/router";

type Props = {
  page: number;
  keyword: string;
  videos: Video[];
  role: TagRole;
  totalVideos: number;
};

const TagPage: NextPage<Props> = ({
  videos,
  page,
  keyword,
  role,
  totalVideos,
}) => {
  const router = useRouter();

  const videosPerPage = 6;
  const maxPage = Math.ceil(totalVideos / videosPerPage);
  console.log(maxPage);
  const handlePrevPage = () => {
    if (page >= 1) {
      const prevPageUrl = buildTagUrl(keyword, role, page - 1);
      router.push(prevPageUrl);
    }
  };
  const handleNextPage = () => {
    if (page < maxPage) {
      const hrefNextPage = buildTagUrl(keyword, role, page + 1);
      router.push(hrefNextPage);
    }
  };

  return (
    <div
      className="container max-w-5xl mx-auto min-h-screen px-2 lg:px-0 py-12"
      id="cams"
    >
      <VideosSection headline={`${keyword}`} videos={videos} />
      <Pagination
        hrefPrevPage={handlePrevPage}
        hrefNextPage={handleNextPage}
        currentPage={page}
        maxPage={maxPage}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const path = context.query.path;
  const pageData = getPage(context.query.keyword as string);

  if (!pageData || !validateTagRole(path as string)) {
    return { redirect: { destination: "/", permanent: true } };
  }
  const configData = config[path as TagRole];

  if (pageData.page > configData.maxPage)
    return { redirect: { destination: "/", permanent: true } };

  await connectToDb();
  const { page, keyword } = pageData;

  const limit = 6;

  const offset = (page - 1) * limit;

  const totalVideos = await countVideos(keyword);
  console.log("HERE", keyword);
  const videos = await searchVideos(
    keyword,
    limit,
    videoPreviewSelector,
    offset
  );

  return {
    props: {
      page,
      keyword,
      videos: toJson(videos),
      role: getTagRoleByRoute(path as string),
      totalVideos,
    },
  };
};

export default TagPage;
