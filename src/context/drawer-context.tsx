import { createContext, ReactNode, useContext, useState } from 'react';

type Ctx = { open: boolean; openDrawer: () => void; closeDrawer: () => void };
const DrawerContext = createContext<Ctx>({ open: false, openDrawer: () => {}, closeDrawer: () => {} });

export const useDrawer = () => useContext(DrawerContext);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DrawerContext.Provider value={{ open, openDrawer: () => setOpen(true), closeDrawer: () => setOpen(false) }}>
      {children}
    </DrawerContext.Provider>
  );
}