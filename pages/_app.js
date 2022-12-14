import { CssBaseline, Box } from "@mui/material";

import MainAppBar from "../components/mainAppBar";
import StartRentButton from "../components/startRentButton";
import EndRentButton from "../components/endRentButton";
import StartRentMap from "../components/startRentMap";

import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(() => {
    let user = null;
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      if (savedToken) user = savedToken;
    }
    return user;
  });

  const [rent, setRent] = useState(null);

  useEffect(() => {
    async function getActiveRent() {
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
            process.env.API_URL + "/users/rent/",
            options
          );
          if (!response) throw new Error("Network Error");
          if (!response?.ok) throw new Error("HTTP Error " + response.status);

          const { rent } = await response.json();
          return rent;
        } catch (error) {
          console.error(error);
        }
      }
    }
    getActiveRent().then((rent) => {
      if (rent) setRent(rent?.toString());
      else setRent(null);
    });
  }, [user]);
  return (
    <>
      <CssBaseline />

      <MainAppBar
        logout={() => {
          setUser(null);
          setRent(null);
        }}
        user={user}
      />

      <Box>
        {!rent && (
          <>
            <StartRentMap />
            <StartRentButton user={user} setUser={setUser} setRent={setRent} />
          </>
        )}
        {rent && (
          <>
            <p>other map showing stations avaiable for return</p>
            <EndRentButton user={user} rent={rent} setRent={setRent} />
          </>
        )}
      </Box>
    </>
  );
}

export default App;
