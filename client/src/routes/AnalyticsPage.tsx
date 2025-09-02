import React, { useState, useEffect, useRef } from "react";
import { usePluginContext } from "../plugin-system/PluginContext";
import { plugins } from "../plugin-system/PluginRegister";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  Select,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
type SensorPoint = { value: number; timestamp: string };
type SensorData = {
  temperature: SensorPoint[];
  humidity: SensorPoint[];
  pressure: SensorPoint[];
};

const AnalyticsPage = () => {
 const { chartType ,enabledPlugins} = usePluginContext();
  const effectiveChartType = enabledPlugins.includes("ChartSwitcher") ? chartType : "line";
  const [selectedMetric, setSelectedMetric] = useState("All Metrics");
  const [selectedSensor, setSelectedSensor] = useState("Sensor A");
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [customStart, setCustomStart] = useState<Dayjs | null>(dayjs().subtract(6, "month"));
  const [customEnd, setCustomEnd] = useState<Dayjs | null>(dayjs());
  const [aggregation, setAggregation] = useState("Mean");
  const [sensorData, setSensorData] = useState<SensorData>({ temperature: [], humidity: [], pressure: [] });
  const [hasData, setHasData] = useState(false);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
 
 


  useEffect(() => {
    setSelectedMetric("All Metrics");
  }, [selectedSensor]);

  useEffect(() => {
    if (selectedSensor === "All Metrics") {
      setSensorData({ temperature: [], humidity: [], pressure: [] });
      setHasData(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await axios.get("http://localhost:8000/sensorData", {
          params: { sensor_name: selectedSensor },
        });
        const numerical: any[] = resp.data.data?.Numerical || [];
        const now = dayjs();
        let startDate: Dayjs | null = null;
        if (dateRange === "Last 7 Days") startDate = now.subtract(7, "day");
        else if (dateRange === "Last 30 Days") startDate = now.subtract(30, "day");
        else if (dateRange === "Last 6 Months") startDate = now.subtract(6, "month");

        const transformed: SensorData = { temperature: [], humidity: [], pressure: [] };
        numerical.forEach((entry) => {
          const ts = dayjs(entry.time);
          const inRange = dateRange !== "Custom"
            ? startDate && ts.isAfter(startDate)
            : customStart && customEnd && ts.isAfter(customStart) && ts.isBefore(customEnd);
          if (!inRange) return;
          const p: SensorPoint = { value: entry.value, timestamp: entry.time };
          if (entry.channel_id === 101) transformed.temperature.push(p);
          if (entry.channel_id === 102) transformed.humidity.push(p);
          if (entry.channel_id === 103) transformed.pressure.push(p);
        });

        const anyData = transformed.temperature.length + transformed.humidity.length + transformed.pressure.length;
        setSensorData(transformed);
        setHasData(!!anyData);
        if (!anyData) alert("No data to plot.");
      } catch {
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedSensor, dateRange, customStart, customEnd]);

  const getChartData = () => {
    const length = Math.max(
      sensorData.temperature.length,
      sensorData.humidity.length,
      sensorData.pressure.length
    );
    return Array.from({ length }).map((_, i) => {
      const ts = sensorData.temperature[i]?.timestamp || sensorData.humidity[i]?.timestamp || sensorData.pressure[i]?.timestamp || `T${i}`;
      return {
        timestamp: dayjs(ts).format("MMM D HH:mm"),
        Temperature: sensorData.temperature[i]?.value ?? null,
        Humidity: sensorData.humidity[i]?.value ?? null,
        "Air Pressure": sensorData.pressure[i]?.value ?? null,
      };
    });
  };

  const exportDataAsCSV = () => {
    const data = getChartData();
    if (!data.length) return alert("No data to export.");
    const header = Object.keys(data[0]).join(",") + "\n";
    const rows = data.map(r => Object.values(r).map(v => (v === null ? "" : `${v}`)).join(",")).join("\n");
    saveAs(new Blob([header + rows], { type: "text/csv" }), "sensor_data.csv");
  };

  const exportChartAsImage = () => {
    if (!chartRef.current) return alert("Chart not available.");
    toPng(chartRef.current, { cacheBust: true }).then((url) => {
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = url;
      link.click();
    }).catch(() => alert("Failed to export chart image."));
  };

  const renderChartElement = () => {
    const data = getChartData();
    const commonProps = { data };
    if (effectiveChartType === "bar") return (
      <BarChart {...commonProps}>
        <XAxis dataKey="timestamp" /><YAxis /><Tooltip /><Legend />
        {(selectedMetric === "All Metrics" || selectedMetric === "Temperature") && <Bar dataKey="Temperature" />}
        {(selectedMetric === "All Metrics" || selectedMetric === "Humidity") && <Bar dataKey="Humidity" />}
        {(selectedMetric === "All Metrics" || selectedMetric === "Air Pressure") && <Bar dataKey="Air Pressure" />}
      </BarChart>
    );
    if (effectiveChartType === "area") return (
      <AreaChart {...commonProps}>
        <XAxis dataKey="timestamp" /><YAxis /><Tooltip /><Legend />
        {(selectedMetric === "All Metrics" || selectedMetric === "Temperature") && <Area dataKey="Temperature" />}
        {(selectedMetric === "All Metrics" || selectedMetric === "Humidity") && <Area dataKey="Humidity" />}
        {(selectedMetric === "All Metrics" || selectedMetric === "Air Pressure") && <Area dataKey="Air Pressure" />}
      </AreaChart>
    );
    return (
      <LineChart {...commonProps}>
        <XAxis dataKey="timestamp" /><YAxis /><Tooltip /><Legend />
        {(selectedMetric === "All Metrics" || selectedMetric === "Temperature") && <Line type="monotone" dataKey="Temperature" stroke="#f44336" dot={false} />}
        {(selectedMetric === "All Metrics" || selectedMetric === "Humidity") && <Line type="monotone" dataKey="Humidity" stroke="#3f51b5" dot={false} />}
        {(selectedMetric === "All Metrics" || selectedMetric === "Air Pressure") && <Line type="monotone" dataKey="Air Pressure" stroke="#00bcd4" dot={false} />}
      </LineChart>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
      {plugins
        .filter((plugin) => enabledPlugins.includes(plugin.name))
        .map((plugin) => (
          <plugin.Component key={plugin.name} />
        ))}
    </>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid>
            <Typography variant="subtitle2">Metric</Typography>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
                <MenuItem value="All Metrics">All Metrics</MenuItem>
                <MenuItem value="Temperature">Temperature</MenuItem>
                <MenuItem value="Humidity">Humidity</MenuItem>
                <MenuItem value="Air Pressure">Air Pressure</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <Typography variant="subtitle2">Sensor</Typography>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select value={selectedSensor} onChange={(e) => setSelectedSensor(e.target.value)}>
                <MenuItem value="All Metrics">All Metrics</MenuItem>
                <MenuItem value="Sensor A">Sensor A</MenuItem>
                <MenuItem value="Sensor B">Sensor B</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <Typography variant="subtitle2">Date Range</Typography>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                <MenuItem value="Last 6 Months">Last 6 Months</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {dateRange === "Custom" && (
            <>
              <Grid>
                <Typography variant="subtitle2">Start Date</Typography>
                <DatePicker value={customStart} onChange={(v) => setCustomStart(v)} slotProps={{ textField: { size: "small" } }} />
              </Grid>
              <Grid>
                <Typography variant="subtitle2">End Date</Typography>
                <DatePicker value={customEnd} onChange={(v) => setCustomEnd(v)} slotProps={{ textField: { size: "small" } }} />
              </Grid>
            </>
          )}
          <Grid>
            <Typography variant="subtitle2">Aggregation</Typography>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select value={aggregation} onChange={(e) => setAggregation(e.target.value)}>
                <MenuItem value="Mean">Mean</MenuItem>
                <MenuItem value="Median">Median</MenuItem>
                <MenuItem value="Max">Max</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box ref={chartRef} sx={{ border: "1px solid #ccc", p: 2, borderRadius: 2, minHeight: 300 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : hasData ? (
          <ResponsiveContainer width="100%" height={300}>
            {renderChartElement()}
          </ResponsiveContainer>
        ) : (
          <Typography variant="body2">No data available.</Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 2 }}>
        <Button variant="contained" onClick={exportDataAsCSV} sx={{ height: 30 }}>Export Data</Button>
        <Button variant="outlined" onClick={exportChartAsImage} sx={{ height: 30 }}>Export Chart</Button>
      </Box>

      <Grid container spacing={2} sx={{ border: "2px dashed #1976d2", p: 3, borderRadius: 2, backgroundColor: '#f5faff' }}>
        <Grid >
          <Typography variant="h6" align="center" color="primary">
            Coming Soon: Compare metrics across multiple sensors and date ranges side-by-side!
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary">
            Stay tuned — this section will help you analyze trends and patterns for smarter decision-making.
          </Typography>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default AnalyticsPage;