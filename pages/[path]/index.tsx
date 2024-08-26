import { connectToDb } from "@db/database";
import { getSEOTags } from "@db/services/tags.service";
import { getRandomVideos } from "@db/services/videos.service";
import Pagination from "components/pagination";
import TagsSection from "components/tags/TagSection";
import VideosSection from "components/videos/VideosSection";
import { videoPreviewSelector } from "@db/selectors";
import { GetServerSideProps, NextPage } from "next";

import config from "tube.config";
import { NavPages, Video } from "types/types";
import { getPage, toJson, validateNavPages } from "utils/helpers";
import { buildNavUrl } from "utils/navigation";

type Props = {
  videos: Video[];
  tags: string[];
  role: NavPages;
  page: number;
};

const NavPage: NextPage<Props> = ({ videos, tags, role, page }) => {
  const configData = config[role];
  return (
    <div
      className="container max-w-5xl mx-auto min-h-screen px-2 lg:px-0 py-12"
      id="cams"
    >
      <VideosSection headline={"TOP / NEW"} videos={videos} />
      <Pagination
        hrefPrevPage={buildNavUrl(role, page - 1)}
        hrefNextPage={buildNavUrl(role, page + 1)}
        currentPage={page}
        maxPage={configData.maxPage}
      />
      <TagsSection headline="TOP / NEW" variant="h2" tags={tags} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const path = context.query.path as string;
  let pageData = getPage(path as string);
  if (!pageData) {
    pageData = { page: 1, keyword: path };
  } else {
    if (pageData.page === 1 && validateNavPages(pageData.keyword)) {
      return {
        redirect: { destination: `/${pageData.keyword}`, permanent: true },
      };
    }
  }

  if (!validateNavPages(pageData?.keyword as string)) {
    return { redirect: { destination: "/", permanent: true } };
  }

  const configData = config[pageData.keyword as NavPages];

  if (pageData.page > configData.maxPage)
    return { redirect: { destination: "/", permanent: true } };

  await connectToDb();
  const { page, keyword } = pageData;
  const videos = await getRandomVideos(
    configData.videosLimit,
    videoPreviewSelector
  );
  const tags = await getSEOTags(keyword, configData.tagsLimit, {
    _id: 0,
    name: 1,
  });

  return {
    props: {
      page,
      videos: toJson(videos),
      tags: toJson(tags.map((tag) => tag.name)),
      role: pageData.keyword,
    },
  };
};

export default NavPage;
