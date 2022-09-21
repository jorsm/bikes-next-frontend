import {
  Avatar,
  Box,
  CircularProgress,
  Fab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Grid,
} from "@mui/material";
import { useState, useEffect, useMemo, useRef } from "react";
import { MyLocationRounded } from "@mui/icons-material";
import {
  useGoogleMap,
  GoogleMap,
  LoadScriptNext,
  Marker,
} from "@react-google-maps/api";

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
  const [location, setLocation] = useState({
    lat: 45.8866094,
    lng: 10.7299675,
  });

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

  const containerStyle = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  };
  const options = { disableDefaultUI: true };

  return (
    <>
      {loading && (
        <Box sx={style}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <MyLocationFab setLocation={setLocation} />
      <LoadScriptNext
        googleMapsApiKey={"AIzaSyByRWL8jSSw4bcYHcoGKHDwS_rUFyEMtRo"}
      >
        <GoogleMap
          mapContainerClassName="map-continer"
          mapContainerStyle={containerStyle}
          center={location}
          options={options}
          zoom={15}
          clickableIcons={false}
        >
          {/* Child components, such as markers, info windows, etc. */}
          <>
            {stations &&
              stations.map((station) => {
                const { id, bikes, location } = station;
                return (
                  <Marker
                    position={{
                      lat: location.latitude,
                      lng: location.longitude,
                    }}
                  />
                );
              })}
          </>
        </GoogleMap>
      </LoadScriptNext>
      <Box sx={{ display: "flex" }}>
        <Box className="map-continer" />
      </Box>
    </>
  );
}

function Station(props) {
  const { location, bikes } = props;
  return (
    <>
      <ListItem button>
        <ListItemText
          primary={bikes.length + "bikes avaiable here"}
          secondary={JSON.stringify(location)}
        />
      </ListItem>
      <Divider />
    </>
  );
}

const MyLocationFab = ({ setLocation }) => {
  return (
    <Fab
      size="small"
      color="primary"
      aria-label="center position"
      sx={{ position: "absolute", bottom: "19%", right: "8%" }}
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            let { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
          },
          (error) => console.error(error),
          { enableHighAccuracy: true }
        );
      }}
    >
      <MyLocationRounded />
    </Fab>
  );
};
