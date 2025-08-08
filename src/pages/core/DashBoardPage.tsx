import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { type MySetting } from '../../types/UserSetting';
import { getUserSetting } from '../../apis/core';
import { LineGraph } from '../../components/graphs/LineGraph';

const Container = styled.div`
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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
        setError("데이터 로딩 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."); 
      }
    };

    fetchSetting();
  }, []);

  if (error) { 
    return <Container>오류: {error}</Container>;
  }

  if (!setting) {
    return <Container>설정 정보를 불러오는 중...</Container>;
  }

  return (
    <Container>
      <h1>거북목 탐지 서비스 대시보드</h1>
      
      
      <LineGraph angles={setting.settings.logs} /> 
      <p>메시지: {setting.message}</p>
    </Container>
  );
};