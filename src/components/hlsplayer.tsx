import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!Hls.isSupported()) {
      console.error("HLS.js is not supported in this browser.");
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) {
      console.error("Video element is not available.");
      return;
    }


    // Configure HLS.js for low latency
    const hlsInstance = new Hls();
    hlsInstance.attachMedia(videoElement);

    hlsInstance.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log("HLS Media Attached. Loading source: ", src);
      hlsInstance.loadSource(src);
      videoElement.muted = true;
      videoElement.play().catch((error) => {
        console.error('Error attempting to play', error);
      });

    });



    return () => {
      console.log("Destroying HLS instance.");
      hlsInstance.destroy();
    };
  }, [src]); // Dependency array includes src

  return <video className='w-full' ref={videoRef} controls />;
};

export default VideoPlayer;
