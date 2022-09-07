import { Fab } from "@mui/material";
import { LockOpenRounded } from "@mui/icons-material";
import { useState } from "react";
import SignInDialog from "./signInDialog";
import jwtDecode from "jwt-decode";
import UnlockDialog from "./unlockDialog";

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

export default function StartRentButton({ user, setUser, setRent }) {
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);

  const signInUser = function (token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      setUser(token);
      console.log("user signed in: " + token);
    }
  };

  return (
    <>
      {!user && signInDialogOpen && (
        <SignInDialog
          closeDialog={function () {
            setSignInDialogOpen(false);
          }}
          open={signInDialogOpen}
          signInUser={signInUser}
        />
      )}
      {user && unlockDialogOpen && (
        <UnlockDialog
          closeDialog={() => {
            setUnlockDialogOpen(false);
          }}
          open={unlockDialogOpen}
          user={user}
          setRent={setRent}
        />
      )}
      <Fab
        variant="extended"
        sx={style}
        onClick={() => {
          console.log("choosing ialog because " + JSON.stringify(user) + !user);
          if (!user) setSignInDialogOpen(true);
          else setUnlockDialogOpen(true);
        }}
      >
        <LockOpenRounded sx={{ mr: 1 }} /> Unlock Bike
      </Fab>
    </>
  );
}
