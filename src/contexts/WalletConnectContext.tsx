import { createContext, useState, ReactNode } from "react";

// Define the type for the context
interface WalletConnectContextType {
  accountId: string | null;
  setAccountId: (newValue: string | null) => void;
  isConnected: boolean;
  setIsConnected: (newValue: boolean) => void;
}

// Default values for the context
const defaultValue: WalletConnectContextType = {
  accountId: null,
  setAccountId: () => {},
  isConnected: false,
  setIsConnected: () => {},
};

// Create the context
export const WalletConnectContext = createContext<WalletConnectContextType>(defaultValue);

export const WalletConnectContextProvider = ({ children }: { children: ReactNode }) => {
  const [accountId, setAccountId] = useState<string | null>(defaultValue.accountId);
  const [isConnected, setIsConnected] = useState<boolean>(defaultValue.isConnected);

  return (
    <WalletConnectContext.Provider
      value={{
        accountId,
        setAccountId,
        isConnected,
        setIsConnected,
      }}
    >
      {children}
    </WalletConnectContext.Provider>
  );
};
