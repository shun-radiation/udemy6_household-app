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
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
// import { format } from 'date-fns';
import { formatMonth } from './utils/formatting';
import type { Schema } from './validations/schema';
import { AppContextProvider } from './context/AppContext';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // console.log(currentMonth);
  // console.log(format(currentMonth, 'yyyy-MM'));

  // firestoreエラーかどうかを判定するガード
  const isFireStoreError = (
    err: unknown
  ): err is { code: string; message: string } => {
    return typeof err === 'object' && err !== null && 'code' in err;
  };

  // firestoreのデータを全て取得
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
      } finally {
        setIsLoading(false);
      }
    };
    fecheTransactions();
  }, []);

  // console.log(transactions);
  // console.log(isLoading);

  // ひと月分のデータを取得
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  // 取引を保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
    try {
      console.log(transaction);
      // firestoreにデータを保存
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, 'Transactions'), transaction);
      console.log('Document written with ID: ', docRef.id);
      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      console.log(newTransaction);
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        newTransaction,
      ]);
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

  // 削除処理
  const handleDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    try {
      // オブジェクト(複数)ならそのまま、単一ならオブジェクト化する。
      const idsToDelete = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds];
      console.log('削除対象', idsToDelete);

      for (const id of idsToDelete) {
        // firestoreのデータ削除
        await deleteDoc(doc(db, 'Transactions', id));
      }
      // リロードなしですぐに画面に反映されるために
      const filterdTransactions = transactions.filter(
        (transaction) => !idsToDelete.includes(transaction.id)
      );
      // console.log(filterdTransactions);
      setTransactions(filterdTransactions);
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

  // update処理
  const handleUpdateTransaction = async (
    transaction: Schema,
    transactionId: string
  ) => {
    try {
      // firestore更新処理
      const docRef = doc(db, 'Transactions', transactionId);
      await updateDoc(docRef, transaction);
      // フロント更新
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t
      ) as Transaction[];
      // console.log(updatedTransactions);
      setTransactions(updatedTransactions);
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

  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path='/' element={<AppLayout />}>
              <Route
                index
                element={
                  <Home
                    monthlyTransactions={monthlyTransactions}
                    setCurrentMonth={setCurrentMonth}
                    onSaveTransaction={handleSaveTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                    onUpdateTransaction={handleUpdateTransaction}
                  />
                }
              />
              <Route
                path='/report'
                element={
                  <Report
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    monthlyTransactions={monthlyTransactions}
                    isLoading={isLoading}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                }
              />
              <Route path='*' element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
