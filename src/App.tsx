import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { type Transaction } from './types/index';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
// import { format } from 'date-fns';
import { formatMonth } from './utils/formatting';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // console.log(currentMonth);
  // console.log(format(currentMonth, 'yyyy-MM'));

  // firestoreエラーかどうかを判定するガード
  const isFireStoreError = (
    err: unknown
  ): err is { code: string; message: string } => {
    return typeof err === 'object' && err !== null && 'code' in err;
  };

  useEffect(() => {
    const fecheTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Transactions'));
        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction;
        });
        // console.log(transactionsData);
        setTransactions(transactionsData);
      } catch (err) {
        // error
        if (isFireStoreError(err)) {
          console.error('firebaseのエラーは', err);
          console.error('firebaseのエラーメッセージは', err.message);
          console.error('firebaseのエラーコードは', err.code);
        } else {
          console.error('一般的なエラーは', err);
        }
      }
    };
    fecheTransactions();
  }, []);

  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  console.log(monthlyTransactions);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route
              index
              element={<Home monthlyTransactions={monthlyTransactions} />}
            />
            <Route path='/report' element={<Report />} />
            <Route path='*' element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
