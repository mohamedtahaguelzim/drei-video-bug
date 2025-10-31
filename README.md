# Drei `useVideoTexture` Bug Reproduction

This project demonstrates a known issue with [`@react-three/drei`'s `useVideoTexture`](https://github.com/pmndrs/drei).

---

## Description of the Bug

* `useVideoTexture` uses [`suspend-react`](https://github.com/pmndrs/suspend-react) to cache video elements.
* When switching videos (e.g., by changing a `key`), React unmounts the old component and mounts a new one.
* Due to caching, the previous video element **persists** and continues playing.
* This demonstrates that the cached video is **not fully cleaned up**, even though console logs show unmounting.

---

## How to Run

1. Clone the repository:

```bash
git clone <repo-url>
cd <repo-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

5. Open the app in a browser.
6. Use the buttons to **switch videos** and **unmute/play audio**.
7. Open the console to observe mount/unmount logs.

   * You should notice that switching videos does not **unmount the previous video**.
   * You can hear the two videos playing, and when switching back, timestamp is preserved.

I expect the video to clear after its parent component got unmounted.

---

## Project Structure

* `App.jsx` – main application file demonstrating the bug
* `public/video1.mp4` and `public/video2.mp4` – sample videos for testing

---

## References

* [`@react-three/drei`](https://github.com/pmndrs/drei)
* [`VideoTexture drei docs`](https://drei.docs.pmnd.rs/loaders/video-texture-use-video-texture)
* [`VideoTexture drei source code](https://github.com/pmndrs/drei/blob/master/src/core/VideoTexture.tsx)
* [`suspend-react`](https://github.com/pmndrs/suspend-react)
* [React Strict Mode](https://react.dev/reference/react/StrictMode)