import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { type MySetting } from "../../types/UserSetting";
import { getUserSetting } from "../../apis/core";
import { LineGraph } from "../../components/graphs/LineGraph";
import { AngleOption } from "../../components/options/AngleOption";

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

const MessageText = styled.p`
  font-size: 1.3rem;
  color: #555;
  margin-top: 1.5rem;
  font-weight: 500;
  background-color: #e6f7ff;
  padding: 1rem 1.5rem;
  border-radius: 8px;
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

export const DashBoardPage: React.FC = () => {
  const [setting, setSetting] = useState<MySetting | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const response: MySetting = await getUserSetting();
        setSetting(response);
      } catch (err) {
        console.error("사용자 설정을 불러오는데 실패했어요! 😢", err);
        setError(
          "데이터 로딩 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
    };

    fetchSetting();
  }, []);

  if (error) {
    return (
      <Container>
        <ErrorText>오류: {error}</ErrorText>
      </Container>
    );
  }

  if (!setting) {
    return (
      <Container>
        <LoadingText>설정 정보를 불러오는 중...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Title>거북목 탐지 서비스 대시보드 ✨</Title>

      <SectionWrapper>
        <LineGraph angles={setting.settings.logs} />
      </SectionWrapper>

      <SectionWrapper>
        <AngleOption option={{ options: setting.settings.options }} />
      </SectionWrapper>

      <MessageText>메시지: {setting.message}</MessageText>
    </Container>
  );
};
