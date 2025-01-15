import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { Client, TokenCreateTransaction, TokenType, TokenSupplyType, PrivateKey } from "@hashgraph/sdk";
import { useWalletInterface } from "../services/wallets/useWalletInterface";

const API_URL = "http://localhost:3001/nft"; // Adjusted for NFT creation

const TokenCreationTool: React.FC = () => {
  const { accountId } = useWalletInterface();

  // States for token creation
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [tokenMemo, setTokenMemo] = useState<string>("");
  const [supplyType, setSupplyType] = useState<string>("Infinite");
  const [tokenType, setTokenType] = useState<string>("NFT");
  const [decimals, setDecimals] = useState<number>(0);
  const [initialSupply, setInitialSupply] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // States for fetched records and sorting
  const [tokenRecords, setTokenRecords] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // States for supply key handling
  const [supplyKey, setSupplyKey] = useState<string | null>(
    process.env.REACT_APP_MY_SUPPLY_KEY || process.env.REACT_APP_SUPPLY_KEY || null
  );
  const [manualEntry, setManualEntry] = useState<boolean>(!supplyKey);
  const [manualSupplyKey, setManualSupplyKey] = useState<string>("");

  // Validate Supply Key
  const validateSupplyKey = (): boolean => {
    try {
      PrivateKey.fromString(supplyKey || manualSupplyKey);
      return true;
    } catch (error) {
      alert("Invalid Supply Key. Please provide a valid key.");
      return false;
    }
  };

  // Fetch Token Records
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(`${API_URL}-records`); // Adjusted endpoint for fetching
        setTokenRecords(response.data);
      } catch (error) {
        console.error("Error fetching token records:", error);
        setFetchError("Failed to load token records. Please try again later.");
      }
    };

    fetchRecords();
  }, []);

  // Handle Manual Supply Key Entry
  const handleManualEntry = () => {
    if (!manualSupplyKey.trim()) {
      alert("Supply Key cannot be empty.");
      return;
    }

    try {
      PrivateKey.fromString(manualSupplyKey);
      setSupplyKey(manualSupplyKey);
      setManualEntry(false);
    } catch (error) {
      alert("Invalid Supply Key.");
    }
  };

  // Create Token
  const createToken = async () => {
    if (!accountId) {
      alert("Please connect your wallet first.");
      return;
    }
  
    // Validate required fields
    if (!tokenName.trim() || !tokenSymbol.trim() || !tokenMemo.trim()) {
      alert("Token Name, Symbol, and Memo cannot be empty.");
      return;
    }
  
    if (!validateSupplyKey()) return;
  
    setIsLoading(true);
  
    try {
      const client = Client.forTestnet();
      client.setOperator(accountId, PrivateKey.fromString(process.env.REACT_APP_MY_PRIVATE_KEY!));
  
      const transaction = new TokenCreateTransaction()
        .setTokenName(tokenName)
        .setTokenSymbol(tokenSymbol)
        .setTokenMemo(tokenMemo)
        .setTokenType(tokenType === "NFT" ? TokenType.NonFungibleUnique : TokenType.FungibleCommon)
        .setSupplyType(supplyType === "Infinite" ? TokenSupplyType.Infinite : TokenSupplyType.Finite)
        .setTreasuryAccountId(accountId)
        .setSupplyKey(PrivateKey.fromString(supplyKey || manualSupplyKey));
  
      if (tokenType === "FT") {
        transaction.setDecimals(decimals).setInitialSupply(initialSupply);
      }
  
      const response = await transaction.execute(client);
      const receipt = await response.getReceipt(client);
  
      const newTokenId = receipt.tokenId?.toString() || "Unknown";
  
      // Construct new record with validated fields
      const newRecord = {
        tokenId: newTokenId,
        tokenName: tokenName.trim(),
        tokenSymbol: tokenSymbol.trim(),
        tokenMemo: tokenMemo.trim(),
        tokenType,
        supplyType,
        creationDate: new Date().toISOString(),
      };
  
      // Save new record to backend
      await axios.post(API_URL, newRecord);
  
      setTokenRecords((prevRecords) => [...prevRecords, newRecord]);
      alert(`Token created successfully! Token ID: ${newTokenId}`);
    } catch (error) {
      console.error("Error creating token:", error);
      alert("Failed to create token. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sorting Logic
  const handleSort = (key: string) => {
  let direction: "asc" | "desc" = "asc";

  if (sortConfig?.key === key && sortConfig.direction === "asc") {
    direction = "desc";
  }

  setSortConfig({ key, direction });

  const sortedRecords = [...tokenRecords].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === undefined || bValue === undefined) return 0;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (key === "creationDate") {
      const dateA = new Date(aValue).getTime();
      const dateB = new Date(bValue).getTime();
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    return 0;
  });

  setTokenRecords(sortedRecords);
};

  

  const getSortArrow = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };
  

  // Delete Token Record
  const deleteToken = async (recordId: string | undefined) => {
    if (!recordId) {
      alert("Invalid token ID. Cannot delete.");
      return;
    }
  
    try {
      await axios.delete(`${API_URL}-records/${recordId}`);
      setTokenRecords((prevRecords) =>
        prevRecords.filter((record) => record.id !== recordId)
      );
      alert("Token deleted successfully!");
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Failed to delete token. Check console for details.");
    }
  };
  

  const confirmDelete = (record: any) => {
    if (!record.id) {
      alert("This token cannot be deleted because it has no valid ID.");
      return;
    }
  
    if (window.confirm(`Are you sure you want to delete token: ${record.tokenName || "Unnamed"}?`)) {
      deleteToken(record.id);
    }
  };
  

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Token Creation Tool
      </Typography>
      <Divider sx={{ marginBottom: "20px" }} />

      {/* Token Creation Form */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <FormControl fullWidth>
          <InputLabel>Token Type</InputLabel>
          <Select value={tokenType} onChange={(e) => setTokenType(e.target.value)}>
            <MenuItem value="NFT">Non-Fungible Token (NFT)</MenuItem>
            <MenuItem value="FT">Fungible Token (FT)</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Token Name" value={tokenName} onChange={(e) => setTokenName(e.target.value)} fullWidth />
        <TextField label="Token Symbol" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} fullWidth />
        <TextField label="Token Memo" value={tokenMemo} onChange={(e) => setTokenMemo(e.target.value)} fullWidth />
        <FormControl fullWidth>
          <InputLabel>Supply Type</InputLabel>
          <Select value={supplyType} onChange={(e) => setSupplyType(e.target.value)}>
            <MenuItem value="Infinite">Infinite</MenuItem>
            <MenuItem value="Finite">Finite</MenuItem>
          </Select>
        </FormControl>
        {tokenType === "FT" && (
          <>
            <TextField
              label="Decimals"
              type="number"
              value={decimals}
              onChange={(e) => setDecimals(Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Initial Supply"
              type="number"
              value={initialSupply}
              onChange={(e) => setInitialSupply(Number(e.target.value))}
              fullWidth
            />
          </>
        )}
        <Box sx={{ display: "flex", gap: "8px", marginTop: "20px" }}>
          <Button
            variant="contained"
            onClick={createToken}
            disabled={isLoading}
            sx={{ backgroundColor: "#00FF00", color: "#000" }}
          >
            {isLoading ? "Creating..." : "Create Token"}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ margin: "40px 0" }} />

      {/* Token Records Table */}
      <Typography variant="h5" sx={{ marginBottom: "20px" }}>
        Created Tokens
      </Typography>
      {fetchError ? (
        <Typography color="error">{fetchError}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
          <TableHead>
  <TableRow>
    {[
      { key: "tokenId", label: "Token ID" },
      { key: "tokenName", label: "Name" },
      { key: "tokenSymbol", label: "Symbol" },
      { key: "tokenType", label: "Type" },
      { key: "supplyType", label: "Supply Type" },
      { key: "creationDate", label: "Creation Date" },
    ].map((column) => (
      <TableCell
        key={column.key}
        onClick={() => handleSort(column.key)}
        style={{ cursor: "pointer", fontWeight: "bold" }}
      >
        {column.label} {getSortArrow(column.key)}
      </TableCell>
    ))}
    <TableCell style={{ fontWeight: "bold" }}>Actions</TableCell>
  </TableRow>
</TableHead>

            <TableBody>
  {tokenRecords.map((record, index) => (
    <TableRow key={record.tokenId || index}>
      <TableCell>{record.tokenId || "Missing ID"}</TableCell>
      <TableCell>{record.tokenName || "Unnamed Token"}</TableCell>
      <TableCell>{record.tokenSymbol || "No Symbol"}</TableCell>
      <TableCell>{record.tokenType || "Unknown Type"}</TableCell>
      <TableCell>{record.supplyType || "Undefined"}</TableCell>
      <TableCell>
        {record.creationDate
          ? new Date(record.creationDate).toLocaleString()
          : "No Date"}
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="error"
          onClick={() => confirmDelete(record)}
          disabled={!record.tokenId} // Disable button if tokenId is missing
          sx={{
            backgroundColor: record.tokenId ? "#FF0000" : "#CCCCCC",
            color: "#FFF",
            "&:hover": {
              backgroundColor: record.tokenId ? "#CC0000" : "#CCCCCC",
            },
          }}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TokenCreationTool;
