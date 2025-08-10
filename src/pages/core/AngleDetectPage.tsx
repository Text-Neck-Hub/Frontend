import React, { useEffect, useRef, useState, useCallback } from "react";
import { refreshAccessToken } from "../../apis/auth";
import styled from "styled-components";

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
  display: none;
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
  color: ${(props) => (props.$isGoodPosture ? "green" : "red")};
`;




export const AngleDetectPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const reconnectingRef = useRef<boolean>(false);

  const [angle, setAngle] = useState<number | null>(null);
  const [paused, setPaused] = useState<boolean>(true);
  const [wsReady, setWsReady] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("연결 준비 중");

  const [angleThreshold, setAngleThreshold] = useState<number>(100);
  const [shoulderYDiffThreshold, setShoulderYDiffThreshold] = useState<number>(12);
  const [shoulderYAvgThreshold, setShoulderYAvgThreshold] = useState<number>(220);

  const goodPostureThreshold = angleThreshold;
  const WS_URL = "wss://api.textneckhub.p-e.kr/core/v1/ws/textneck/";

  const sendInit = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const initMsg = JSON.stringify({
        action: "init",
        angle_threshold: angleThreshold,
        shoulder_y_diff_threshold: shoulderYDiffThreshold,
        shoulder_y_avg_threshold: shoulderYAvgThreshold,
      });
      wsRef.current.send(initMsg);
    }
  }, [angleThreshold, shoulderYAvgThreshold, shoulderYDiffThreshold]);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setWsReady(false);
    setPaused(true);
    setAngle(null);
  }, []);

  const connectAndInit = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      const token = localStorage.getItem("accessToken") || "";
      const url = `${WS_URL}?token=${encodeURIComponent(token)}`;
      const wss = new WebSocket(url);
      wsRef.current = wss;

      wss.onopen = () => {
        setWsReady(true);
        setStatusText("연결됨: 초기화 전송");
        sendInit();
      };

      wss.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (typeof data.status === "string") {
            if (data.status === "initialized") {
              setPaused(true);
              setStatusText("초기화 완료(일시중지)");
            } else if (data.status === "paused") {
              setPaused(true);
              setStatusText("일시중지");
            } else if (data.status === "resumed") {
              setPaused(false);
              setStatusText("실행 중");
            } else if (data.status === "stopping") {
              setStatusText("종료 중");
            }
            return;
          }

          const hasAngle =
            data.has_angle ||
            typeof data.angle_value === "number" ||
            typeof data.neck_angle_deg === "number";

          if (hasAngle && canvasRef.current) {
            const val =
              typeof data.angle_value === "number"
                ? data.angle_value
                : typeof data.neck_angle_deg === "number"
                ? data.neck_angle_deg
                : null;
            if (val !== null) setAngle(val);

            if (data.img) {
              const img = new Image();
              img.onload = () => {
                const ctx = canvasRef.current!.getContext("2d");
                if (ctx) {
                  ctx.clearRect(0, 0, 320, 240);
                  ctx.drawImage(img, 0, 0, 320, 240);
                }
              };
              img.src = "data:image/jpeg;base64," + data.img;
            }
          } else {
            setAngle(null);
          }
        } catch {
          setAngle(null);
        }
      };

      wss.onclose = async () => {
        setWsReady(false);
        setPaused(true);
        setAngle(null);
        setStatusText("연결 끊김");
        if (!reconnectingRef.current) {
          reconnectingRef.current = true;
          try {
            const refreshed = await refreshAccessToken();
            const newAccessToken = (refreshed as any)?.access;
            if (newAccessToken) {
              localStorage.setItem("accessToken", newAccessToken);
              setStatusText("토큰 갱신 후 재연결 중");
              await new Promise((r) => setTimeout(r, 300));
              reconnectingRef.current = false;
              connectAndInit();
            } else {
              reconnectingRef.current = false;
            }
          } catch {
            reconnectingRef.current = false;
          }
        }
      };

      wss.onerror = () => {
        setWsReady(false);
        setPaused(true);
        setAngle(null);
        setStatusText("오류 발생");
      };
    } catch {
      setStatusText("웹캠 접근 실패");
    }
  }, [WS_URL, sendInit]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "https://audio-previews.elements.envatousercontent.com/files/286545509/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22MV27TES-alarm.mp3%22"
      );
      audioRef.current.loop = true;
      audioRef.current.volume = 0.6;
    }
  }, []);

  useEffect(() => {
    if (angle !== null) {
      if (angle > goodPostureThreshold) {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().catch(() => {});
        }
      } else {
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    } else {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [angle, goodPostureThreshold]);

  useEffect(() => {
    connectAndInit();
    return () => {
      cleanup();
    };
  }, [connectAndInit, cleanup]);

  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!wsReady || paused) return;

    intervalRef.current = window.setInterval(() => {
      if (
        !videoRef.current ||
        !wsRef.current ||
        wsRef.current.readyState !== WebSocket.OPEN ||
        paused
      )
        return;

      const tempCanvas = document.createElement("canvas");
      const tempContext = tempCanvas.getContext("2d");
      tempCanvas.width = videoRef.current.videoWidth || 320;
      tempCanvas.height = videoRef.current.videoHeight || 240;
      tempContext?.drawImage(
        videoRef.current,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );

      const dataURL = tempCanvas.toDataURL("image/jpeg", 0.8);
      const base64 = dataURL.split(",")[1];
      wsRef.current.send(base64);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [wsReady, paused]);

  const onClickResume = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send("resume");
    }
  }, []);

  const onClickPause = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send("pause");
    }
  }, []);

  const onClickStop = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send("stop");
      } catch {}
      try {
        wsRef.current.close();
      } catch {}
    }
    cleanup();
    setStatusText("종료됨");
  }, [cleanup]);

  const onClickApplyInit = useCallback(() => {
    sendInit();
  }, [sendInit]);

  return (
    <Container>
      <h1>거북목 탐지! 실시간 각도 측정</h1>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <span>{statusText}</span>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: wsReady ? "#3ddc84" : "#aaa" }} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={onClickResume} disabled={!wsReady || !paused}>시작/재개</button>
        <button onClick={onClickPause} disabled={!wsReady || paused}>일시중지</button>
        <button onClick={onClickStop} disabled={!wsReady}>종료</button>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <label>
          각도 임계치
          <input
            type="number"
            value={angleThreshold}
            onChange={(e) => setAngleThreshold(Number(e.target.value))}
            style={{ width: 80, marginLeft: 6 }}
          />
        </label>
        <label>
          어깨 Y차 임계치
          <input
            type="number"
            value={shoulderYDiffThreshold}
            onChange={(e) => setShoulderYDiffThreshold(Number(e.target.value))}
            style={{ width: 80, marginLeft: 6 }}
          />
        </label>
        <label>
          어깨 Y평균 임계치
          <input
            type="number"
            value={shoulderYAvgThreshold}
            onChange={(e) => setShoulderYAvgThreshold(Number(e.target.value))}
            style={{ width: 80, marginLeft: 6 }}
          />
        </label>
        <button onClick={onClickApplyInit} disabled={!wsReady}>설정 적용</button>
      </div>

      <Video ref={videoRef} autoPlay />
      <Canvas ref={canvasRef} width={320} height={240} />

      {angle !== null && (
        <AngleDisplay $isGoodPosture={angle <= goodPostureThreshold}>
          각도: {angle.toFixed(1)}°
        </AngleDisplay>
      )}
      {angle === null && (
        <AngleDisplay $isGoodPosture={true}>각도: 감지 중...</AngleDisplay>
      )}
    </Container>
  );
};