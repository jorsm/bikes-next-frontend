import * as React from "react";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LockOpenRounded from "@mui/icons-material/LockOpenRounded";
import { QrReader } from "react-qr-reader";
import {
  Fab,
  FormControl,
  TextField,
  Stack,
  Box,
  DialogTitle,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewFinder = () => (
  <>
    <svg
      width="50px"
      viewBox="0 0 100 100"
      style={{
        top: 0,
        left: 0,
        zIndex: 1,
        boxSizing: "border-box",
        border: "50px solid rgba(0, 0, 0, 0.3)",
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <path
        fill="none"
        d="M13,0 L0,0 L0,13"
        stroke="rgba(255, 0, 0, 0.5)"
        strokeWidth="5"
      />
      <path
        fill="none"
        d="M0,87 L0,100 L13,100"
        stroke="rgba(255, 0, 0, 0.5)"
        strokeWidth="5"
      />
      <path
        fill="none"
        d="M87,100 L100,100 L100,87"
        stroke="rgba(255, 0, 0, 0.5)"
        strokeWidth="5"
      />
      <path
        fill="none"
        d="M100,13 L100,0 87,0"
        stroke="rgba(255, 0, 0, 0.5)"
        strokeWidth="5"
      />
    </svg>
  </>
);

export default function UnlockDialog({ closeDialog, open, user, setRent }) {
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

  const videoElement = React.useRef(null);
  var qrProps = {
    videoId: "qr-video",
    scanDelay: 500,
    videoStyle: {
      width: "100%",
      height: "auto",
    },
    containerStyle: { borderRadius: "25px", m: 0 },
    constraints: {
      facingMode: "environment",
    },
    ref: videoElement,
  };

  React.useEffect(() => {
    var cameraStream = null;
    function stopCameraStream() {
      cameraStream = videoElement?.srcObject;
      console.log(videoElement);
      if (cameraStream)
        cameraStream.getTracks().forEach(function (track) {
          track.stop();
        });
    }
    if (!showQR) stopCameraStream();

    return () => stopCameraStream();
  }, [showQR]);
  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {
        setShowQR(null);
        closeDialog();
      }}
      aria-describedby="alert-dialog-slide-description"
      sx={{ minHeight: "100%" }}
    >
      <DialogTitle>
        <IconButton
          sx={{ position: "absolute", left: "3%", top: "3%", zIndex: 100 }}
          onClick={() => {
            setClicked(false);
            closeDialog();
          }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h6" sx={{ m: "3%", ml: 4 }}>
          Start Riding Now!
        </Typography>
      </DialogTitle>

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
