import React from "react";
import {
  Box,
  FormField,
  Select,
} from "@canva/app-ui-kit";
import { useAppContext } from "src/context";

const STYLE_OPTIONS = [
  { value: "neutral", label: "Neutral Comic" },
  { value: "manga", label: "Manga" },
  { value: "european", label: "European Comic" },
  { value: "egyptian", label: "Egyptian Comic" },
  { value: "humanoid", label: "Humanoid" },
  
];

const GRID_OPTIONS = [
  { value: "1", label: " 1"},
  { value: "2", label: " 2" },
  { value: "3", label: " 3" },
  { value: "4", label: " 4" },
];

export const Presets = () => {
  const { 
    panelStyle, 
    setPanelStyle, 
    gridType,
    setGridType 
  } = useAppContext();

  const onStyleChange = (value: string) => {
    setPanelStyle(value);
  };

  const onGridChange = (value: string) => {
    setGridType(value);
  };

  return (
    <Box  display="flex" >
      <FormField
        label="Style"
        control={(props) => (
          <Select
            {...props}
            options={STYLE_OPTIONS}
            value={panelStyle}
            onChange={onStyleChange}
            placeholder="Select a style"
            stretch
          />
        )}
        
      />
      <FormField
        label="Panels"
        control={(props) => (
          <Select
            {...props}
            options={GRID_OPTIONS}
            value={gridType}
            onChange={onGridChange}
            placeholder="Select a grid"
            stretch
          />
        )}
      />
    </Box>
  );
};