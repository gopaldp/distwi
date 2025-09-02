import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { usePluginContext } from "../../PluginContext";

const ChartSwitcherPlugin = () => {
  const { chartType, setChartType } = usePluginContext();

  return (
    <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
      <Typography variant="subtitle2">Chart Type</Typography>
      <Select value={chartType} onChange={(e) => setChartType(e.target.value as any)}>
        <MenuItem value="line">Line</MenuItem>
        <MenuItem value="bar">Bar</MenuItem>
        <MenuItem value="area">Area</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ChartSwitcherPlugin;
