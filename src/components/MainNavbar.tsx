import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const MainNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleRoute = (path: string) => {
    navigate(path);
  };

  const navLinks = [
    { title: "General", path: "/entries" },
    { title: "Diet", path: "/diet" },
    { title: "Workout", path: "/workout" }
  ];

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* Logo Section */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => handleRoute("/")}
        >
          Marco
        </Typography>

        {/* Navigation Links */}
        <Box>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              color="inherit"
              component={Link}
              to={link.path}
              sx={{ marginLeft: 2 }}
            >
              {link.title}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MainNavbar;
