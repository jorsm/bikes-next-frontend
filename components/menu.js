import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export default function Menu({ open, toggleDrawer, user, logout }) {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  const toggle = (_open) => (event) => toggleDrawer(_open);

  return (
    <SwipeableDrawer
      className="no-fastclick"
      anchor="right"
      open={open}
      onClose={toggle(false)}
      onOpen={toggle(true)}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggle(true)}
        onKeyDown={toggle(true)}
      >
        <List>
          {user && (
            <ListItem key="acc" disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ManageAccountsRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="account" />
              </ListItemButton>
            </ListItem>
          )}
          {user && (
            <ListItem key="rents" disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <RouteRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="my trips" />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem key="set" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SettingsRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="settings" />
            </ListItemButton>
          </ListItem>

          <ListItem key="guide" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HelpOutlineRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="guide" />
            </ListItemButton>
          </ListItem>

          {user && (
            <ListItem key="rents" disablePadding>
              <ListItemButton onClick={logout}>
                <ListItemIcon>
                  <LogoutRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="logout" />
              </ListItemButton>
            </ListItem>
          )}
          {user && <Divider /> && (
              <ListItem key="wifc" disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <GroupAddRoundedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="family"
                    secondary="add members to your subscription"
                  />
                </ListItemButton>
              </ListItem>
            ) && <Divider />}
        </List>
        {user && (
          <Paper
            elevation={3}
            sx={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              p: 3,
              alignContent: "right",
            }}
          ></Paper>
        )}
      </Box>
    </SwipeableDrawer>
  );
}
