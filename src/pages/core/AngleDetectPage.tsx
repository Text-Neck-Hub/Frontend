import React, { useEffect, useRef, useState } from 'react';
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

const AngleDisplay = styled.div<{ $isGoodPosture: boolean }>`
  margin-top: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => (props.$isGoodPosture ? 'green' : 'red')};
`;

export const AngleDetectPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState<number | null>(null);

  useEffect(() => {
    let wss: WebSocket | null = null;
    let stream: MediaStream | null = null;
    let interval: number;
    let lastImg: HTMLImageElement | null = null;

    const setup = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        wss = new WebSocket('wss://api.textneckhub.p-e.kr/core/v1/ws/textneck/'); 

        wss.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.has_angle && canvasRef.current) {
            setAngle(data.angle_value);
            lastImg = new window.Image();
            lastImg.onload = function() {
              const ctx = canvasRef.current!.getContext('2d');
              if (ctx) {
                ctx.clearRect(0, 0, 320, 240);
                ctx.drawImage(lastImg!, 0, 0, 320, 240);
              }
            };
            lastImg.src = 'data:image/jpeg;base64,' + data.img;
          } else {
            setAngle(null);
          }
        };

        wss.onopen = () => {
          console.log('WebSocket connected');
        };

        wss.onclose = () => {
          console.log('WebSocket disconnected');
          setAngle(null);
        };

        wss.onerror = (error) => {
          console.error('WebSocket error:', error);
          setAngle(null);
        };

        interval = window.setInterval(() => {
          if (!videoRef.current || !canvasRef.current || !wss || wss.readyState !== WebSocket.OPEN) return;
          
          const tempCanvas = document.createElement('canvas');
          const tempContext = tempCanvas.getContext('2d');
          tempCanvas.width = videoRef.current.videoWidth;
          tempCanvas.height = videoRef.current.videoHeight;
          tempContext?.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
          
          const dataURL = tempCanvas.toDataURL('image/jpeg', 0.8);
          const base64 = dataURL.split(',')[1];
          wss.send(base64);
        }, 100);

      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    setup();

    return () => {
      if (interval) window.clearInterval(interval);
      if (wss) wss.close();
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <Container>
      <h1>거북목 탐지! 실시간 각도 측정</h1>
      <Video ref={videoRef} autoPlay />
      <Canvas ref={canvasRef} width={320} height={240} />
      {angle !== null && (
        <AngleDisplay $isGoodPosture={angle >= 160}>
          각도: {angle.toFixed(1)}°
        </AngleDisplay>
      )}
      {angle === null && (
        <AngleDisplay $isGoodPosture={true}>
          각도: 감지 중...
        </AngleDisplay>
      )}
    </Container>
  );
};