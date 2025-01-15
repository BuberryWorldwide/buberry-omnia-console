import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { TokenMintTransaction, PrivateKey, Client } from "@hashgraph/sdk";
import { Buffer } from "buffer";

const MintingTool: React.FC = () => {
  const [tokenId, setTokenId] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");
  const [quantity, setQuantity] = useState<number>(1); // New state for quantity
  const [serialNumbers, setSerialNumbers] = useState<number[]>([]); // Track multiple serial numbers
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const mintNFT = async () => {
    try {
      const supplyKeyString = process.env.REACT_APP_MY_SUPPLY_KEY;
      if (!supplyKeyString) {
        alert("Supply key is not set. Check your .env configuration.");
        return;
      }
      const supplyKey = PrivateKey.fromString(supplyKeyString);
  
      if (!tokenId || !metadataUrl || quantity < 1) {
        alert("Please provide Token ID, Metadata URL, and a valid quantity.");
        return;
      }
  
      setIsLoading(true);
      setError("");
      setSerialNumbers([]); // Clear previous serial numbers
  
      const client = Client.forTestnet();
      client.setOperator(
        process.env.REACT_APP_MY_ACCOUNT_ID!,
        process.env.REACT_APP_MY_PRIVATE_KEY!
      );
  
      // Convert metadata to Uint8Array
      const metadata = Uint8Array.from(
        Buffer.from(
          JSON.stringify({
            url: metadataUrl,
          })
        )
      );
  
      if (metadata.length > 100) {
        setError("Metadata is too long. Reduce the size of your metadata.");
        setIsLoading(false);
        return;
      }
  
      const newSerialNumbers: number[] = [];
      for (let i = 0; i < quantity; i++) {
        const mintTransaction = new TokenMintTransaction()
          .setTokenId(tokenId)
          .addMetadata(metadata) // Add metadata here
          .freezeWith(client); // Freeze after adding metadata
  
        const signedTransaction = await mintTransaction.sign(supplyKey);
        const response = await signedTransaction.execute(client);
        const receipt = await response.getReceipt(client);
  
        if (receipt.serials.length > 0) {
          const serial = receipt.serials[0];
          newSerialNumbers.push(serial);
          console.log(`NFT #${i + 1} Minted Successfully! Serial Number: ${serial}`);
        } else {
          throw new Error("No serial number returned in receipt.");
        }
      }
  
      setSerialNumbers(newSerialNumbers); // Update all minted serial numbers
    } catch (err) {
      if (err instanceof Error) {
        console.error("Minting failed:", err);
        setError(err.message || "Minting failed. Check console for details.");
      } else {
        console.error("Unknown error occurred:", err);
        setError("An unknown error occurred. Check console for details.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <Box
      sx={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        NFT Minting Tool
      </Typography>

      {/* Input for Token ID */}
      <TextField
        label="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />

      {/* Input for Metadata URL */}
      <TextField
        label="Metadata URL (IPFS)"
        value={metadataUrl}
        onChange={(e) => setMetadataUrl(e.target.value)}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />

      {/* Input for Quantity */}
      <TextField
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        fullWidth
        sx={{ marginBottom: "16px" }}
      />

      {/* Mint Button */}
      <Button
        variant="contained"
        color="success"
        onClick={mintNFT}
        disabled={isLoading}
        sx={{ marginBottom: "16px" }}
      >
        {isLoading ? "Minting..." : "Mint NFT"}
      </Button>

      {/* Display Minted Serial Numbers */}
      {serialNumbers.length > 0 && (
  <Typography variant="h6" sx={{ marginTop: "16px" }}>
    NFT Minted Successfully! Serial Numbers: {serialNumbers.join(", ")}
  </Typography>
)}


      {/* Error Display */}
      {error && (
        <Typography variant="body1" color="error" sx={{ marginTop: "16px" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default MintingTool;
