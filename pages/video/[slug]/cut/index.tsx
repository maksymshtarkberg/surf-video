import Button from "@ui/Button";
import PlayButtons from "components/PlayButtons/Play";
import VideoCutAndDownload from "components/VideoCut&Download";
import VideoListTimeline from "components/VideoListTimeline/VideoListTimeline";
import { GetServerSideProps, NextPage } from "next";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import PreLoader from "components/PreLoader/PreLoader";

type Props = {};

const VideoCut: NextPage<Props> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<string[]>([]);

  const saveSnapshotsToLocalStorage = (snapshotsArray: string[]) => {
    localStorage.setItem("snapshots", JSON.stringify(snapshotsArray));
  };

  const loadSnapshotsFromLocalStorage = () => {
    const storedSnapshots = localStorage.getItem("snapshots");
    if (storedSnapshots) {
      setSnapshots(JSON.parse(storedSnapshots));
    }
  };

  const captureSnapshots = async (videoDuration: number) => {
    setIsCapturing(true);
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (videoElement && canvasElement) {
      const ctx = canvasElement.getContext("2d");
      if (!ctx) {
        console.error("Unable to get 2D context for canvas");
        setIsCapturing(false);
        return;
      }

      const wasPlaying = !videoElement.paused;
      const originalTime = videoElement.currentTime;

      videoElement.pause();

      // Количество кадров для захвата: не более 10 кадров, одно каждые 60 секунд
      const snapshotIntervals = Math.min(Math.floor(videoDuration / 60), 10);
      let snapshotsArray: string[] = [];

      const captureFrame = (time: number): Promise<void> => {
        return new Promise<void>((resolve) => {
          videoElement.currentTime = time;

          // Используем небольшую задержку для корректной работы на iOS
          const handleSeeked = () => {
            setTimeout(() => {
              if (videoElement.readyState >= 2) {
                try {
                  ctx.drawImage(
                    videoElement,
                    0,
                    0,
                    canvasElement.width,
                    canvasElement.height
                  );
                  const imageDataURL = canvasElement.toDataURL("image/jpeg");
                  snapshotsArray.push(imageDataURL);
                } catch (error) {
                  console.error("Error capturing snapshot: ", error);
                }
                resolve();
              } else {
                resolve(); // Готовность видео недостаточна, но не останавливаем процесс
              }
            }, 150); // Добавляем задержку для iOS (150 мс)
          };

          // Проверяем готовность видео и его поддержку событий
          if (videoElement.readyState >= 2) {
            handleSeeked();
          } else {
            videoElement.onseeked = handleSeeked;
          }
        });
      };

      for (let i = 0; i <= snapshotIntervals; i++) {
        // Android может лучше обрабатывать более точные интервалы времени
        const snapshotTime = i * 59.9;
        await captureFrame(snapshotTime);
      }

      setSnapshots(snapshotsArray);
      saveSnapshotsToLocalStorage(snapshotsArray);

      // Возвращаем видео на исходное время и состояние
      videoElement.currentTime = originalTime;
      if (wasPlaying) {
        videoElement.play();
      }
    }
    setIsCapturing(false);
  };

  return (
    <div className="bg-slate-700">
      <div className="container max-w-5xl mx-auto min-h-screen px-2 pb-10 lg:px-0 relative">
        {isCapturing ? (
          <PreLoader />
        ) : (
          <>
            <VideoCutAndDownload
              videoRef={videoRef}
              canvasRef={canvasRef}
              captureSnapshots={captureSnapshots}
              loadSnapshotsFromLocalStorage={loadSnapshotsFromLocalStorage}
              snapshots={snapshots}
            />
            <div className="flex justify-between items-center py-5 px-4 sm:px-6 md:px-8 lg:px-10">
              <VideoListTimeline />
              <PlayButtons videoRef={videoRef} />
              <Button text="Clip" />
            </div>
          </>
        )}
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
