import CloseIcon from "@mui/icons-material/Close";
import PushPinIcon from "@mui/icons-material/PushPin";
import IconButton from "@mui/material/IconButton";
import React from "react";

interface ObjectPropertiesPanelProps {
  properties: Record<string, any> | null;
  mode: "dark" | "light";
  pinned: boolean;
  onPin: () => void;
  onClose: () => void;
}

const ObjectPropertiesPanel: React.FC<ObjectPropertiesPanelProps> = ({
  properties,
  mode,
  pinned,
  onPin,
  onClose,
}) => {
  if (!properties) return null;

  const bgColor = mode === "dark" ? "#1e1e1e" : "#ffffff";
  const textColor = mode === "dark" ? "#f0f0f0" : "#1a1a1a";
  const borderColor = mode === "dark" ? "#333" : "#ddd";
  const labelColor = mode === "dark" ? "#aaa" : "#555";
  const headerColor = "#f39100";

  const rowStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    borderBottom: `1px solid ${borderColor}`,
    fontSize: "0.9rem",
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: bgColor,
        borderRadius: "12px",
        boxShadow: mode === "dark" ? "0 0 0 1px #333" : "0 0 0 1px #ddd",
        overflow: "hidden",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* HEADER BAR */}
      <div
        style={{
          backgroundColor: headerColor,
          color: "#fff",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: "1rem" }}>
          OBJECT PROPERTIES
        </span>
        <div>
          <IconButton size="small" sx={{ color: "#fff" }} onClick={onPin}>
            <PushPinIcon
              fontSize="small"
              style={{ opacity: pinned ? 1 : 0.5 }}
            />
          </IconButton>
          <IconButton size="small" sx={{ color: "#fff" }} onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/* DIVIDER */}
      <div
        style={{
          borderBottom: `1px solid ${borderColor}`,
          margin: "0 12px",
        }}
      />

      {/* PROPERTY ROWS */}
      {["Class", "GlobalId", "Name", "Position", "Battery", "Status"].map(
        (key) =>
          key in properties && (
            <div style={rowStyle} key={key}>
              <span style={{ color: labelColor, fontWeight: 500 }}>{key}</span>
              <span style={{ color: textColor }}>
                {properties[key] ?? "-"}
              </span>
            </div>
          )
      )}
    </div>
  );
};

export default ObjectPropertiesPanel;