// SettingsPage.tsx
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";

const SettingPage = () => {
  return (

      <Box style={{
          display: "flex",
          gap: "150px",
          marginBottom: "10px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}>
        <Box sx={{ flex: 1 }}>
          

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Sensor Settings
          </Typography>
          <List>
            {[
              "High-temperature alert",
              "Low-temperature alert",
              "High-humidity alert",
              "Low-humidity alert",
              "High-pressure alert",
              "Low-pressure alert",
              "Battery alert",
            ].map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            System Settings
          </Typography>
          <List>
            {[
              "Data refresh interval",
              "MQTT broker URL",
              "Database Status",
              "Broker Status",
            ].map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Notify via:
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControlLabel
              control={<Switch checked color="primary" />}
              label="Email"
            />
            <FormControlLabel control={<Switch />} label="SMS" />
            <FormControlLabel
              control={<Switch checked color="primary" />}
              label="Push notification"
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            System Log
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3].map((row) => (
                  <TableRow key={row}>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

  );
};

export default SettingPage;