import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { type Transaction } from '../types/index';
import { financeCalculations } from '../utils/financeCalculation';
import { ExpandTwoTone } from '@mui/icons-material';

interface MonthlySummaryProps {
  monthlyTransactions: Transaction[];
}
const MonthlySummary = ({ monthlyTransactions }: MonthlySummaryProps) => {
  // console.log(monthlyTransactions);
  // const monthlyTotals = financeCalculations(monthlyTransactions);
  // console.log(monthlyTotals);
  const { income, expense, balance } = financeCalculations(monthlyTransactions);

  return (
    <Grid container spacing={{ xs: 1, sm: 2 }} mb={2}>
      {/* 収入 */}
      <Grid size={4} display={'flex'} flexDirection={'column'}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.incomeColor.main,
            color: 'white',
            borderRadius: '10px',
            flexGrow: '1',
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={'row'}>
              <ArrowUpwardIcon sx={{ fontSize: '2rem' }} />
              <Typography>収入</Typography>
            </Stack>
            <Typography
              textAlign={'right'}
              variant='h5'
              fontWeight={'fontWeightBold'}
              sx={{
                wordBreak: 'break-word',
                fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' },
              }}
            >
              {/* $300 */}¥ {income}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 支出 */}
      <Grid size={4} display={'flex'} flexDirection={'column'}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.expenseColor.main,
            color: 'white',
            borderRadius: '10px',
            flexGrow: '1',
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={'row'}>
              <ArrowDownwardIcon sx={{ fontSize: '2rem' }} />
              <Typography>支出</Typography>
            </Stack>
            <Typography
              textAlign={'right'}
              variant='h5'
              fontWeight={'fontWeightBold'}
              sx={{
                wordBreak: 'break-word',
                fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' },
              }}
            >
              {/* $30000000000000009090909090909909909090909 */}
              {/* $300 */}¥ {expense}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 残高 */}
      <Grid size={4} display={'flex'} flexDirection={'column'}>
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.balanceColor.main,
            color: 'white',
            borderRadius: '10px',
            flexGrow: '1',
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction={'row'}>
              <AccountBalanceIcon sx={{ fontSize: '2rem' }} />
              <Typography>残高</Typography>
            </Stack>
            <Typography
              textAlign={'right'}
              variant='h5'
              fontWeight={'fontWeightBold'}
              sx={{
                wordBreak: 'break-word',
                fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' },
              }}
            >
              {/* $300 */}¥ {balance}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default MonthlySummary;
