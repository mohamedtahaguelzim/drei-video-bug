import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";

/**
 * Player component displays a video as a Three.js texture.
 * 
 * Props:
 * - src: path to the video file
 * - shouldPlay: boolean to control unmuted playback
 * 
 * Bug demonstration:
 * When switching videos, the previous video continues playing, even though the Player component is unmounted.
 */
function Player({ src, shouldPlay }) {
  // useVideoTexture creates a THREE.VideoTexture internally and caches
  // the <video> element using suspend-react. This caching causes the bug.
  const texture = useVideoTexture(src);
  const video = texture.image;

  // Log mount/unmount to observe behavior
  useEffect(() => {
    console.log("Mounted Player:", video?.src);

    return () => {
      console.log("Unmounting Player:", video?.src);
      // Attempting to clean up manually can cause WebGL errors:
      // video.pause(); video.src=""; video.load();
      // The real issue is that suspend-react keeps the cached video alive.
    };
  }, [video]);

  // Control playback when shouldPlay changes
  useEffect(() => {
    if (video && shouldPlay) {
      video.muted = false; // unmute
      video.play();
    }
  }, [video, shouldPlay]);

  return (
    <mesh>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/**
 * App component demonstrates the useVideoTexture bug.
 */
export default function App() {
  const [id, setId] = useState(0);           // index of current video
  const [shouldPlay, setShouldPlay] = useState(false); // controls unmuting
  const sources = ["video1.mp4", "video2.mp4"]; // two test videos

  return (
    <div>
      {/* Switch between videos */}
      <button onClick={() => setId((id + 1) % 2)}>Switch Video</button>

      {/* Unmute/play the video audio */}
      <button onClick={() => setShouldPlay(true)}>Unmute/Play</button>

      {/* Same behaviour with/without StrictMode */}
      {/*<React.StrictMode>*/}
        <Canvas>
          <Player key={id} src={sources[id]} shouldPlay={shouldPlay} />
        </Canvas>
      {/*</React.StrictMode>*/}

      <p>
        This minimal example demonstrates a bug in drei's useVideoTexture:
        when switching video, the previous video continues
        to play. Probably because suspend-react caches the video element.  
        Console logs show mounting and unmounting, but the cached video persists.
        Each video has a different beep frequency to make the bug audible.
        Also, you can see that the counter in the video (i.e timestamp) persists across switches.
      </p>
    </div>
  );
}
