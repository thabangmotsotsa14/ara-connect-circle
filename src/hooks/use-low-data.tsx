import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Ctx = { lowData: boolean; toggle: () => void; setLowData: (v: boolean) => void };
const LowDataCtx = createContext<Ctx>({ lowData: false, toggle: () => {}, setLowData: () => {} });

const STORAGE_KEY = "ara_low_data_mode";

export function LowDataProvider({ children }: { children: ReactNode }) {
  const [lowData, setLowData] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "1") setLowData(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lowData ? "1" : "0");
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("low-data", lowData);
      }
    } catch {}
  }, [lowData]);

  return (
    <LowDataCtx.Provider value={{ lowData, setLowData, toggle: () => setLowData((v) => !v) }}>
      {children}
    </LowDataCtx.Provider>
  );
}

export function useLowData() {
  return useContext(LowDataCtx);
}