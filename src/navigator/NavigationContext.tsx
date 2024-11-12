import React, {createContext, useState, ReactNode} from 'react';

interface NavigationContextType {
  currentScreen: number;
  setCurrentScreen: (screen: number) => void;
}

export const NavigationContext = createContext<
  NavigationContextType | undefined
>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const [currentScreen, setCurrentScreen] = useState<any>(0);

  return (
    <NavigationContext.Provider value={{currentScreen, setCurrentScreen}}>
      {children}
    </NavigationContext.Provider>
  );
};
