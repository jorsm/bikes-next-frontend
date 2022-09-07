import * as React from "react";
import { useState } from "react";
import {
  FormControl,
  Dialog,
  DialogTitle,
  Slide,
  Fab,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Stack } from "@mui/system";

import OtpDialog from "./otpDialog";

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
  var [correctOtp, setCorrectOtp] = useState(null);
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
        console.log("getting JSON from res...");
        let resJson = await response.json();
        if (resJson.otp) setCorrectOtp(resJson.otp);
        console.log(correctOtp);
        setOtpDialogOpen(true);
      } catch (error) {
        console.error(error.message);
      }
      return;
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
          <DialogTitle align="center" gutterBottom={true}>
            Welcome! sign up and ride up to <b>one hour for free </b>
          </DialogTitle>

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
      {clicked && correctOtp && (
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
          correctOtp={correctOtp}
        />
      )}
    </div>
  );
}
