import { createContext, useContext, useState, ReactNode } from 'react';

interface TickerContextType {
  tickers: string[];
  addTicker: (ticker: string) => void;
  removeTicker: (ticker: string) => void;
}

const TickerContext = createContext<TickerContextType | undefined>(undefined);

export function TickerProvider({ children }: { children: ReactNode }) {
  const [tickers, setTickers] = useState<string[]>(['PAR', 'SKYH', 'UPST']);

  const addTicker = (newTicker: string) => {
    const upper = newTicker.toUpperCase();
    if (upper && !tickers.includes(upper)) {
      setTickers([...tickers, upper]);
    }
  };

  const removeTicker = (ticker: string) => {
    setTickers(tickers.filter((t) => t !== ticker));
  };

  return (
    <TickerContext.Provider value={{ tickers, addTicker, removeTicker }}>
      {children}
    </TickerContext.Provider>
  );
}

export function useTickers() {
  const context = useContext(TickerContext);
  if (undefined === context) {
    throw new Error('useTickers must be used within a TickerProvider');
  }
  return context;
}
