import * as React from "react";
import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LockOpenRounded from "@mui/icons-material/LockOpenRounded";
import { QrReader } from "react-qr-reader";
import { Fab, FormControl, TextField } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function UnlockDialog({ closeDialog, open, user, setRent }) {
  const [clicked, setClicked] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [code, setCode] = React.useState("");
  const [showQR, setShowQR] = React.useState(true);
  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    bottom: "3%",
    margin: "10%",
    p: 3,
    width: 0.8,
  };

  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeDialog}
      aria-describedby="alert-dialog-slide-description"
      sx={{ minHeight: "100%" }}
    >
      <IconButton
        sx={{ position: "absolute", left: "3%", top: "3%" }}
        onClick={() => {
          setClicked(false);
          closeDialog();
        }}
      >
        <ArrowBackRoundedIcon />
      </IconButton>
      {showQR && (
        <Box sx={{ mt: 4, pt: 0 }}>
          <QrReader
            onResult={(result, error) => {
              if (!!result) {
                setCode(result?.text);
              }
            }}
            style={{ width: "100%", height: "100%" }}
          />
          <p>{code}</p>
        </Box>
      )}
      <Typography
        align="center"
        variant="subtitle2"
        gutterBottom={true}
        sx={{ px: 2, mt: 5 }}
      >
        scan the QR code on the bike or enter the numeric code below to unlock
      </Typography>
      <FormControl sx={{ p: 3 }}>
        <TextField
          label="6 digits code"
          placeholder="123456"
          type="number"
          onChange={(event) => setCode(event.target.value)}
          value={code}
          variant="standard"
          sx={{ mb: 4, mt: 4 }}
          onFocusCapture={() => {
            setShowQR(false);
          }}
        />
      </FormControl>
      <Fab
        variant="extended"
        sx={style}
        onClick={async () => {
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user}`,
            },
          };
          try {
            const response = await fetch(
              process.env.API_URL + "/bikes/rent/" + code,
              options
            );
            if (!response) throw new Error("Network Error");
            if (!response?.ok) throw new Error("HTTP Error " + response.status);

            const { rentId } = await response.json();
            setRent(rentId);
            console.log("rent started! " + JSON.stringify(rentId));

            closeDialog();
          } catch (error) {
            setError(error.message);
          }
        }}
      >
        <LockOpenRounded sx={{ mr: 1 }} /> Unlock Bike
      </Fab>
    </Dialog>
  );
}

export default UnlockDialog;