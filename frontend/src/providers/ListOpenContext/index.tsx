// ListOpenContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface ListOpenContextType {
  listOpen: boolean;
  setListOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListOpenContext = createContext<ListOpenContextType | undefined>(undefined);

export const useListOpen = () => {
  const context = useContext(ListOpenContext);
  if (!context) {
    throw new Error('useListOpen must be used within a ListOpenProvider');
  }
  return context;
};

export const ListOpenProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [listOpen, setListOpen] = useState(false);

  return (
    <ListOpenContext.Provider value={{ listOpen, setListOpen }}>
      {children}
    </ListOpenContext.Provider>
  );
};
