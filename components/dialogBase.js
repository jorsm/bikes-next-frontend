import * as React from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Close from "@mui/icons-material/Close";
import {
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogBase({
  closeDialog,
  open,
  title,
  children,
  error,
}) {
  const [errorText, setErrorText] = React.useState(null);
  React.useEffect(() => {
    setErrorText(error);
  }, [error]);
  return (
    <Dialog
      fullScreen
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeDialog}
      sx={{ minHeight: "100%" }}
    >
      <DialogTitle>
        <IconButton
          sx={{ position: "absolute", left: "3%", top: "3%", zIndex: 100 }}
          onClick={closeDialog}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h6" sx={{ m: "3%", ml: 4 }}>
          {title || ""}
        </Typography>
      </DialogTitle>
      {errorText && (
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setErrorText(null);
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          {error.toString()}
        </Alert>
      )}
      {children}
    </Dialog>
  );
}
