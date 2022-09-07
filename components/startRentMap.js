import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useState, useEffect } from "react";
import LocalParkingRoundedIcon from "@mui/icons-material/LocalParkingRounded";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  bgcolor: "background.paper",
};

export default function StartRentMap() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      let reqBody = {
        radius: 10000,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      };
      try {
        const response = await fetch(
          process.env.API_URL + "/stations",
          options
        );
        if (!response) throw new Error("Network Error");
        if (!response?.ok) throw new Error("HTTP Error " + response.status);
        const stations = await response.json();
        setStations(stations);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setStations(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStations().catch(console.error);
  }, []);

  return (
    <List component="nav" aria-label="stations">
      {loading && (
        <Box sx={style}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      {stations &&
        stations.map((station) => {
          const { id, bikes, location } = station;
          console.log(station);
          return <Station bikes={bikes} key={id} location={location} />;
        })}
    </List>
  );
}

function Station(props) {
  const { location, bikes } = props;
  return (
    <>
      <ListItem button>
        <ListItemAvatar>
          <Avatar>
            <LocalParkingRoundedIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={bikes.length + "bikes avaiable here"}
          secondary={JSON.stringify(location)}
        />
      </ListItem>
      <Divider />
    </>
  );
}
