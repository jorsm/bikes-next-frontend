import { MenuRounded } from "@mui/icons-material";
import { Box, AppBar, Toolbar, IconButton } from "@mui/material";
import Menu from "./menu";
import { useState } from "react";

export default function MainAppBar({ logout, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  function toggleDrawer(open) {
    console.log("setting menu open to " + open);
    setMenuOpen(open);
  }
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense" disableGutters>
            <IconButton
              size="large"
              color="inherit"
              aria-label="menu"
              edge="end"
              sx={{ mr: 2 }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MenuRounded />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Menu
        open={menuOpen}
        toggleDrawer={toggleDrawer}
        logout={logout}
        user={user}
      />
    </>
  );
}
