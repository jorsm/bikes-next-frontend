import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Checkbox from "@mui/material/Checkbox";
import { Stack } from "@mui/system";
import { Divider, TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import OtpDialog from "./OtpDialog";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const style = {
  position: "absolute",
  bottom: { xs: 60, sm: 0 },

  p: 3,
  width: "80%",
  left: "10%",
  right: "10%",
};

export default function SignInDialog({ open, closeDialog, signInUser }) {
  var [clicked, setClicked] = useState(false);

  var [phone, setPhone] = useState("");
  var [error, setError] = useState(null);
  var [otpDialogOpen, setOtpDialogOpen] = useState(false);

  const getOtp = () => {
    const getOTP = async () => {
      setClicked(true);
      if (!phone.startsWith("+")) phone = "+" + phone.toString();
      let reqBody = { phone };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      };
      try {
        const response = await fetch(
          process.env.API_URL + "/users/sign-in",
          options
        );
        if (!response) throw new Error("Network Error");
        if (!response?.ok) throw new Error("HTTP Error " + response.status);

        setOtpDialogOpen(true);
        console.log(response);
      } catch (error) {
        console.error(error.message);
      }
    };
    getOTP();
  };

  return (
    <div>
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
        <Stack sx={{ p: 3, mt: 6 }}>
          <p>sign up with your phone number* to get one hour free </p>

          <FormControl sx={{ mb: 4, mt: 4 }}>
            <TextField
              focused={true}
              required
              label="Phone"
              placeholder="Please fill in your number..."
              type="number"
              onChange={(event) => setPhone(event.target.value)}
              value={phone}
              variant="standard"
              prefix="+"
            />
          </FormControl>
          <Divider />
          <Divider />
          <Fab
            variant="extended"
            sx={style}
            disabled={clicked}
            onClick={getOtp}
          >
            {!clicked ? (
              "send code"
            ) : (
              <>
                <CircularProgress
                  size={38}
                  sx={{
                    position: "absolute",
                    bottom: "3%",
                    zIndex: 1,
                  }}
                />{" "}
                sending code
              </>
            )}
          </Fab>
        </Stack>
      </Dialog>
      {clicked && (
        <OtpDialog
          keepMounted
          open={otpDialogOpen}
          closeDialog={() => {
            closeDialog();
            setOtpDialogOpen(false);
          }}
          signInUser={signInUser}
          retryOtp={getOtp}
          phone={phone}
        />
      )}
    </div>
  );
}
