"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type Store, createZStore, initStore } from "@/utils/use-zustand-state";

export type StoreApi = ReturnType<typeof createZStore>;

export const StoreContext = createContext<StoreApi | undefined>(undefined);

export interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const storeRef = useRef<StoreApi>();
  if (!storeRef.current) {
    storeRef.current = createZStore(initStore());
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreS = <T,>(selector: (store: Store) => T): T => {
  const storeContext = useContext(StoreContext);

  if (!storeContext) {
    throw new Error(`useStore must be use within StoreProvider`);
  }

  return useStore(storeContext, selector);
};

/*
  To use the context inside of a page or component:

  1. add those three imports at the top of the file:
  ```tsx
    import { useContext } from "react";
    import { StoreContext } from "@/components/ZustandStoreProvider/ZustandStoreProvider";
    import { useStore } from "zustand";
  ```

  2. get the store and the state you want to use:
  ```tsx
    const store = useContext(StoreContext);
    const globalState = useStore(store, (s) => s.globalState); // or whatever you like
  ```
 */
