import { format } from 'date-fns';

export const formatMonth = (date: Date) => {
  return format(date, 'yyyy-MM');
};

// 日本円に変換する関数
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ja-JP');
};
