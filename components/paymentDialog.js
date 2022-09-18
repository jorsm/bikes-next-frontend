import { useEffect, useState, useCallback } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
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
  Fab,
  Dialog,
} from "@mui/material";
import DialogBase from "./dialogBase";
import { Stack } from "@mui/system";
import { AlignHorizontalCenter } from "@mui/icons-material";

export default function PaymentDialog(props) {
  const [paypalButton, setPaypalButton] = useState(null);
  const [subscriptionPeriod, setsubscriptionPeriod] = useState("Day");
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  const payPalCredentials = {
    sandboxAccountEmail: "sb-f47wqs20698611@personal.example.com",
    sandboxAccountPassword: "<_-3zCK*",
    clientID:
      "AaRJRMeGZjupaPdMC9ogvD2c84Mx5L-D-KHG5TUpltTgn_qIaT2fPg_rtXwIUfidRmFO8hrX-7cmv2La",
  };

  useEffect(() => {
    setPaypalButton(
      <PayPalButtonWrapper
        subscriptionPeriod={subscriptionPeriod}
        user={props.user}
        setTransactionDialogOpen={setTransactionDialogOpen}
      />
    );
  }, [subscriptionPeriod]);

  return (
    <DialogBase {...props} title="Sign up and start riding now!">
      <Alert severity="info">
        <AlertTitle>
          Sandbox account for testing: <br></br>
          Email: <b>{payPalCredentials.sandboxAccountEmail} </b>
          <br></br>
          Password: <b>{payPalCredentials.sandboxAccountPassword} </b>
          <br></br> other accounts will NOT work
        </AlertTitle>
      </Alert>
      <TransactionComplitionDilog open={transactionDialogOpen} />
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
          currency: "EUR",
        }}
      >
        {!paypalButton && <CircularProgress sx={{ justifySelf: "center" }} />}
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

function PayPalButtonWrapper({
  subscriptionPeriod,
  user,
  setTransactionDialogOpen,
}) {
  let orderID = "";
  let createOrder = () => {
    async function getNewSubscriptionOrderID() {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user}`,
        },
        body: JSON.stringify({ subscriptionPeriod }),
      };
      try {
        setTransactionDialogOpen(true);
        const response = await fetch(
          process.env.API_URL + "/users/subscription/",
          options
        );
        if (!response) throw new Error("Network Error");
        if (!response?.ok) throw new Error("HTTP Error " + response.status);
        return await response.json().then((json) => {
          orderID = json.orderID;
          return json.orderID;
        });
      } catch (error) {
        setTransactionDialogOpen(false);
        console.error(error);
      }
    }
    return getNewSubscriptionOrderID();
  };
  function onApprove(data, actions) {
    async function captureOrder() {
      // transaction completed let the user rent the bike
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
          process.env.API_URL + "/users/subscription/" + orderID,
          options
        );
        if (!response) throw new Error("Network Error");
        if (!response?.ok) throw new Error("HTTP Error " + response.status);
        setTransactionDialogOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
    captureOrder();
  }

  return (
    <Box sx={{ p: 3 }}>
      <PayPalButtons
        style={{
          shape: "pill",
          color: "blue", //black
          layout: "horizontal",
          label: "pay",
          tagline: false,
        }}
        forceReRender={[subscriptionPeriod]}
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </Box>
  );
}

function TransactionComplitionDilog({ open, completed }) {
  return (
    open && (
      <Dialog open={open}>
        <Stack sx={{ p: 3 }}>
          <Box sx={{ display: "flex", mx: "auto", p: 4 }}>
            <CircularProgress />
          </Box>
          <Typography variant="body1" gutterBottom>
            Confirming transaction...
          </Typography>
        </Stack>
      </Dialog>
    )
  );
}
