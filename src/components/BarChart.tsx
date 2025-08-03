import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { Transaction } from '../types';
import { calculationDailyBalances } from '../utils/financeCalculation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  monthlyTransactions: Transaction[];
}

const BarChart = ({ monthlyTransactions }: BarChartProps) => {
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '日別収支',
      },
    },
  };

  const dailyBalances = calculationDailyBalances(monthlyTransactions);
  console.log(dailyBalances);
  console.log(monthlyTransactions);

  const dateLabels = Object.keys(dailyBalances);
  console.log(dateLabels);

  const expenseData = dateLabels.map((day) => dailyBalances[day].expense);
  console.log(expenseData);
  const incomeData = dateLabels.map((day) => dailyBalances[day].income);
  console.log(incomeData);

  const labels = [
    '2025-08-01',
    '2025-08-02',
    '2025-08-03',
    '2025-08-04',
    '2025-08-05',
    '2025-08-06',
  ];

  const data = {
    labels,
    datasets: [
      {
        label: '支出',
        data: [100, 200, 300, 400, 500, 600],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '収入',
        data: [600, 500, 400, 300, 200, 100],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default BarChart;
