import { createContext, useState } from 'react';
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
