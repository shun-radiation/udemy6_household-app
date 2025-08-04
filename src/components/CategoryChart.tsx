import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';
import type {
  ExpenseCategory,
  IncomeCategory,
  Transaction,
  TransactionType,
} from '../types';

interface CategoryChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

const CategoryChart = ({
  monthlyTransactions,
  isLoading,
}: CategoryChartProps) => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const [selectedType, setSelectedType] = useState<TransactionType>('expense');

  const handleChange = (e: SelectChangeEvent<TransactionType>) => {
    // console.log(e.target.value);
    setSelectedType(e.target.value as TransactionType);
  };

  const categorySums = monthlyTransactions
    .filter((transaction) => transaction.type === selectedType)
    .reduce<Record<IncomeCategory | ExpenseCategory, number>>(
      (acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
        // {
        //   "食費":2000,
        //   "日用品":300,
        // }
      },
      {} as Record<IncomeCategory | ExpenseCategory, number>
    );
  console.log(categorySums);

  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id='type-select-label'>収支の種類</InputLabel>
        <Select
          labelId='type-select-label'
          id='type-select'
          value={selectedType}
          label='収支の種類'
          onChange={handleChange}
        >
          <MenuItem value='income'>収入</MenuItem>
          <MenuItem value='expense'>支出</MenuItem>
        </Select>
      </FormControl>

      <Pie data={data} />
    </Box>
  );
};

export default CategoryChart;
