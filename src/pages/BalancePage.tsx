import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Client,
  AccountBalanceQuery,
  AccountId,
  TokenId,
} from "@hashgraph/sdk";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";

const BalancePage: React.FC = () => {
  const { walletInterface, accountId } = useWalletInterface();

  // State Definitions
  // State Definitions
const [hbarBalance, setHbarBalance] = useState<number | null>(null);
const [availableTokens, setAvailableTokens] = useState<any[]>([]);
const [hiddenTokens, setHiddenTokens] = useState<string[]>([]);
const [showHidden, setShowHidden] = useState(false);

// Modal States
const [isAssociateModalOpen, setIsAssociateModalOpen] = useState(false);
const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

// Token Transfer States
const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
const [transferAmount, setTransferAmount] = useState<number>(0);
const [recipientId, setRecipientId] = useState<string>("");
const [isNonFungible, setIsNonFungible] = useState(false); // For NFT
const [serialNumber, setSerialNumber] = useState<number | null>(null); // For NFT serial

// Token Association State
const [tokenIdToAssociate, setTokenIdToAssociate] = useState<string>("");

// Sorting State
const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
  key: "info.name",
  direction: "asc",
});

const saveTokensToServer = async (tokens: any[]) => {
  try {
    await fetch("/api/save-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens }),
    });
    console.log("Tokens saved successfully.");
  } catch (error) {
    console.error("Error saving tokens:", error);
  }
};

// Fetch Balances
const fetchBalances = async () => {
  if (!accountId) return;

  try {
    const client = Client.forTestnet();
    const balance = await new AccountBalanceQuery()
      .setAccountId(AccountId.fromString(accountId))
      .execute(client);
    setHbarBalance(balance.hbars.toTinybars() / 1e8);

    const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
    const tokens = await mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(
      AccountId.fromString(accountId)
    );

    // Categorize tokens (check if they are fungible or non-fungible)
    const categorizedTokens = tokens.map((token: any) => ({
      ...token,
      isNonFungible: token.info.type === "NON_FUNGIBLE_UNIQUE",
    }));

    // Update local state with tokens
    setAvailableTokens(categorizedTokens);

    // Save tokens to the server
    await saveTokensToServer(categorizedTokens);
  } catch (error) {
    console.error("Error fetching balances:", error);
  }
};


useEffect(() => {
  fetchBalances();
}, [accountId]);


// Sort Tokens
const handleSort = (key: string) => {
  setSortConfig((prev) => ({
    key,
    direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
  }));
};

// Derived Array for Hidden Tokens
const hiddenTokenList = availableTokens.filter((token: any) =>
  hiddenTokens.includes(token.token_id)
);

// Toggle Hidden Tokens
const toggleShowHidden = () => {
  setShowHidden((prev) => !prev);
};

// Toggle Token Visibility
const toggleTokenVisibility = (tokenId: string) => {
  setHiddenTokens((prev) =>
    prev.includes(tokenId) ? prev.filter((id) => id !== tokenId) : [...prev, tokenId]
  );
};

// Token Association
const handleTokenAssociation = async () => {
  if (!walletInterface || !tokenIdToAssociate) {
    alert("Invalid Token ID.");
    return;
  }

  try {
    await walletInterface.associateToken(TokenId.fromString(tokenIdToAssociate));
    alert(`Token ${tokenIdToAssociate} associated successfully!`);
    setTokenIdToAssociate("");
    setIsAssociateModalOpen(false);
  } catch (error) {
    console.error("Error associating token:", error);
    alert("Token association failed.");
  }
};

// Token Transfer
const handleTokenTransfer = async () => {
  if (!walletInterface || !selectedTokenId || !recipientId) {
    alert("Invalid transfer parameters.");
    return;
  }

  const selectedToken = availableTokens.find((token: any) => token.token_id === selectedTokenId);
  if (!selectedToken) {
    alert("Token not found.");
    return;
  }

  try {
    if (isNonFungible) {
      if (!serialNumber) {
        alert("Serial number is required for NFT transfers.");
        return;
      }
      await walletInterface.transferNonFungibleToken(
        AccountId.fromString(recipientId),
        TokenId.fromString(selectedTokenId),
        serialNumber
      );
      alert(`Successfully transferred NFT ${selectedTokenId} (Serial: ${serialNumber}) to ${recipientId}.`);
    } else {
      const decimals = Number(selectedToken.info.decimals);
      const amountWithDecimals = transferAmount * Math.pow(10, decimals);
      await walletInterface.transferFungibleToken(
        AccountId.fromString(recipientId),
        TokenId.fromString(selectedTokenId),
        amountWithDecimals
      );
      alert(`Successfully transferred ${transferAmount} of token ${selectedTokenId} to ${recipientId}.`);
    }
    setIsTransferModalOpen(false);
  } catch (error) {
    console.error("Error transferring tokens:", error);
    alert("Token transfer failed.");
  }
};

  



  const sortedTokens = [...availableTokens]
  .filter((token) => !hiddenTokens.includes(token.token_id))
  .sort((a, b) => {
    const aValue = sortConfig.key.split(".").reduce((obj: any, key: string) => obj[key], a);
    const bValue = sortConfig.key.split(".").reduce((obj: any, key: string) => obj[key], b);

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });



  // Page Layout
return (
  <Box p={4}>
    {/* Page Title */}
    <Typography variant="h4" mb={3}>
      Token Management
    </Typography>

    {/* Display HBAR Balance */}
    <Typography variant="h6" mb={2}>
      HBAR Balance: {hbarBalance !== null ? `${hbarBalance} ℏ` : "Loading..."}
    </Typography>

    {/* Buttons for Modals */}
    <Box mb={3} display="flex" justifyContent="space-between">
      <Button
        variant="contained"
        onClick={() => setIsAssociateModalOpen(true)}
        sx={{ backgroundColor: "#00ff00", color: "#000", textTransform: "none" }}
      >
        Associate Token
      </Button>

      <Button
    variant="contained"
    onClick={fetchBalances}
    sx={{ backgroundColor: "#00ff00", color: "#000", textTransform: "none" }}
  >
    Refresh Balances
  </Button>

      <Button
        variant="contained"
        onClick={() => setIsTransferModalOpen(true)}
        sx={{ backgroundColor: "#00ff00", color: "#000", textTransform: "none" }}
      >
        Transfer Tokens
      </Button>
    </Box>
    <Box display="flex" justifyContent="space-between" mb={3}>

</Box>


    {/* Token Table */}
    <TableContainer component={Paper} sx={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell onClick={() => handleSort("info.name")} sx={{ cursor: "pointer", color: "#00ff00" }}>
              Token Name {sortConfig.key === "info.name" && (sortConfig.direction === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell onClick={() => handleSort("token_id")} sx={{ cursor: "pointer", color: "#00ff00" }}>
              Token ID {sortConfig.key === "token_id" && (sortConfig.direction === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell onClick={() => handleSort("balance")} sx={{ cursor: "pointer", color: "#00ff00" }}>
              Balance {sortConfig.key === "balance" && (sortConfig.direction === "asc" ? "▲" : "▼")}
            </TableCell>
            <TableCell sx={{ color: "#00ff00" }}>Type</TableCell>
            <TableCell sx={{ color: "#00ff00" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedTokens.map((token: any) => (
            <TableRow key={token.token_id}>
              <TableCell>{token.info.name}</TableCell>
              <TableCell>{token.token_id}</TableCell>
              <TableCell>
                {token.isNonFungible
                  ? token.balance
                  : token.balance / Math.pow(10, Number(token.info.decimals))}
              </TableCell>
              <TableCell>{token.isNonFungible ? "Non-Fungible" : "Fungible"}</TableCell>
              <TableCell>
                <Button
                  variant="text"
                  onClick={() => toggleTokenVisibility(token.token_id)}
                  sx={{ color: "#00ff00" }}
                >
                  {hiddenTokens.includes(token.token_id) ? "Unhide" : "Hide"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* Toggle Hidden Tokens */}
    <Box mt={3}>
      <Button
        variant="contained"
        onClick={toggleShowHidden}
        sx={{ backgroundColor: "#00ff00", color: "#000", textTransform: "none" }}
      >
        {showHidden ? "Hide Hidden Tokens" : "Show Hidden Tokens"}
      </Button>
    </Box>

    {/* Hidden Tokens */}
    <Collapse in={showHidden}>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token Name</TableCell>
              <TableCell>Token ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hiddenTokenList.map((token: any) => (
              <TableRow key={token.token_id}>
                <TableCell>{token.info.name}</TableCell>
                <TableCell>{token.token_id}</TableCell>
                <TableCell>{token.isNonFungible ? "Non-Fungible" : "Fungible"}</TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    onClick={() => toggleTokenVisibility(token.token_id)}
                    sx={{ color: "#00ff00" }}
                  >
                    Unhide
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Collapse>

    {/* Associate Token Modal */}
    <Dialog open={isAssociateModalOpen} onClose={() => setIsAssociateModalOpen(false)}>
      <DialogTitle>Associate Token</DialogTitle>
      <DialogContent>
        <TextField
          label="Token ID"
          value={tokenIdToAssociate}
          onChange={(e) => setTokenIdToAssociate(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsAssociateModalOpen(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleTokenAssociation}
          sx={{ backgroundColor: "#00ff00", color: "#000" }}
        >
          Associate
        </Button>
      </DialogActions>
    </Dialog>

    {/* Transfer Tokens Modal */}
    <Dialog open={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)}>
      <DialogTitle>Transfer Tokens</DialogTitle>
      <DialogContent>
        <TextField
          label="Select Token"
          select
          value={selectedTokenId || ""}
          onChange={(e) => {
            const token = availableTokens.find((t: any) => t.token_id === e.target.value);
            setSelectedTokenId(e.target.value);
            setIsNonFungible(token?.isNonFungible || false);
          }}
          fullWidth
          sx={{ mt: 2 }}
        >
          {availableTokens.map((token: any) => (
            <MenuItem key={token.token_id} value={token.token_id}>
              {token.info.name} ({token.token_id})
            </MenuItem>
          ))}
        </TextField>
        {isNonFungible ? (
          <TextField
            label="Serial Number"
            type="number"
            value={serialNumber || ""}
            onChange={(e) => setSerialNumber(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
          />
        ) : (
          <TextField
            label="Amount"
            type="number"
            value={transferAmount || ""}
            onChange={(e) => setTransferAmount(Number(e.target.value))}
            fullWidth
            sx={{ mt: 2 }}
          />
        )}
        <TextField
          label="Recipient Account ID"
          value={recipientId || ""}
          onChange={(e) => setRecipientId(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsTransferModalOpen(false)}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleTokenTransfer}
          sx={{ backgroundColor: "#00ff00", color: "#000" }}
        >
          Transfer
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);

};

export default BalancePage;
