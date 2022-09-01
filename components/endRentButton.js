import { Fab } from "@mui/material";
import { LockRounded } from "@mui/icons-material";
import { useState } from "react";

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

export default function EndRentButton({ user, rent, setRent }) {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false);

  const endRent = async function () {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user}`,
      },
    };
    try {
      console.log(JSON.stringify(JSON.stringify(rent)));
      const response = await fetch(
        process.env.API_URL + "/bikes/return/" + rent.toString(),
        options
      );
      if (!response) throw new Error("Network Error");
      if (!response?.ok) throw new Error("HTTP Error " + response.status);

      console.log("rent ended ");
      setRent(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Fab variant="extended" sx={style} onClick={endRent}>
        <LockRounded sx={{ mr: 1 }} /> Lock Bike
      </Fab>
    </>
  );
}
