import Button from "@ui/Button";
import PlayButtons from "components/PlayButtons/Play";
import VideoTimeline from "components/VideoTimeline";
import VideoListTimeline from "components/VideoListTimeline/VideoListTimeline";
import { GetServerSideProps, NextPage } from "next";
import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import PreLoader from "components/PreLoader/PreLoader";
import VideoTrimmer from "components/VideoTrimmer/VideoTrimmer";
import VideoPlayer from "components/video/VideoPlayer";

type Props = {};

const VideoCut: NextPage<Props> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [openCut, setIsCutOpened] = useState<boolean>(false);
  const [snapshots, setSnapshots] = useState<string[]>([]);

  const saveSnapshotsToLocalStorage = useCallback(
    (snapshotsArray: string[]) => {
      localStorage.setItem("snapshots", JSON.stringify(snapshotsArray));
    },
    []
  );

  const loadSnapshotsFromLocalStorage = useCallback(() => {
    const storedSnapshots = localStorage.getItem("snapshots");
    if (storedSnapshots) {
      setSnapshots(JSON.parse(storedSnapshots));
    }
  }, []);

  const removeSnapshotsFromLocalStorage = useCallback(() => {
    localStorage.removeItem("snapshots");
  }, []);

  const captureSnapshots = useCallback(
    async (videoDuration: number) => {
      setSnapshots([]);
      removeSnapshotsFromLocalStorage();

      if (!videoDuration || isNaN(videoDuration) || videoDuration <= 0) {
        console.error("Invalid video duration:", videoDuration);
        return;
      }

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

        const snapshotIntervals = 10;
        let snapshotsArray: string[] = [];

        const captureFrame = (time: number): Promise<void> => {
          return new Promise<void>((resolve) => {
            videoElement.onseeked = null;
            videoElement.currentTime = time;

            const handleSeeked = () => {
              requestAnimationFrame(() => {
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
                  resolve();
                }
              });
            };

            if (videoElement.readyState >= 2) {
              handleSeeked();
            } else {
              videoElement.onseeked = handleSeeked;
            }
          });
        };

        for (let i = 0; i < snapshotIntervals; i++) {
          const snapshotTime = (videoDuration / snapshotIntervals) * i;
          await captureFrame(snapshotTime);
        }

        saveSnapshotsToLocalStorage(snapshotsArray);
        loadSnapshotsFromLocalStorage();

        videoElement.currentTime = originalTime;
        if (wasPlaying) {
          videoElement.play();
        }
      }
      setIsCapturing(false);
      console.log(isCapturing);
    },
    [
      removeSnapshotsFromLocalStorage,
      saveSnapshotsToLocalStorage,
      loadSnapshotsFromLocalStorage,
    ]
  );

  const handleClipVideo = () => {
    setIsCutOpened(!openCut);
    videoRef.current?.pause();
  };

  return (
    <div className="bg-slate-700">
      <div className="container max-w-5xl mx-auto min-h-screen px-2 pb-10 lg:px-0 relative">
        <VideoTimeline
          videoRef={videoRef}
          canvasRef={canvasRef}
          captureSnapshots={captureSnapshots}
          isCapturing={isCapturing}
          loadSnapshotsFromLocalStorage={loadSnapshotsFromLocalStorage}
          snapshots={snapshots}
          openCut={openCut}
        />

        <div className="flex justify-between items-center py-5 px-4 sm:px-6 md:px-8 lg:px-10 gap-14">
          <VideoListTimeline />
          <PlayButtons videoRef={videoRef} />
          <Button
            text="Clip"
            onClickHandler={handleClipVideo}
            disabled={openCut}
          />
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
