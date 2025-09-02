// src/plugin-system/PluginRegistry.ts
import { Plugin } from "./types";

// Import all plugins manually or dynamically with a generator later
import ChartSwitcherPlugin from "./plugins/chartSwitcher";
import chartSwitcherMeta from "./plugins/chartSwitcher/meta.json";

// Add more imports here for new plugins
// import AnotherPlugin from "./plugins/another-plugin";
// import anotherMeta from "./plugins/another-plugin/meta.json";
console.log(chartSwitcherMeta);
export const plugins: Plugin[] = [
  {
    name: chartSwitcherMeta.name,
    description: chartSwitcherMeta.description,
    Component: ChartSwitcherPlugin,
  },
  // Add more plugins here
  // {
  //   name: anotherMeta.name,
  //   description: anotherMeta.description,
  //   Component: AnotherPlugin,
  // },
];
