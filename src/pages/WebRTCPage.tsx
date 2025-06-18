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

const VideoRow = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const Video = styled.video`
  width: 200px;
  height: 150px;
  background: #222;
  border-radius: 1rem;
`;

const ChatBox = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: 1rem;
`;

const MessageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
  max-height: 120px;
  overflow-y: auto;
  background: #f7f7f7;
  border-radius: 0.5rem;
`;

const MessageItem = styled.li`
  padding: 0.3rem 0.7rem;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
`;

export const WebRTCPage: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [msgInput, setMsgInput] = useState('');
  const [isCaller, setIsCaller] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://' + window.location.hostname + ':8000/ws');
    wsRef.current = ws;
    ws.onmessage = async (event) => {
      let msg = JSON.parse(event.data);
      if (msg.type === 'chat') {
        setMessages((prev) => [...prev, msg.data]);
      } else if (msg.type === 'offer') {
        await start(false);
        await pcRef.current!.setRemoteDescription(new RTCSessionDescription(msg.data));
        const answer = await pcRef.current!.createAnswer();
        await pcRef.current!.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: 'answer', data: answer }));
      } else if (msg.type === 'answer') {
        await pcRef.current!.setRemoteDescription(new RTCSessionDescription(msg.data));
      } else if (msg.type === 'candidate') {
        if (pcRef.current) {
          try {
            await pcRef.current.addIceCandidate(msg.data);
          } catch (e) {}
        }
      }
    };
    ws.onopen = () => {
      setTimeout(() => {
        if (!pcRef.current) {
          setIsCaller(true);
          start(true);
        }
      }, 1000);
    };
    return () => {
      ws.close();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
    // eslint-disable-next-line
  }, []);

  async function start(caller: boolean) {
    if (pcRef.current) return;
    localStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // TURN 서버는 실제 환경에 맞게 추가
      ],
    });
    localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current!));
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: 'candidate', data: event.candidate }));
      }
    };
    pcRef.current = pc;
    if (caller) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      wsRef.current!.send(JSON.stringify({ type: 'offer', data: offer }));
    }
  }

  const sendMsg = () => {
    if (wsRef.current && msgInput.trim()) {
      wsRef.current.send(JSON.stringify({ type: 'chat', data: msgInput }));
      setMsgInput('');
    }
  };

  return (
    <Container>
      <h1>Discod Clone (WebRTC 화상 & 채팅)</h1>
      <VideoRow>
        <Video ref={localVideoRef} autoPlay muted playsInline />
        <Video ref={remoteVideoRef} autoPlay playsInline />
      </VideoRow>
      <ChatBox>
        <input
          value={msgInput}
          onChange={e => setMsgInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
          placeholder="메시지 입력..."
          style={{ width: '70%' }}
        />
        <button onClick={sendMsg}>Send</button>
        <MessageList>
          {messages.map((msg, i) => (
            <MessageItem key={i}>{msg}</MessageItem>
          ))}
        </MessageList>
      </ChatBox>
    </Container>
  );
};
