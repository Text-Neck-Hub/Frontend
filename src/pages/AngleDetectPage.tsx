import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Video = styled.video`
  width: 320px;
  height: 240px;
  background: #222;
  border-radius: 1rem;
`;

const Canvas = styled.canvas`
  width: 320px;
  height: 240px;
  border-radius: 1rem;
  margin-top: 1rem;
`;

export const AngleDetectPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let stream: MediaStream | null = null;
    let interval: number;
    let lastImg: HTMLImageElement | null = null;

    const setup = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      ws = new WebSocket('ws://localhost:8000/ws');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.has_angle && canvasRef.current) {
          lastImg = new window.Image();
          lastImg.onload = function() {
            const ctx = canvasRef.current!.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, 320, 240);
              ctx.drawImage(lastImg!, 0, 0, 320, 240);
            }
          };
          lastImg.src = 'data:image/jpeg;base64,' + data.img;
        }
      };
      interval = window.setInterval(() => {
        if (!videoRef.current || !canvasRef.current || !ws || ws.readyState !== 1) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        const dataURL = canvasRef.current.toDataURL('image/jpeg');
        const base64 = dataURL.split(',')[1];
        ws.send(base64);
      }, 100);
    };
    setup();
    return () => {
      if (interval) window.clearInterval(interval);
      if (ws) ws.close();
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <Container>
      <h1>WebSocket Image Stream with MediaPipe</h1>
      <Video ref={videoRef} autoPlay />
      <Canvas ref={canvasRef} width={320} height={240} />
    </Container>
  );
};
