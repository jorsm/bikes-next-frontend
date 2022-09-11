import * as React from "react";
import { ArrowBackRounded, Close } from "@mui/icons-material";
import { useState } from "react";
import { Stack } from "@mui/system";
import {
  FormControl,
  Dialog,
  DialogTitle,
  Slide,
  Fab,
  CircularProgress,
  Typography,
  Link,
  IconButton,
  TextField,
  Divider,
  Alert,
  AlertTitle,
  Snackbar,
} from "@mui/material";

import { StatusCodes } from "http-status-codes";
import DialogBase from "./dialogBase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const style = { bottom: { xs: 30, sm: 0 }, margin: "10%", p: 3, width: 0.8 };

export default function OtpDialog({
  open,
  closeDialog,
  signInUser,
  retryOtp,
  phone,
  correctOtp,
}) {
  //# state
  var [clicked, setClicked] = useState(false);
  var [otp, setOtp] = useState("");
  var [error, setError] = useState(null);
  var [newUser, setNewUser] = useState(true);

  //# api call
  const signIn = async () => {
    if (otp.length != 6) {
      setError("Please enter the 6 digits code received via SMS");
      return;
    }
    setClicked(true);

    let _phone = phone.startsWith("+") ? phone : "+" + phone;
    let reqBody = { otp, phone: _phone };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    };
    try {
      const response = await fetch(
        process.env.API_URL + "/users/verify",
        options
      );
      if (!response) setError("Network Error");
      if (!response?.ok) {
        console.error("HTTP Error " + response.status);
        if (response.status == StatusCodes.UNAUTHORIZED)
          //Unauthorized
          setError(
            "code NOT valid, please retry or click con the link to receive a new one"
          );
        setClicked(false);
        return;
      }
      if (response.status != StatusCodes.CREATED) setNewUser(false);
      response.json().then((res) => {
        if (res.token) {
          signInUser(res.token);
          closeDialog();
        } else {
          setError(
            "Something went wrong, can't authenticate user please retry"
          );
          setClicked(false);
          return;
        }
        console.log(res);
      });
    } catch (error) {
      setError(error.message);
      setClicked(false);
      return;
    }
  };
  let dialogProps = { open, closeDialog, title: "Enter SMS code" };
  //# component
  return (
    <div>
      <DialogBase {...dialogProps}>
        {error && (
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setError(null);
                }}
              >
                <Close fontSize="inherit" />
              </IconButton>
            }
          >
            {error.toString()}
          </Alert>
        )}
        <Alert severity="info">
          <AlertTitle>SMS Received:</AlertTitle>
          your OTP code is {correctOtp}
        </Alert>
        <Stack sx={{ p: 2, mt: 4 }}>
          <FormControl>
            <TextField
              label="Required"
              placeholder="SMS code received..."
              type="number"
              onChange={(event) => setOtp(event.target.value)}
              value={otp}
              variant="standard"
              sx={{ mb: 4, mt: 4 }}
            />
          </FormControl>
          {newUser && <PrivacyAndTerms />}
          <Divider sx={{ pt: 1, pb: 1 }} />
          <Typography align="center" variant="subtitle2" gutterBottom={true}>
            if you did not receive the code{" "}
            <Link href="#" underline="hover" onClick={retryOtp}>
              click here
            </Link>{" "}
            to retry
          </Typography>

          <Fab
            variant="extended"
            sx={style}
            disabled={clicked}
            onClick={signIn}
          >
            {!clicked ? (
              "check OTP"
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
                checking...
              </>
            )}
          </Fab>
        </Stack>
      </DialogBase>
    </div>
  );
}

function PrivacyAndTerms() {
  return (
    <>
      <Typography align="center" variant="subtitle2" gutterBottom={true}>
        by clicking on the button below you are <b>accepting</b> our{" "}
        <Link href="#" underline="hover">
          Terms & Conditions
        </Link>{" "}
      </Typography>
    </>
  );
}
