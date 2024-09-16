import Button from "@ui/Button";
import PlayButtons from "components/PlayButtons/Play";
import VideoTimeline from "components/VideoTimeline";
import VideoListTimeline from "components/VideoListTimeline/VideoListTimeline";
import { GetServerSideProps, NextPage } from "next";
import { useRef, useState, useCallback, useEffect } from "react";
import PreLoader from "components/PreLoader/PreLoader"; // Assuming you have a PreLoader component
import VideoPlayer from "components/video/VideoPlayer";
import { setIsClipDisabled, setIsCutOpened } from "store/slices/openCutSlice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { setIsCapturing } from "store/slices/isCapturingSlice";
import { setDuration } from "store/slices/videoSlice";
import {
  setDownloadUrl,
  setFileReady,
  setIsLoadingCut,
  setIsProcessing,
  setTrimmedVideoBlob,
  setVideoFile,
  setVideoSrc,
} from "store/slices/videoFileSlice";
import { useRouter } from "next/router";

type Props = {
  slug: string;
};

const VideoCut: NextPage<Props> = ({ slug }) => {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [snapshots, setSnapshots] = useState<string[]>([]);

  const openCut = useAppSelector((state) => state.openCut.openCut);
  const isCapturing = useAppSelector((state) => state.isCapturing.isCapturing);
  const videoSrc = useAppSelector((state) => state.videoFile.videoSrc);
  const duration = useAppSelector((state) => state.video.duration);

  const dispatch = useAppDispatch();

  const toggleOpenCut = () => {
    dispatch(setIsCutOpened(!openCut));
    videoRef.current?.pause();
  };
  const toggleExit = useCallback(() => {
    dispatch(
      setVideoSrc(
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      )
    );
    dispatch(setIsLoadingCut(false));
    dispatch(setDownloadUrl(""));
    dispatch(setFileReady(false));
    dispatch(setIsProcessing(false));
    dispatch(setVideoFile(null));
    dispatch(setTrimmedVideoBlob(null));
    dispatch(setIsCutOpened(false));
    dispatch(setIsClipDisabled(false));
  }, [dispatch]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      toggleExit();
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, toggleExit]);

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

  const captureSnapshots = async (videoDuration: number) => {
    setSnapshots([]);
    removeSnapshotsFromLocalStorage();

    dispatch(setIsCapturing(true));

    if (!videoDuration || isNaN(videoDuration) || videoDuration <= 0) {
      console.error("Invalid video duration:", videoDuration);
      return;
    }

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (videoElement && canvasElement) {
      const ctx = canvasElement.getContext("2d");
      if (!ctx) {
        console.error("Unable to get 2D context for canvas");
        dispatch(setIsCapturing(false));
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
      dispatch(setIsCapturing(false));
    }
  };

  const handleLoadedMetadata = () => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const videoDuration = videoElement.duration;
      dispatch(setDuration(videoDuration));

      captureSnapshots(videoDuration).catch((err) =>
        console.error("Error capturing snapshots:", err)
      );
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      };
    }
  }, [videoSrc]);

  return (
    <div className="bg-slate-700">
      <div className="container max-w-5xl mx-auto min-h-screen px-2 pb-10 lg:px-0 relative">
        <VideoTimeline
          videoRef={videoRef}
          canvasRef={canvasRef}
          snapshots={snapshots}
          openCut={openCut}
        />

        <div className="flex justify-between items-center py-5 px-4 sm:px-6 md:px-8 lg:px-10 gap-14">
          <VideoListTimeline />
          <PlayButtons videoRef={videoRef} />
          <div className="flex ">
            <Button
              text="Clip"
              onClickHandler={toggleOpenCut}
              disabled={openCut}
            />
            <Button
              text="Exit Clip Mode"
              onClickHandler={toggleExit}
              disabled={!openCut}
              classTlw="ml-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  return {
    props: { slug },
  };
};

export default VideoCut;
