import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { WalletSelectionDialog } from "../components/WalletSelectionDialog";

export default function Home() {
  const { accountId } = useWalletInterface(); // No need to reference walletInterface directly here
  const [systemStatus, setSystemStatus] = useState("OFFLINE");
  const [dialogOpen, setDialogOpen] = useState(false); // State for WalletSelectionDialog

  useEffect(() => {
    setSystemStatus(accountId ? "ONLINE" : "OFFLINE");
  }, [accountId]);

  const handleOpenWalletDialog = () => {
    setDialogOpen(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "transparent",
        backgroundImage: `
          linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)),
          url('./assets/background2.png')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "Courier New, monospace",
        color: "#00ff00",
      }}
    >
      {/* Main content container */}
      <Box
        className="home-page"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography
          className="welcome-sign"
          variant="h4"
          sx={{
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {`WELCOME TO OMNIA`}
        </Typography>
        <Typography
          sx={{
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {`System Status: ${systemStatus}`}
        </Typography>
        {!accountId ? (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#00FF00",
              color: "#000",
              fontFamily: "Courier New, monospace",
              textTransform: "none",
              "&:hover": { backgroundColor: "#00CC00" },
            }}
            onClick={handleOpenWalletDialog}
          >
            Connect Wallet
          </Button>
        ) : (
          <Typography
            sx={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            {`Account: ${accountId} - Link Established`}
          </Typography>
        )}
      </Box>

      {/* Wallet Selection Dialog */}
      <WalletSelectionDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Box>
  );
}