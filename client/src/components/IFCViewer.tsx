import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@mui/material";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
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
import * as WEBIFC from "web-ifc";
import { useThemeContext } from "../authContext/ThemeContext";
import ObjectPropertiesPanel from "./objectProperty";

type SensorPoint = { value: number; timestamp: string };
type SensorData = {
  temperature: SensorPoint[];
  humidity: SensorPoint[];
  pressure: SensorPoint[];
};

export const IFCViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<any>(null);
  const { mode } = useThemeContext();

  const [selectedProps, setSelectedProps] = useState<{
    Class?: string;
    GlobalId?: string;
    Name?: string;
    Position?: string;
    Battery?: string;
    Status?: string;
  } | null>(null);
  const [pinned, setPinned] = useState(false);

  const [sensorName, setSensorName] = useState("");
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: [],
    humidity: [],
    pressure: [],
  });
  const [hasData, setHasData] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "temperature" | "humidity" | "pressure"
  >("temperature");

  const fetchInfo = async () => {
    if (!sensorName) return;
    try {
      const resp = await axios.get("http://localhost:8000/sensorData", {
        params: { sensor_name: sensorName },
      });
      type Entry = { channel_id: number; value: number; time: string };
      const data: Entry[] = resp.data.data?.Numerical || [];

      const acc: SensorData = { temperature: [], humidity: [], pressure: [] };
      data.forEach((e) => {
        const pt: SensorPoint = { value: e.value, timestamp: e.time };
        if (e.channel_id === 101) acc.temperature.push(pt);
        if (e.channel_id === 102) acc.humidity.push(pt);
        if (e.channel_id === 103) acc.pressure.push(pt);
      });

      const anyData =
        acc.temperature.length + acc.humidity.length + acc.pressure.length > 0;
      setSensorData(acc);
      setHasData(anyData);
      if (!anyData) alert("There is no data to plot.");
    } catch (err) {
      console.error("Error fetching sensor data:", err);
      setHasData(false);
    }
  };

  const resetCameraView = () => {
    const world = worldRef.current;
    if (!world) return;
    world.camera.controls.setLookAt(10, 6, 8, 0, 0, -10);
  };

  useEffect(() => {
    async function init() {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";

      const components = new OBC.Components();
      const worlds = components.get(OBC.Worlds);
      const world = worlds.create<
        OBC.SimpleScene,
        OBC.SimpleCamera,
        OBC.SimpleRenderer
      >();
      worldRef.current = world;

      world.scene = new OBC.SimpleScene(components);
      world.renderer = new OBC.SimpleRenderer(components, containerRef.current);
      world.camera = new OBC.SimpleCamera(components);
      world.camera.controls.connect(world.renderer.three.domElement);
      world.scene.setup();
      world.scene.three.background = null;
      world.camera.controls.setLookAt(10, 6, 8, 0, 0, -10);

      await components.init();
      components.get(OBC.Grids).create(world);

      const loader = components.get(OBC.IfcLoader);
      await loader.setup({ wasm: { path: "/web-ifc/", absolute: false } });
      [
        WEBIFC.IFCTENDONANCHOR,
        WEBIFC.IFCREINFORCINGBAR,
        WEBIFC.IFCREINFORCINGELEMENT,
      ].forEach((cat) => loader.settings.excludedCategories.add(cat));
      loader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

      const resp = await fetch("/assets/my-model.ifc");
      const buf = new Uint8Array(await resp.arrayBuffer());
      const model = await loader.load(buf);
      world.scene.three.add(model);
      await components.get(OBC.IfcRelationsIndexer).process(model);

      const highlighter = components.get(OBCF.Highlighter);
      highlighter.setup({ world });
      highlighter.events.select.onHighlight.add(
        async (fragmentMap: Record<string, Set<number>>) => {
          outer: for (const fragSet of Object.values(fragmentMap)) {
            for (const id of fragSet) {
              const props = await model.getProperties(id);
              if (!props) continue;

              // 1) Determine IFC instance type code
              const rawTypeId = (props.type as unknown) as number;
              // 2) Derive a readable name
              const typeName =
                Object.entries(WEBIFC).find(([, v]) => v === rawTypeId)?.[0] ||
                `Unknown(${rawTypeId})`;
              // 3) Read the Name attribute
              const nameValue = props.Name?.value as string | undefined;

              // Base fields for all elements
              const base = {
                Class: typeName,
                GlobalId: props.GlobalId?.value,
                Name: nameValue,
              };

              // 4) Show extras only if the instance is IfcSensor
              //    OR its Name contains "sensor"
              const isSensorInstance = rawTypeId === WEBIFC.IFCSENSOR;
              const nameHasSensor =
                !!nameValue &&
                nameValue.toLowerCase().includes("sensor");

              if (isSensorInstance || nameHasSensor) {
                setSelectedProps({
                  ...base,
                   Position: "-",
                  Battery: "-",     // placeholder or read from a Pset
                  Status: "-", // default or read from a Pset
                });
              } else {
                setSelectedProps(base);
              }

              // Prepare for chart fetch
              setSensorName(nameValue || "");
              setSensorData({ temperature: [], humidity: [], pressure: [] });
              setHasData(false);
              setActiveTab("temperature");

              break outer;
            }
          }
        }
      );

      return () => components.dispose();
    }
    init();
  }, []);

  const renderChart = (type: "temperature" | "humidity" | "pressure") => {
    const cfg = {
      temperature: { color: "#ff7300", name: "Temperature (°C)" },
      humidity: { color: "#387908", name: "Humidity (%)" },
      pressure: { color: "#8884d8", name: "Pressure (hPa)" },
    } as const;
    const { color, name } = cfg[type];
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sensorData[type]}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={mode === "dark" ? "#444" : "#ccc"}
          />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(t) => t.slice(11, 16)}
            stroke={mode === "dark" ? "#eee" : "#000"}
          />
          <YAxis stroke={mode === "dark" ? "#eee" : "#000"} />
          <Tooltip
            contentStyle={{
              backgroundColor: mode === "dark" ? "#333" : "#fff",
              borderColor: mode === "dark" ? "#555" : "#ccc",
            }}
            labelStyle={{ color: mode === "dark" ? "#ddd" : "#000" }}
            itemStyle={{ color: mode === "dark" ? "#ddd" : "#000" }}
          />
          <Legend wrapperStyle={{ color: mode === "dark" ? "#ddd" : "#000" }} />
          <Line type="monotone" dataKey="value" stroke={color} name={name} />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        height: "80vh",
        width: "85vw",
        backgroundColor: mode === "dark" ? "#121212" : "#fff",
      }}
    >
      <Button
        onClick={resetCameraView}
        variant="contained"
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          zIndex: 10,
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: mode === "dark" ? "#444" : "#eee",
        }}
      >
        <HomeIcon style={{ color: mode === "dark" ? "#fff" : "#000" }} />
      </Button>

      <div
        ref={containerRef}
        style={{ flex: 1, height: "85vh", overflow: "hidden" }}
      />

      <div
        style={{
          width: 400,
          padding: "1rem",
          overflowY: "auto",
          backgroundColor: mode === "dark" ? "#121212" : "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          borderLeft: `1px solid #ddd`,
          height: "85vh",
        }}
      >
        {!selectedProps ? (
          <div
            style={{
              fontStyle: "italic",
              color: mode === "dark" ? "#aaa" : "#666",
              padding: "1rem",
            }}
          >
            Please select a component to view its properties.
          </div>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={fetchInfo}
              style={{ marginBottom: "1rem" }}
            >
              SENSOR INFORMATION
            </Button>

            <ObjectPropertiesPanel
              properties={selectedProps}
              mode={mode}
              pinned={pinned}
              onPin={() => setPinned((p) => !p)}
              onClose={() => {
                if (!pinned) setSelectedProps(null);
              }}
            />

            <div style={{ margin: "1rem 0" }}>
              {(["temperature", "humidity", "pressure"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      backgroundColor:
                        activeTab === tab
                          ? mode === "dark"
                            ? "#555"
                            : "#ddd"
                          : mode === "dark"
                          ? "#222"
                          : "#fff",
                      color: mode === "dark" ? "#eee" : "#000",
                      border: `1px solid ${
                        mode === "dark" ? "#555" : "#ccc"
                      }`,
                      padding: "0.4rem 1rem",
                      marginRight: "0.5rem",
                      cursor: "pointer",
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                )
              )}
            </div>

            {hasData ? (
              renderChart(activeTab)
            ) : (
              <div
                style={{
                  fontStyle: "italic",
                  color: mode === "dark" ? "#aaa" : "#666",
                }}
              >
                No sensor data available.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
