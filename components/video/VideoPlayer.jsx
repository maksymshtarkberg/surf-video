"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Player = dynamic(
  () => import("media-stream-player").then((mod) => mod.Player),
  {
    ssr: false,
  }
);

const authorize = async () => {
  try {
    await window.fetch("/axis-cgi/usergroup.cgi", {
      credentials: "include",
      mode: "no-cors",
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 * Example application that uses the `BasicPlayer` component.
 */

const VideoPlayer = () => {
  // const [authorized, setAuthorized] = useState(false);

  // useEffect(() => {
  //   authorize()
  //     .then(() => setAuthorized(true))
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);

  // if (!authorized) {
  //   return <div>authenticating...</div>;
  // }

  return (
    <div className="w-full h-[90vh] flex flex-col items-center">
      {/* {authorized ? (
        <Player
          hostname="195.60.68.14:12025"
          initialFormat="RTP_H264"
          autoPlay
          autoRetry
          vapixParams={{ resolution: "800x600" }}
        />
      ) : (
        <div>Failed to load video</div>
      )} */}
      <video
        // ref={videoRef}
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        controls
        // onTimeUpdate={handleTimeUpdate}
        // onLoadedMetadata={handleLoadedMetadata}
        style={{ width: "100%", height: "auto" }}
      ></video>
    </div>
  );
};

export default VideoPlayer;
