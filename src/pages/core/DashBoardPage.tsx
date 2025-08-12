import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { getLogs } from "../../apis/core";
// import { LineGraph } from "../../components/graphs/LineGraph";
import { type Logs, type Log } from "../../types/Logs";

const Container = styled.div`
  max-width: 900px;
  margin: 3rem auto;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  background-color: #ffffff;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.8rem;
  color: #34495e;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.05em;
`;

const SectionWrapper = styled.div`
  width: 100%;
  background-color: #f8faff;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ErrorText = styled.div`
  font-size: 1.5rem;
  color: #e74c3c;
  font-weight: 600;
  text-align: center;
  padding: 2rem;
  background-color: #ffebee;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

const LoadingText = styled.div`
  font-size: 1.5rem;
  color: #2c3e50;
  font-weight: 500;
  text-align: center;
  padding: 2rem;
  background-color: #ecf0f1;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
`;

// const EmptyText = styled.div`
//   font-size: 1.2rem;
//   color: #6b7280;
//   text-align: center;
//   padding: 1rem 0;
// `;

export const DashBoardPage: React.FC = () => {
  const [logs, setLogs] = useState<Logs | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  

  const fetchAndNormalize = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const logs: Logs = await getLogs();
      

      setLogs(logs);
    } catch (e) {
      setError("데이터 로딩 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndNormalize();
  }, [fetchAndNormalize]);

  const series = useMemo<Log[]>(() => logs?.logs ?? [], [logs]);
  console.log("Series:", series);
  if (loading) {
    return (
      <Container>
        <LoadingText>로그를 불러오는 중...</LoadingText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorText>오류: {error}</ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <Title>거북목 탐지 서비스 대시보드 ✨</Title>

      <SectionWrapper>
        
      </SectionWrapper>
    </Container>
  );
};