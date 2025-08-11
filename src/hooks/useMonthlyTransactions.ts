import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Transaction } from '../types';
import { formatMonth } from '../utils/formatting';

const useMonthlyTransactions = (): Transaction[] => {
  const { transactions, currentMonth } = useAppContext();

  // ひと月分のデータを取得
  const monthlyTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.date.startsWith(formatMonth(currentMonth))
    );
  }, [transactions, currentMonth]);

  return monthlyTransactions;
};

export default useMonthlyTransactions;
