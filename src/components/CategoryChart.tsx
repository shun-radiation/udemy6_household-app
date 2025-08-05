import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
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

  const theme = useTheme();
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');

  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };

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

  const categoryLabels = Object.keys(categorySums) as (
    | IncomeCategory
    | ExpenseCategory
  )[];
  const categoryValues = Object.values(categorySums);
  console.log(categoryLabels);
  console.log(categoryValues);

  const incomeCategoryColor: Record<IncomeCategory, string> = {
    給与: theme.palette.incomeCategoryColor.給与,
    副収入: theme.palette.incomeCategoryColor.副収入,
    お小遣い: theme.palette.incomeCategoryColor.お小遣い,
  };

  const expenseCategoryColor: Record<ExpenseCategory, string> = {
    食費: theme.palette.expenseCategoryColor.食費,
    日用品: theme.palette.expenseCategoryColor.日用品,
    住居費: theme.palette.expenseCategoryColor.住居費,
    交際費: theme.palette.expenseCategoryColor.交際費,
    娯楽: theme.palette.expenseCategoryColor.娯楽,
    交通費: theme.palette.expenseCategoryColor.交通費,
  };

  const getCategoryColor = (
    category: IncomeCategory | ExpenseCategory
  ): string => {
    if (selectedType === 'income') {
      return incomeCategoryColor[category as IncomeCategory];
    } else {
      return expenseCategoryColor[category as ExpenseCategory];
    }
  };

  const data: ChartData<'pie'> = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryLabels.map((category) => {
          return getCategoryColor(category);
        }),
        borderColor: categoryLabels.map((category) => {
          return getCategoryColor(category);
        }),
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
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
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : monthlyTransactions.length > 0 ? (
          <Pie options={options} data={data} />
        ) : (
          <Typography>データがありません</Typography>
        )}
      </Box>
    </>
  );
};

export default CategoryChart;
