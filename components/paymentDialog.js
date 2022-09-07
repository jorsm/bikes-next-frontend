// In order to prevent the first render from being different you can use `useEffect` which is only executed
// in the browser and is executed during hydration
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PaymentDialog() {
  // The default value is 'blue', it will be used during pre-rendering and the first render in the browser (hydration)
  const [paypalButton, setPaypalButton] = useState(null);
  // During hydration `useEffect` is called. `window` is available in `useEffect`. In this case because we know
  //we're in the browser checking for window is not needed. If you need to read something from window that is fine.
  // By calling `setButton` in `useEffect` a render is triggered after hydrating, this causes the "browser specific" value
  //to be available.
  useEffect(
    () => setPaypalButton(<PayPalButtons style={{ layout: "horizontal" }} />),
    []
  );

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AaRJRMeGZjupaPdMC9ogvD2c84Mx5L-D-KHG5TUpltTgn_qIaT2fPg_rtXwIUfidRmFO8hrX-7cmv2La",
        debug: true,
        vault: true,
        "data-client-token": user,
      }}
    ></PayPalScriptProvider>
  );
}
