import React, { useState, useEffect, useMemo } from "react";
// Line 컴포넌트를 다시 가져와야지!
import { Line } from "react-chartjs-2"; // 👈 여기!

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // 👈 chart.js 요소들도 다시 임포트!

import { type AngleList, type Angle } from "../../types/UserSetting";

// ChartJS에 필요한 요소들을 다시 등록해야 그래프가 잘 그려져!
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LineGraph: React.FC<AngleList> = ({ angles }) => {
  const [logs, setLogs] = useState<Angle[]>(angles);

  useEffect(() => {
    setLogs(angles);
  }, [angles]);

  const chartData = useMemo(() => {
    if (!logs || logs.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "각도 변화",
            data: [],
            borderColor: [],
            backgroundColor: [],
            pointBackgroundColor: [],
            pointBorderColor: [],
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      };
    }

    const labels: string[] = [];
    const data: number[] = [];
    const pointBackgroundColors: string[] = [];
    const borderColors: string[] = [];

    logs.forEach((log, index) => {
      labels.push(
        log.loged_at
          ? new Date(log.loged_at).toLocaleString()
          : `데이터 ${index}`
      );
      data.push(log.angle);

      let color = "";
      switch (log.result) {
        case 0:
          color = "rgba(75, 192, 192, 1)";
          break;
        case 1:
          color = "rgba(255, 206, 86, 1)";
          break;
        case 2:
          color = "rgba(255, 99, 132, 1)";
          break;
        default:
          color = "rgba(153, 102, 255, 1)";
          break;
      }
      pointBackgroundColors.push(color);
      borderColors.push(color);
    });

    return {
      labels: labels,
      datasets: [
        {
          label: "각도 변화 추이",
          data: data,
          // 마지막 포인트의 색상으로 라인 색상을 설정!
          borderColor:
            borderColors.length > 0
              ? borderColors[borderColors.length - 1]
              : "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)", // 영역 채우는 색
          pointBackgroundColor: pointBackgroundColors,
          pointBorderColor: pointBackgroundColors,
          pointRadius: 5,
          pointHoverRadius: 8,
          borderWidth: 2,
          tension: 0.4,
          fill: false, // 라인 아래를 채울지 여부 (지금은 안 채움)
        },
      ],
    };
  }, [logs]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Result 값에 따른 각도 변화 시계열 그래프",
      },
      tooltip: {
        callbacks: {
          title: function (context: any) {
            return `시간: ${context[0].label}`;
          },
          label: function (context: any) {
            const index = context.dataIndex;
            const angleLog = logs[index];
            let resultText = "";
            switch (angleLog.result) {
              case 0:
                resultText = "정상";
                break;
              case 1:
                resultText = "주의";
                break;
              case 2:
                resultText = "경고";
                break;
              default:
                resultText = "알 수 없음";
                break;
            }
            return `각도: ${angleLog.angle}° | 상태: ${resultText} (result: ${angleLog.result})`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "시간",
        },
      },
      y: {
        title: {
          display: true,
          text: "각도 (°)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      {/* 다시 Chart 컴포넌트를 사용해서 그래프를 그릴 거야! */}
      <Line options={chartOptions} data={chartData} />
    </div>
  );
};
