import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import type { Transaction } from '../types';
import { financeCalculations } from '../utils/financeCalculation';

interface DailySummaryProps {
  dailyTransactions: Transaction[];
  colums: number;
}
const DailySummary = ({ dailyTransactions, colums }: DailySummaryProps) => {
  const { income, expense, balance } = financeCalculations(dailyTransactions);

  const isThreeColumsLayout = colums === 3;
  return (
    <Box>
      <Grid container spacing={2}>
        {/* 収入 */}
        <Grid size={isThreeColumsLayout ? 4 : 6} display={'flex'}>
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant='body2' noWrap textAlign='center'>
                収入
              </Typography>
              <Typography
                textAlign='right'
                fontWeight='fontWeightBold'
                sx={{
                  wordBreak: 'break-all',
                  color: (theme) => theme.palette.incomeColor.main,
                }}
              >
                ¥ {income}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* 支出 */}
        <Grid size={isThreeColumsLayout ? 4 : 6} display={'flex'}>
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant='body2' noWrap textAlign='center'>
                支出
              </Typography>
              <Typography
                textAlign='right'
                fontWeight='fontWeightBold'
                sx={{
                  wordBreak: 'break-all',
                  color: (theme) => theme.palette.expenseColor.main,
                }}
              >
                ¥ {expense}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* 残高 */}
        <Grid size={isThreeColumsLayout ? 4 : 12} display={'flex'}>
          <Card
            sx={{ bgcolor: (theme) => theme.palette.grey[100], flexGrow: 1 }}
          >
            <CardContent>
              <Typography variant='body2' noWrap textAlign='center'>
                残高
              </Typography>
              <Typography
                textAlign='right'
                fontWeight='fontWeightBold'
                sx={{
                  wordBreak: 'break-all',
                  color: (theme) => theme.palette.balanceColor.main,
                }}
              >
                ¥ {balance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default DailySummary;
