import { Box } from '@mui/material';
import MonthlySummary from '../components/MonthlySummary';
import Calendar from '../components/Calendar';
import TransactionMenu from '../components/TransactionMenu';
import TransactionForm from '../components/TransactionForm';
import { type Transaction } from '../types/index';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { DateClickArg } from '@fullcalendar/interaction/index.js';
import { useAppContext } from '../context/AppContext';
import useMonthlyTransactions from '../hooks/useMonthlyTransactions';

// interface HomeProps {
//   monthlyTransactions: Transaction[];
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
//   onSaveTransaction: (transaction: Schema) => Promise<void>;
//   onDeleteTransaction: (transactionId: string) => Promise<void>;
//   onUpdateTransaction: (
//     transaction: Schema,
//     transactionId: string
//   ) => Promise<void>;
// }

const Home = () =>
  //   {
  //   monthlyTransactions,
  //   setCurrentMonth,
  //   onSaveTransaction,
  //   onDeleteTransaction,
  //   onUpdateTransaction,
  // }: HomeProps
  {
    const { isMobile } = useAppContext();
    const monthlyTransactions = useMonthlyTransactions();

    const today = format(new Date(), 'yyyy-MM-dd');
    // console.log(today);
    const [currentDay, setCurrentDay] = useState(today);
    const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] =
      useState<Transaction | null>(null);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // // ブレイクポイントの設定
    // const theme = useTheme();
    // const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // 1200px(lg)以下かどうかboolean
    // console.log('isMobile', isMobile);

    // 一日分のデータを取得
    const dailyTransactions = useMemo(() => {
      return monthlyTransactions.filter(
        (transaction) => transaction.date === currentDay
      );
    }, [monthlyTransactions, currentDay]);
    // console.log(dailyTransactions);

    // フォームclose処理
    const onCloseForm = () => {
      setSelectedTransaction(null);
      if (isMobile) {
        setIsDialogOpen((prev) => !prev);
      } else {
        setIsEntryDrawerOpen((prev) => !prev);
      }
    };
    // フォームopen処理(「内訳を追加」ボタン)
    const handleAddTransactionForm = () => {
      if (isMobile) {
        setIsDialogOpen(true);
      } else {
        if (selectedTransaction) {
          setSelectedTransaction(null);
        } else {
          setIsEntryDrawerOpen((prev) => !prev);
        }
      }
    };

    // 取引が選択された時の処理
    const handleSelectTransaction = (transaction: Transaction) => {
      if (isMobile) {
        setIsDialogOpen(true);
      } else {
        setIsEntryDrawerOpen(true);
      }
      setSelectedTransaction(transaction);
      console.log(transaction);
    };

    // モバイル用Drawerをcloseするための処理
    const handleCloseMobileDrawer = () => {
      setIsMobileDrawerOpen(false);
    };

    // 日付を選択した時の処理
    const handleDateClick = (dateInfo: DateClickArg) => {
      // console.log(dateInfo);
      setCurrentDay(dateInfo.dateStr);
      setIsMobileDrawerOpen(true);
    };

    return (
      <Box sx={{ display: 'flex' }}>
        {/* 左側コンテンツ */}
        <Box sx={{ flexGrow: 1, bgcolor: 'pink' }}>
          <MonthlySummary
          // monthlyTransactions={monthlyTransactions}
          />
          <Calendar
            // monthlyTransactions={monthlyTransactions}
            // setCurrentMonth={setCurrentMonth}
            currentDay={currentDay}
            setCurrentDay={setCurrentDay}
            today={today}
            onDateClick={handleDateClick}
          />
        </Box>

        {/* 右側コンテンツ */}
        <Box>
          <TransactionMenu
            dailyTransactions={dailyTransactions}
            currentDay={currentDay}
            handleAddTransactionForm={handleAddTransactionForm}
            onSelectTransaction={handleSelectTransaction}
            // isMobile={isMobile}
            isMobileDrawerOpen={isMobileDrawerOpen}
            handleCloseMobileDrawer={handleCloseMobileDrawer}
          />
          <TransactionForm
            onCloseForm={onCloseForm}
            isEntryDrawerOpen={isEntryDrawerOpen}
            currentDay={currentDay}
            // onSaveTransaction={onSaveTransaction}
            // onDeleteTransaction={onDeleteTransaction}
            // onUpdateTransaction={onUpdateTransaction}
            selectedTransaction={selectedTransaction}
            setSelectedTransaction={setSelectedTransaction}
            // isMobile={isMobile}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </Box>
      </Box>
    );
  };

export default Home;
