import { Grid, Paper } from '@mui/material';
import MonthSelector from '../components/MonthSelector';
import CategoryChart from '../components/CategoryChart';
import BarChart from '../components/BarChart';
import TransactionTable from '../components/TransactionTable';
import { useState } from 'react';

// interface ReportProps {
//   currentMonth: Date;
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
//   monthlyTransactions: Transaction[];
//   isLoading: boolean;
//   onDeleteTransaction: (
//     transactionIds: string | readonly string[]
//   ) => Promise<void>;
// }

const Report = () =>
  // {
  //   currentMonth,
  //   setCurrentMonth,
  //   monthlyTransactions,
  //   isLoading,
  //   onDeleteTransaction,
  // }: ReportProps
  {
    const [page, setPage] = useState(0);

    const commonPaperStyle = {
      height: '400px',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
    };
    return (
      <Grid container spacing={2}>
        <Grid size={12}>
          <MonthSelector
            // currentMonth={currentMonth}
            // setCurrentMonth={setCurrentMonth}
            setPage={setPage}
          />
        </Grid>

        {/* 円グラフ */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={commonPaperStyle}>
            <CategoryChart
            // monthlyTransactions={monthlyTransactions}
            // isLoading={isLoading}
            />
          </Paper>
        </Grid>

        {/* 棒グラフ */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={commonPaperStyle}>
            <BarChart
            // monthlyTransactions={monthlyTransactions}
            // isLoading={isLoading}
            />
          </Paper>
        </Grid>
        <Grid size={12}>
          <TransactionTable
            // monthlyTransactions={monthlyTransactions}
            page={page}
            setPage={setPage}
            // onDeleteTransaction={onDeleteTransaction}
          />
        </Grid>
      </Grid>
    );
  };

export default Report;
