import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Dashboard,
  Sensors,
  Settings,
  BarChart,
  Search,
  Notifications,
  Menu as MenuIcon,
  ChevronLeft,
  Extension,
} from "@mui/icons-material";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import AnalyticsPage from "../routes/AnalyticsPage";
import { IFCViewer } from "./IFCViewer";
import DashboardPage from "../routes/DashBoardPage";
import { useAuth } from "../authContext/AuthContext";
import { useNavigate } from "react-router-dom";
import SettingPage from "../routes/SettingPage";
import SensorsPage from "../routes/SensorsPage";
import ExtensionsPage from "./ExtensionPage";


const drawerWidth = 180;
const collapsedWidth = 60;

const DashboardLayout = () => {
  const {user,role, logout } = useAuth();
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDrawer = () => {
    setCollapsed((prev) => !prev);
  };

  const renderPage = () => {
    const sharedProps = { navigate: setSelectedPage };

    switch (selectedPage) {
      case "Dashboard":
        return <DashboardPage {...sharedProps} />;
      case "Analytics":
        return <AnalyticsPage />;
      case "BIM View":
        return <IFCViewer />;
      case "Settings":
        return <SettingPage />;
      case "Sensors":
        return <SensorsPage />;
      case "Extensions":
         return <ExtensionsPage />;
      default:
        return <DashboardPage {...sharedProps} />;
    }
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard /> },
    { text: "BIM View", icon: <BarChart /> },
    { text: "Sensors", icon: <Sensors /> },
    { text: "Analytics", icon: <BarChart /> },
    { text: "Settings", icon: <Settings /> },
    { text: "Extensions", icon: <Extension /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
          ml: `${collapsed ? collapsedWidth : drawerWidth}px`,
          backgroundColor: "#fff",
          color: "#000",
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
          transition: "all 0.3s",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={toggleDrawer}>
              {collapsed ? <MenuIcon /> : <ChevronLeft />}
            </IconButton>
            <Typography variant="h6" noWrap>
              {selectedPage}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                pl: 1,
              }}
            >
              <Search />
              <InputBase placeholder="Search…" sx={{ ml: 1 }} />
            </Box>
            <IconButton color="primary">
              <Notifications />
            </IconButton>
            <IconButton color="primary" onClick={handleLogout}>
              <LogoutSharpIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          transition: "all 0.3s",
          [`& .MuiDrawer-paper`]: {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#f9f9f9",
            borderRight: "1px solid #e0e0e0",
            overflowX: "hidden",
            transition: "all 0.3s",
          },
        }}
      >
        {/* Top Section */}
        <Box>
          <Box display="flex" justifyContent="center" p={2}>
            <img
              src="/images/Logo1.png"
              alt="Bauhaus University"
              style={{
                width: collapsed ? "80%" : "100%",
                height: collapsed ? "24px" : "40px",
                transition: "all 0.3s",
              }}
            />
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={selectedPage === item.text}
                  onClick={() => setSelectedPage(item.text)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderLeft: selectedPage === item.text
                      ? "4px solid #1976d2"
                      : "4px solid transparent",
                    backgroundColor: selectedPage === item.text
                      ? "#e3f2fd"
                      : "transparent",
                    transition: "all 0.2s",
                    '&:hover': {
                      backgroundColor: "#f0f4f8",
                    },
                    justifyContent: collapsed ? "center" : "flex-start",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: selectedPage === item.text ? "#1976d2" : "inherit",
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.text} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ textAlign: "center", pb: 3 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mx: "auto",
              mb: 1,
            }}
          />
          {!collapsed && (
            <>
              <Typography variant="subtitle1" fontWeight="bold">
                {user}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {role}
              </Typography>
            </>
          )}
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          transition: "all 0.3s",
        }}
      >
        {renderPage()}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
