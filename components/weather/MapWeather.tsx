import React, { useRef, useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

const MapWeather = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const tokyo = { lng: 139.753, lat: 35.6844 };
  const zoom = 14;
  maptilersdk.config.apiKey = process.env
    .NEXT_PUBLIC_MAPTILER_API_KEY_HERE as string;

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.SATELLITE,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom,
      navigationControl: false,
      geolocateControl: false,
      scaleControl: false,
      fullscreenControl: false,
      terrainControl: false,
      maptilerLogo: false,
      dragPan: false,
      scrollZoom: false,
      doubleClickZoom: false,
      touchPitch: false,
      keyboard: false,
      dragRotate: false,
      touchZoomRotate: false,
    });
  }, [tokyo.lng, tokyo.lat, zoom]);
  return (
    <div className="relative w-[200px] h-[120px]">
      <div
        ref={mapContainer}
        className="ablosute w-full h-full cursor-pointer rounded-lg"
      />
    </div>
  );
};

export default MapWeather;
