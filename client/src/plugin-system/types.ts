// src/plugin-system/types.ts
import type React from "react";

export interface Plugin {
  name: string;
  description: string;
  Component: React.ComponentType;
}
