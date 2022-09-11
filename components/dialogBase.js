import * as React from "react";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LockOpenRounded from "@mui/icons-material/LockOpenRounded";
import { QrReader, UseQrReaderHook } from "react-qr-reader";
import { Fab, FormControl, TextField, DialogTitle } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogBase({ closeDialog, open, title, children }) {
  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeDialog}
      sx={{ minHeight: "100%" }}
    >
      <DialogTitle>
        <IconButton
          sx={{ position: "absolute", left: "3%", top: "3%", zIndex: 100 }}
          onClick={closeDialog}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h6" sx={{ m: "3%", ml: 4 }}>
          {title || ""}
        </Typography>
      </DialogTitle>
      {children}
    </Dialog>
  );
}
