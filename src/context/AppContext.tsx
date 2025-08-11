import { createContext, useContext, useState } from 'react';
import type { Transaction } from '../types';

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  return (
    <AppContext.Provider value={{ transactions, setTransactions }}>
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
