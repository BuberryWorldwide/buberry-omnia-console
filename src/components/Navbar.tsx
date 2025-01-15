import React, { useState, useEffect } from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import HBARLogo from "../assets/omnia_ascii_logo.png";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { WalletSelectionDialog } from "./WalletSelectionDialog";

const treasuryAccountId = "0.0.5303815"; // Replace with your treasury account ID

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
    } else {
      setOpen(true);
    }
  };

  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId]);

  return (
    <AppBar position="relative" sx={{ backgroundColor: "#000000", padding: "4px" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src={HBARLogo} alt="Logo" className="hbarLogoImg" style={{ height: "50px" }} />
        </Box>

        {/* Centered Navigation */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px 16px",
            borderRadius: "8px",
            margin: "auto",
            maxWidth: "80%",
          }}
        >
          <Button
            component={NavLink}
            to="/"
            sx={buttonLinkStyles}
          >
            Home
          </Button>
          <Button
            component={NavLink}
            to="/about"
            sx={buttonLinkStyles}
          >
            About
          </Button>
          <Button
            component={NavLink}
            to="/balance"
            sx={buttonLinkStyles}
          >
            Token Management
          </Button>
          <Button
            component={NavLink}
            to="/nfts"
            sx={buttonLinkStyles}
          >
            Card Vault
          </Button>
          <Button
            component={NavLink}
            to="/staking"
            sx={buttonLinkStyles}
          >
            Staking Panel
          </Button>
        </Box>

        {/* Wallet Connect Button */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#00FF00",
              color: "#000",
              "&:hover": { backgroundColor: "#00CC00" },
            }}
            onClick={handleConnect}
          >
            {accountId ? `Connected: ${accountId}` : "Connect Wallet"}
          </Button>

          {/* Dropdown Menu for Treasury Account */}
          {accountId === treasuryAccountId && (
            <>
              <Button
                variant="outlined"
                sx={{
                  marginLeft: "16px",
                  backgroundColor: "#FFFFFF",
                  color: "#000",
                }}
                onClick={handleDropdownOpen}
              >
                Treasury Menu
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleDropdownClose}
              >
                <MenuItem component={NavLink} to="/metadata-creator">
                  Metadata Creator
                </MenuItem>
                <MenuItem component={NavLink} to="/nft-creator">
                  NFT Creator
                </MenuItem>
                <MenuItem component={NavLink} to="/minting-tool">
                  Minting Tool
                </MenuItem>
                <MenuItem component={NavLink} to="/burning-tool">
                  Token Burning Tool
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>

      <WalletSelectionDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} />
    </AppBar>
  );
}

// Custom styles for button links
const buttonLinkStyles = {
  margin: "0 12px",
  textDecoration: "none",
  color: "#00FF00",
  fontFamily: "Courier New, monospace",
  fontSize: "0.8rem",
  border: "1px solid rgba(0, 255, 0, 0.7)",
  borderRadius: "4px",
  padding: "6px 12px",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  transition: "transform 0.1s ease, font-size 0.1s ease",
  "&.active": {
    textDecoration: "underline",
    color: "#00CC00"
  },
  "&:hover": {
    transform: "scale(0.9)",
    fontSize: "0.9rem",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
};
