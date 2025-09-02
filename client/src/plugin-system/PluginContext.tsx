// context/PluginContext.tsx
import React, { createContext, useContext, useState } from "react";
import { plugins } from "../plugin-system/PluginRegister";

type PluginName = (typeof plugins)[number]["name"];

interface PluginContextType {
  enabledPlugins: PluginName[];
  chartType: "line" | "bar" | "area";
  setChartType: (type: "line" | "bar" | "area") => void;
  togglePlugin: (plugin: PluginName) => void;
}


const PluginContext = createContext<PluginContextType | undefined>(undefined);

export const PluginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");
  const [enabledPlugins, setEnabledPlugins] = useState<PluginName[]>([]);

  const togglePlugin = (plugin: PluginName) => {
    setEnabledPlugins((prev) =>
    {
     if (prev.includes(plugin)) {
      setChartType("line"); 
      return prev.filter((p) => p !== plugin);
    } else {
      return [...prev, plugin];
    }
  });
  };

  return (
     <PluginContext.Provider value={{ enabledPlugins, togglePlugin, chartType, setChartType }}>
      {children}
    </PluginContext.Provider>
  );
};

export const usePluginContext = (): PluginContextType => {
  const context = useContext(PluginContext);
  if (!context) throw new Error("usePluginContext must be used within PluginProvider");
  return context;
};
