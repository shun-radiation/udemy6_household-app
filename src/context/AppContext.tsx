import { createContext, useContext, useState } from 'react';
import type { Transaction } from '../types';
import { useMediaQuery, useTheme } from '@mui/material';
import type { Schema } from '../validations/schema';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { isFireStoreError } from '../utils/errorHandling';

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (
    transactionIds: string | readonly string[]
  ) => Promise<void>;
  onUpdateTransaction: (
    transaction: Schema,
    transactionId: string
  ) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // 取引を保存する処理
  const onSaveTransaction = async (transaction: Schema) => {
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
  const onDeleteTransaction = async (
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

  // 変更処理
  const onUpdateTransaction = async (
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
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth,
        isLoading,
        setIsLoading,
        isMobile,
        onSaveTransaction,
        onDeleteTransaction,
        onUpdateTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    // contextがundefindの場合の処理
    throw new Error(
      'グローバルなデータは、プロバイダーの中で取得してください。'
    );
  }
  return context;
};
