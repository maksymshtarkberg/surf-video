"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";

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
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    authorize()
      .then(() => setAuthorized(true))
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!authorized) {
    return <div>authenticating...</div>;
  }

  const AppContainer = styled.div`
    width: 100%;
    height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  return (
    <div className="w-full h-[90vh] flex flex-col items-center">
      {authorized ? (
        <Player
          hostname="195.60.68.14:12025"
          initialFormat="RTP_H264"
          autoPlay
          autoRetry
          vapixParams={{ resolution: "800x600" }}
        />
      ) : (
        <div>Failed to load video</div>
      )}
    </div>
  );
};

export default VideoPlayer;
