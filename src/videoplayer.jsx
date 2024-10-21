import React, { useRef, useState, useEffect } from "react";
import { BsPlayFill, BsPauseFill, BsFullscreen, BsFullscreenExit } from "react-icons/bs";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import video  from '../src/assets/assets/video.mp4'
const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const progressValue = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progressValue);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === "0");
  };

  const toggleMute = () => {
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleVideoLoading = () => {
    setIsLoading(true);
  };

  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    video.addEventListener("waiting", handleVideoLoading);
    video.addEventListener("playing", handleVideoLoaded);

    return () => {
      video.removeEventListener("waiting", handleVideoLoading);
      video.removeEventListener("playing", handleVideoLoaded);
    };
  }, []);

  return (
    <div className="w-full mt-8 max-w-lg mx-auto bg-gray-900 p-4 rounded-lg">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="loader"></div>
            <p className="text-white">Loading...</p>
          </div>
        )}
        <video
          ref={videoRef}
          className="w-full h-64 bg-black rounded-lg"
          onTimeUpdate={handleTimeUpdate}
        >
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="flex items-center justify-between mt-2">
          {/* Play/Pause button */}
          <button
            className="text-white text-2xl"
            onClick={togglePlayPause}
          >
            {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
          </button>

          {/* Progress bar */}
          <input
            type="range"
            className="flex-grow mx-4"
            value={progress}
            onChange={handleSeek}
            max="100"
          />

          {/* Volume control */}
          <div className="flex items-center space-x-2">
            <button onClick={toggleMute} className="text-white">
              {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
            </button>
            <input
              type="range"
              className="w-20"
              value={volume}
              onChange={handleVolumeChange}
              min="0"
              max="1"
              step="0.1"
            />
          </div>

          {/* Fullscreen button */}
          <button
            className="text-white text-2xl"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <BsFullscreenExit /> : <BsFullscreen />}
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="w-full bg-gray-700 h-1 rounded-lg mt-1">
          <div
            className="bg-green-500 h-full rounded-lg"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
