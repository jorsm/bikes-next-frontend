import { useEffect, useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  Typography,
  CardActionArea,
} from "@mui/material";
import DialogBase from "./dialogBase";

export default function PaymentDialog(props) {
  // The default value will be used during pre-rendering and the first render in the browser (hydration)
  // During hydration `useEffect` is called. `window` is available in `useEffect`. In this case because we know
  //we're in the browser checking for window is not needed. If you need to read something from window that is fine.
  // By calling `setButton` in `useEffect` a render is triggered after hydrating, this causes the "browser specific" value
  //to be available.
  const [paypalButton, setPaypalButton] = useState(null);
  const [subscriptionPeriod, setsubscriptionPeriod] = useState("Day");

  const payPalCredentials = {
    sandboxAccountEmail: "sb-f47wqs20698611@personal.example.com",
    sandboxAccountPassword: "<_-3zCK*",
    clientID:
      "AaRJRMeGZjupaPdMC9ogvD2c84Mx5L-D-KHG5TUpltTgn_qIaT2fPg_rtXwIUfidRmFO8hrX-7cmv2La",
  };
  useEffect(
    () =>
      setPaypalButton(
        <Box sx={{ p: 3 }}>
          <PayPalButtons
            style={{
              shape: "pill",
              color: "blue", //black
              layout: "horizontal",
              label: "pay",
              tagline: false,
            }}
          />
        </Box>
      ),
    []
  );
  const createOrder = () => {
    const getNewSubscriptionOrderID = async () => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify({ subscriptionPeriod }),
      };
      try {
        const response = await fetch(
          process.env.API_URL + "/users/subscription/",
          options
        );
        if (!response) throw new Error("Network Error");
        if (!response?.ok) throw new Error("HTTP Error " + response.status);
        const orderId = await response.json().then(({ orderID }) => orderID);
        return orderId;
      } catch (error) {
        console.error(error);
      }
    };
    return getNewSubscriptionOrderID();
  };

  return (
    <DialogBase {...props} title="Sign up and start riding now!">
      <Alert severity="info">
        <AlertTitle>
          Sandbox account for testing: <br></br>
          Email: <b>{payPalCredentials.sandboxAccountEmail} </b>
          <br></br>
          Password: <b>{payPalCredentials.sandboxAccountPassword} </b>
        </AlertTitle>
      </Alert>
      <List>
        <ListItem key="day">
          <SubscriptionCard
            title="Day"
            price="8.95"
            text="Rent up to 5 times in 24 hours"
            onClick={() => setsubscriptionPeriod("Day")}
            selectedPeriod={subscriptionPeriod}
          />
        </ListItem>
        <ListItem key="week">
          <SubscriptionCard
            title="Week"
            price="44.95"
            text="Rent up to 5 times per day for 7 days"
            onClick={() => setsubscriptionPeriod("Week")}
            selectedPeriod={subscriptionPeriod}
          />
        </ListItem>
        <ListItem key="month">
          <SubscriptionCard
            title="Month"
            price="109.95"
            text="Rent up to 5 times per day for 30 days"
            onClick={() => setsubscriptionPeriod("Month")}
            selectedPeriod={subscriptionPeriod}
          />
        </ListItem>
      </List>
      <PayPalScriptProvider
        options={{
          "client-id": payPalCredentials.clientID,
          components: "buttons",
          //intent: "subscription",
          debug: true,
          vault: true,
        }}
        createOrder={createOrder}
        onApprove={function (data, actions) {
          return actions.order.capture().then(function () {
            // transaction completed let the user rent the bike
          });
        }}
      >
        {paypalButton}
      </PayPalScriptProvider>
    </DialogBase>
  );
}

const SubscriptionCard = function ({
  title,
  text,
  price,
  onClick,
  selectedPeriod,
}) {
  const [cardStyle, setCardStyle] = useState({
    m: 3,
    width: "100%",
  });
  useEffect(() => {
    selectedPeriod == title
      ? setCardStyle({ ...cardStyle, borderStyle: "ridge" })
      : setCardStyle({ ...cardStyle, borderStyle: "none" });
  }, [selectedPeriod]);
  return (
    <Card sx={cardStyle}>
      <CardActionArea onClick={onClick}>
        <CardContent sx={{ py: 2 }}>
          <Typography gutterBottom variant="h6" component="div">
            {title}
          </Typography>

          <Typography
            gutterBottom
            variant="h4"
            color="text.secondary"
            component="div"
          >
            <b>€{price}</b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {text}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
