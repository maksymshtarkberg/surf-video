import { GetServerSideProps, NextPage } from "next";
import VideosSection from "components/videos/VideosSection";
import { TagRole, Video } from "types/types";
import { connectToDb } from "@db/database";
import { getPage, toJson } from "utils/helpers";
import { getRandomVideos, searchVideos } from "@db/services/videos.service";
import { videoPreviewSelector, videoTitleSelector } from "@db/selectors";
import Pagination from "components/pagination";
import { useState } from "react";
import { buildNavUrl } from "utils/navigation";
import { useRouter } from "next/router";
import { getPopularTags } from "@db/services/tags.service";
import { toplist } from "tube.config";
import Menu from "components/Menu";
import Navbar from "components/navbar";
import NavMobile from "components/navbar/NavMobile";

type Props = {
  videos: Video[];
  models: string[];
  videosByCity: {
    city: string;
    videos: VideoTitle;
  }[];
};

type VideoTitle = {
  slug: string;
  title: string;
}[];

const HomePage: NextPage<Props> = ({ videos, models, videosByCity }) => {
  const videosPerPage = 6;
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const paginatedVideos = videos.slice(startIndex, endIndex);

  const totalPages = Math.ceil(videos.length / videosPerPage);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    console.log(page);

    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div
      className="container max-w-5xl mx-auto min-h-screen px-2 lg:px-0"
      id="cams"
    >
      <Menu
        cities={models}
        videosByCity={videosByCity}
        btnPosition="absolute bottom-[25px] 2xl:-left-[15%] xl:-left-[5%]"
      />
      <NavMobile videosByCity={videosByCity} />
      <VideosSection
        headline="Surf Check"
        variant="h2"
        videos={paginatedVideos}
      />
      <Pagination
        hrefPrevPage={handlePrevPage}
        hrefNextPage={handleNextPage}
        currentPage={page}
        maxPage={totalPages}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  await connectToDb();
  const videos = await getRandomVideos(30, videoPreviewSelector);

  const models = await getPopularTags(
    toplist.role as TagRole,
    toplist.listLimit,
    {
      _id: 0,
      name: 1,
    }
  );

  const videosByCity = await Promise.all(
    models.map(async (model) => {
      const city = model.name;
      const videosCity = await searchVideos(city, 5, videoTitleSelector, 0);
      return { city, videos: videosCity };
    })
  );
  return {
    props: {
      videos: toJson(videos),
      models: toJson(models.map((model) => model.name)),
      videosByCity: toJson(videosByCity),
    },
  };
};

export default HomePage;
