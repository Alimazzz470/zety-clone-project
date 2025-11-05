"use client";

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ScoreChartProps {
  score: number;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ score }) => {
  const data = {
    labels: ['Match', 'Mismatch'],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default ScoreChart;
