import * as React from "react";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LockOpenRounded from "@mui/icons-material/LockOpenRounded";
import { QrReader, UseQrReaderHook } from "react-qr-reader";
import { Fab, FormControl, TextField, DialogTitle } from "@mui/material";
import DialogBase from "./dialogBase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UnlockDialog({ closeDialog, open, user, setRent }) {
  const [error, setError] = React.useState(null);
  const [code, setCode] = React.useState("");
  const [showQR, setShowQR] = React.useState(true);

  const buttonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    bottom: "3%",
    margin: "10%",
    p: 3,
    width: 0.8,
  };

  var qrProps = {
    videoId: "qr-video",
    scanDelay: 500,
    videoStyle: {
      width: "100%",
      height: "auto",
    },
    constraints: {
      facingMode: "environment",
    },
  };

  const dialogProps = {
    closeDialog: () => {
      setShowQR(null);
      closeDialog();
    },
    open: open,
    title: "Start riding now!",
  };

  const unlockBike = async () => {
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
  };

  return (
    <DialogBase {...dialogProps} error={error}>
      {showQR && (
        <QrReader
          {...qrProps}
          onResult={(result, error) => {
            if (result) {
              setCode(result?.text);
            }
            if (error) setError(error.message);
          }}
        />
      )}

      <p>{code}</p>

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
      <Fab variant="extended" sx={buttonStyle} onClick={unlockBike}>
        <LockOpenRounded sx={{ mr: 1 }} /> Unlock Bike
      </Fab>
    </DialogBase>
  );
}
