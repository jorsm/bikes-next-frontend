import { Fab } from "@mui/material";
import { LockOpenRounded } from "@mui/icons-material";
import { useState, useEffect } from "react";
import SignInDialog from "./signInDialog";
import UnlockDialog from "./unlockDialog";
import PaymentDialog from "./paymentDialog";

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
  const [subscription, setSubscription] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  useEffect(() => {
    async function getActiveSubscription() {
      if (user) {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user}`,
          },
        };
        try {
          const response = await fetch(
            process.env.API_URL + "/users/subscription/",
            options
          );
          if (!response) throw new Error("Network Error");
          if (!response?.ok) throw new Error("HTTP Error " + response.status);

          const { subscription } = await response.json();
          return subscription;
        } catch (error) {
          console.error(error);
        }
      }
    }
    getActiveSubscription().then((subscription) => {
      if (subscription) setSubscription(subscription?.toString());
      else setSubscription(null);
    });
  }, [user]);

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
      {user && !subscription && paymentDialogOpen && (
        <PaymentDialog
          closeDialog={() => {
            setPaymentDialogOpen(false);
          }}
          open={setPaymentDialogOpen}
          user={user}
          setSubscription={setSubscription}
          setUnlockDialogOpen={setUnlockDialogOpen}
        />
      )}
      {user && subscription && unlockDialogOpen && (
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
        color="primary"
        variant="extended"
        sx={style}
        onClick={() => {
          if (!user) {
            setSignInDialogOpen(true);
            return;
          }
          if (user && !subscription) {
            setPaymentDialogOpen(true);
            return;
          }
          setUnlockDialogOpen(true);
        }}
      >
        <LockOpenRounded sx={{ mr: 1 }} /> Unlock Bike
      </Fab>
    </>
  );
}
