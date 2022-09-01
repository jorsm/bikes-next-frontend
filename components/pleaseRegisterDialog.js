import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Fab from "@mui/material/Fab";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import SubmitPhoneDialog from "./submitPhoneDialog";
import { useState } from "react";
import { Link, Typography } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const style = {
  bottom: "3%",
  margin: "10%",
  p: 3,
  width: 0.8,
};

export default function PleaseRegisterDialog({ open, closeDialog }) {
  var [submitPhoneOpen, setSubmitPhoneOpen] = useState(true);

  const clickHandler = () => {
    closeDialog();
    setSubmitPhoneOpen(true);
  };
  return (
    <div>
      <SubmitPhoneDialog
        open={submitPhoneOpen}
        closeDialog={() => setSubmitPhoneOpen(false)}
      />
    </div>
  );
}
