import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Checkbox from "@mui/material/Checkbox";
import { Stack } from "@mui/system";
import { TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

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
}) {
  //# state
  var [clicked, setClicked] = useState(false);
  var [otp, setOtp] = useState("");
  var [error, setError] = useState(null);
  var [newUser, setNewUser] = useState(null);

  //# api call
  const signIn = async () => {
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
      if (!response) throw new Error("Network Error");
      if (!response?.ok) throw new Error("HTTP Error " + response.status);
      if (response.status == 204) setNewUser(true);
      response.json().then((res) => {
        signInUser(res.token);
        closeDialog();
        console.log(res);
      });
    } catch (error) {
      setError(error.message);
    }
  };
  //# component
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
        <DialogTitle>Enter SMS code</DialogTitle>
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
          {newUser && <PrivacyAndTerms clicked={clicked} />}
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
              "check"
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
      </Dialog>
    </div>
  );
}

function PrivacyAndTerms(clicked) {
  var [termsAccepted, setTermsAccepted] = useState(false);
  return (
    <>
      <Typography align="center" variant="subtitle1" gutterBottom={true}>
        Wolcome! enter the code and get your first hour for free
      </Typography>

      <div>
        <p>
          Accetto{" "}
          <Link href="#" underline="hover">
            Termini & Condizioni
          </Link>{" "}
          <Checkbox
            defaultChecked={false}
            required
            onChange={() => setTermsAccepted(!termsAccepted)}
          />{" "}
        </p>
      </div>
      <Snackbar
        open={clicked && !termsAccepted}
        autoHideDuration={4000}
        message="please accept Terms & Conditions"
        action={
          <Button color="inherit" size="small">
            ok
          </Button>
        }
        sx={{ bottom: { xs: 90, sm: 30 } }}
      />
    </>
  );
}
