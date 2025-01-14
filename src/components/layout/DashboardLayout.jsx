import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import logo from "../../../public/logo.png";

export default function DashboardLayout({ children, title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "white",
          color: "textcolor",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar>
          <div className="flex items-center space-x-2 flex-1">
            <img
              src={logo}
              alt="SafePaper Logo"
              className="w-10 h-10 object-contain"
            />
            <Typography variant="h6" className="text-accent font-bold">
              SafePaper
            </Typography>
          </div>

          <IconButton onClick={handleMenuOpen}>
            <Avatar
              sx={{
                bgcolor: "#dedcff",
                color: "#2f27ce",
                width: 32,
                height: 32,
                fontSize: "0.9rem",
                fontFamily: "Space Grotesk",
              }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: "12px",
                border: "1px solid #dedcff",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              },
            }}
          >
            <MenuItem
              onClick={handleLogout}
              sx={{
                py: 1.5,
                px: 2,
                fontFamily: "Poppins",
                color: "#ff4444",
                gap: 1.5,
              }}
            >
              <LogoutIcon />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="main" className="flex-1 p-4 mt-16 bg-background">
        {children}
      </Box>
    </Box>
  );
}
