import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../authContext/AuthContext";

type Reading = {
  value: number;
  time: string;
};

type SensorReadings = {
  temperature?: Reading;
  humidity?: Reading;
  pressure?: Reading;
};

type SensorData = {
  [sensorName: string]: SensorReadings;
};

type DashboardPageProps = {
  navigate: (page: string) => void;
  selectedView?: string;
  token?: string;
};

const DashboardPage = ({ navigate }: DashboardPageProps) => {
  const { token, logout } = useAuth();
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSensorChartData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/sensorData", {
        params: { sensor_name: "sensor1" },
      });

      const numericalData = response.data.data?.Numerical || [];
      if (numericalData.length === 0) {
        setChartData([]);
        return;
      }

      const latestTimestamp = new Date(
        numericalData.reduce((max: string, curr: any) =>
          curr.time > max ? curr.time : max,
          numericalData[0].time
        )
      );

      const dayAgoTimestamp = new Date(
        latestTimestamp.getTime() - 24 * 60 * 60 * 1000
      );

      const last24hData = numericalData.filter(
        (entry: any) =>
          new Date(entry.time) >= dayAgoTimestamp &&
          new Date(entry.time) <= latestTimestamp
      );

      const transformed: { [time: string]: any } = {};

      last24hData.forEach((entry: any) => {
        const dateObj = new Date(entry.time);
        const timeKey = dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        if (!transformed[timeKey]) {
          transformed[timeKey] = {
            hour: timeKey,
            fullTime: dateObj.toLocaleString(),
          };
        }

        switch (entry.channel_id) {
          case 101:
            transformed[timeKey].temperature = entry.value;
            break;
          case 102:
            transformed[timeKey].humidity = entry.value;
            break;
          case 103:
            transformed[timeKey].pressure = entry.value;
            break;
        }
      });

      const chartArray = Object.values(transformed).sort(
        (a: any, b: any) =>
          new Date(`1970/01/01 ${a.hour}`).getTime() -
          new Date(`1970/01/01 ${b.hour}`).getTime()
      );

      setChartData(chartArray);
    } catch (error) {
      console.error("Error fetching chart data", error);
      setChartData([]);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get("http://localhost:8000/sensors", { params: { token } })
      .then((res) => {
        setSensorData(res.data.sensors);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch sensor data", err);
        setError("Failed to fetch sensor data");
        setLoading(false);
      });

    fetchSensorChartData();
  }, [token]);

  return (
     <Box>
    {/* Top Section: Lizard on the left, all others on right */}
    <Box
      sx={{
        display: "flex",
        gap: "40px",
        alignItems: "flex-start",
        flexWrap: "wrap",
        mb: 2,
      }}
    >
      {/* Lizard Card - Left Side */}
      <Box sx={{ flex: "1 1 300px", maxWidth: "360px" }}>
        <Card style={{ width: "100%",minHeight:"600px" }}>
          <CardMedia sx={{ height: "30vh" }} image="/images/hub.png" />
          <CardContent>
            <Typography gutterBottom style={{fontSize:"18px",fontWeight:"lighter"}} >
               A Living Lab for Sustainable Building and Smart Technology
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              <strong>
                Can a building sustain itself—energy-wise—while adapting to its environment and informing its designers?
              </strong>
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Researchers equipped the building with over 100 sensors monitoring temperature, air quality, and moisture.
              This feeds into a dynamic 3D model (digital twin) that updates in real time.
            </Typography>
            <Typography variant="body2" color="textSecondary">
              The Hub, by Bauhaus University Weimar, unifies real-world construction, smart sensors, and data visualization in one space.


            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Right Side: Sensor Table, News, BIM Card */}
      <Box sx={{ flex: "2 1 600px", display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Sensor Summary */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Real-time Sensor Data
          </Typography>
          {loading ? (
            <Typography variant="body2" color="textSecondary">Loading sensor data...</Typography>
          ) : error ? (
            <Typography variant="body2" color="error">{error}</Typography>
          ) : Object.keys(sensorData).length === 0 ? (
            <Typography variant="body2" color="textSecondary">No sensor data available.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Sensor</TableCell>
                    <TableCell>Temperature (°C)</TableCell>
                    <TableCell>Humidity (%)</TableCell>
                    <TableCell>Pressure (kPa)</TableCell>
                    <TableCell>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(sensorData).map(([name, readings]) => (
                    <TableRow key={name}>
                      <TableCell>{name}</TableCell>
                      <TableCell>{readings?.temperature?.value ?? "N/A"}</TableCell>
                      <TableCell>{readings?.humidity?.value ?? "N/A"}</TableCell>
                      <TableCell>{readings?.pressure?.value ?? "N/A"}</TableCell>
                      <TableCell>
                        {readings?.temperature?.time ||
                          readings?.humidity?.time ||
                          readings?.pressure?.time ||
                          "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        {/* News and BIM side by side */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {/* News Card */}
          <Box sx={{ flex: "1 1 300px", minWidth: "280px", maxWidth: "400px" }}>
            <Typography style={{fontSize:"15px"}} color="textSecondary" sx={{ mb: 2 }}>
              Released: 25. Jun 2025
            </Typography>
            <Card sx={{ height: 250 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  New solar panels have been installed to the Bauhaus Energy Hub
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  New solar panels have been installed at the Bauhaus Energy Hub to support its mission of achieving energy autonomy...
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* BIM Model Card */}
          <Box sx={{ flex: "1 1 300px", minWidth: "280px", maxWidth: "400px" }}>
            <Typography variant="h6" gutterBottom>
              BIM - Model
            </Typography>
            <Card sx={{ height: 300, width: "100%" }}>
              <CardContent sx={{ p: 0 }}>
                <Stack height="100%" spacing={0} justifyContent="space-between">
                  <Box
                    component="img"
                    src="/images/Bauhaus_Logo.png"
                    alt="Logo"
                    sx={{
                      backgroundColor: "#e0e0e0",
                      height: "100%",
                      width: "100%",
                      maxHeight: 220,
                      objectFit: "fill",
                    }}
                  />
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate("BIM View")}
                      sx={{
                        padding: "4px",
                        backgroundColor: "#f39100",
                        color: "#fff",
                      }}
                    >
                      Explore the Digital Twin
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>

    {/* Chart Section */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f39100",
        color: "#fff",
        px: 2,
        py: 1,
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      }}
    >
      <Typography variant="body1">Trend chart : 24 hour monitor</Typography>
    </Box>

    <Card>
      <CardContent>
        {chartData.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No chart data available.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => {
                  const point = chartData.find((d) => d.hour === label);
                  return point ? point.fullTime : label;
                }}
                formatter={(value, name) => [
                  value,
                  typeof name === "string"
                    ? name.charAt(0).toUpperCase() + name.slice(1)
                    : name,
                ]}
              />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#ff7300" dot={false} />
              <Line type="monotone" dataKey="humidity" stroke="#387908" dot={false} />
              <Line type="monotone" dataKey="pressure" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  </Box>
  );
};

export default DashboardPage;
