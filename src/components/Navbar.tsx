import React, { useState, useEffect } from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Box,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import HBARLogo from "../assets/omnia_ascii_logo.png";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { WalletSelectionDialog } from "./WalletSelectionDialog";
import { MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { AccountId } from "@hashgraph/sdk";
import { appConfig } from "../config";

const treasuryAccountId = "0.0.5303815"; // Replace with your treasury account ID
const waterTokenId = "0.0.5422325";
const carbonTokenId = "0.0.5422329";
const sustainabilityTokenId = "0.0.5422342";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tokenBalances, setTokenBalances] = useState({
    water: 0,
    carbon: 0,
    sustainability: 0,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const fetchTokenBalances = async () => {
    if (!accountId) {
      console.warn("Account ID is null. Cannot fetch token balances.");
      return;
    }

    try {
      const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
      const accountBalances = await mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(
        AccountId.fromString(accountId)
      );

      const waterBalance =
        accountBalances.find((b) => b.token_id === waterTokenId)?.balance || 0;
      const carbonBalance =
        accountBalances.find((b) => b.token_id === carbonTokenId)?.balance || 0;
      const sustainabilityBalance =
        accountBalances.find((b) => b.token_id === sustainabilityTokenId)?.balance || 0;

      setTokenBalances({
        water: waterBalance,
        carbon: carbonBalance,
        sustainability: sustainabilityBalance,
      });
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
      fetchTokenBalances();
    } else {
      setTokenBalances({ water: 0, carbon: 0, sustainability: 0 });
    }
  }, [accountId]);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar position="relative" sx={{ backgroundColor: "#000000", padding: "4px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={HBARLogo} alt="Logo" className="hbarLogoImg" style={{ height: "50px" }} />
          </Box>

          {/* Desktop Navigation (Hidden on Small Screens) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button component={NavLink} to="/" sx={buttonLinkStyles}>
              Home
            </Button>
            <Button component={NavLink} to="/about" sx={buttonLinkStyles}>
              About
            </Button>
            <Button component={NavLink} to="/balance" sx={buttonLinkStyles}>
              Token Management
            </Button>
            <Button component={NavLink} to="/nfts" sx={buttonLinkStyles}>
              Card Vault
            </Button>
            <Button component={NavLink} to="/staking" sx={buttonLinkStyles}>
              Staking Panel
            </Button>
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>

          {/* Token Balances (Hidden on Mobile) */}
          {accountId && (
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", marginRight: "16px" }}>
              <Typography sx={{ marginRight: "16px", color: "#00FF00", fontFamily: "Courier New, monospace" }}>
                Water: {tokenBalances.water} | Carbon: {tokenBalances.carbon} | Sustainability: {tokenBalances.sustainability}
              </Typography>
            </Box>
          )}

          {/* Wallet Connect Button */}
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
                sx={{ marginLeft: "16px", backgroundColor: "#FFFFFF", color: "#000" }}
                onClick={handleDropdownOpen}
              >
                Treasury Menu
              </Button>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleDropdownClose}>
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
        </Toolbar>

        <WalletSelectionDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} />
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={toggleMobileMenu}>
        <Box sx={{ width: 250 }}>
          <List>
            <ListItem button component={NavLink} to="/" onClick={toggleMobileMenu}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={NavLink} to="/about" onClick={toggleMobileMenu}>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem button component={NavLink} to="/balance" onClick={toggleMobileMenu}>
              <ListItemText primary="Token Management" />
            </ListItem>
            <ListItem button component={NavLink} to="/nfts" onClick={toggleMobileMenu}>
              <ListItemText primary="Card Vault" />
            </ListItem>
            <ListItem button component={NavLink} to="/staking" onClick={toggleMobileMenu}>
              <ListItemText primary="Staking Panel" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
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
  "&.active": {
    textDecoration: "underline",
    color: "#00CC00",
  },
};

