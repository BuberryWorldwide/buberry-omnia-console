import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccountId } from "@hashgraph/sdk";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { appConfig } from "../config";
import axios from "axios"; // Import Axios for server communication
import "../styles/dialogStyle.css";

interface Token {
  token_id: string;
  metadata: any;
  balance: number;
}

interface Plot {
  token_id: string | null;
}

interface LandStaking {
  land: Token;
  plots: Plot[];
}

const StakingUI: React.FC = () => {
  const { accountId } = useWalletInterface();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [landStakings, setLandStakings] = useState<LandStaking[]>([]);
  const [selectedLandToken, setSelectedLandToken] = useState<Token | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<{ landIndex: number; plotIndex: number } | null>(
    null
  );
  const [tokenSelectionOpen, setTokenSelectionOpen] = useState(false);
  const [compatibleTokens, setCompatibleTokens] = useState<Token[]>([]);

  // Load state from the server on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/state");
        const { tokens, landStakings } = response.data;

        if (tokens) setTokens(tokens);
        if (landStakings) setLandStakings(landStakings);
      } catch (error) {
        console.error("Error loading state:", error);
      }
    };

    loadState();
  }, []);

  // Save state to the server whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await axios.post("http://localhost:3001/api/state", {
          tokens,
          landStakings,
        });
      } catch (error) {
        console.error("Error saving state:", error);
      }
    };

    if (tokens.length || landStakings.length) {
      saveState();
    }
  }, [tokens, landStakings]);

  useEffect(() => {
    if (!accountId) return;

    const fetchTokens = async () => {
      try {
        const mirrorNodeClient = new MirrorNodeClient(appConfig.networks.testnet);
        const tokensData = await mirrorNodeClient.getAccountTokenBalancesWithTokenInfo(
          AccountId.fromString(accountId)
        );

        const tokenPromises = tokensData.map(async (token: any) => {
          const metadataPath = `/metadata/${token.token_id.replace(/\./g, "-")}.json`;
          let metadata = null;

          try {
            const response = await fetch(metadataPath);
            if (response.ok) {
              metadata = await response.json();
            }
          } catch (err) {
            console.warn(`Failed to fetch metadata for token ${token.token_id}:`, err);
          }

          return metadata
            ? {
                token_id: token.token_id,
                balance: token.balance,
                metadata,
              }
            : null;
        });

        const parsedTokens = (await Promise.all(tokenPromises)).filter(
          (token): token is Token => token !== null
        );

        setTokens(parsedTokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    };

    fetchTokens();
  }, [accountId]);

  const handleLandSelect = (token: Token) => {
    if (token.metadata.type === "Land") {
      const numPlots = token.metadata.properties.plots || 0;
      const newPlots = Array(numPlots).fill({ token_id: null });
      setLandStakings((prev) => [...prev, { land: token, plots: newPlots }]);
      setTokens((prev) =>
        prev.map((t) => (t.token_id === token.token_id ? { ...t, balance: t.balance - 1 } : t))
      );
      setSelectedLandToken(null);
    }
  };

  const handlePlotClick = (landIndex: number, plotIndex: number) => {
    const allowedTypes = landStakings[landIndex].land.metadata.allowed_stakes || [];
    const compatible = tokens.filter(
      (token) => allowedTypes.includes(token.metadata.type) && token.balance > 0
    );
    setCompatibleTokens(compatible);
    setSelectedPlot({ landIndex, plotIndex });
    setTokenSelectionOpen(true);
  };

  const handleStakeToken = (token: Token) => {
    if (!selectedPlot) return;

    const updatedStakings = [...landStakings];
    updatedStakings[selectedPlot.landIndex].plots[selectedPlot.plotIndex] = {
      token_id: token.token_id,
    };

    setLandStakings(updatedStakings);
    setTokens((prev) =>
      prev.map((t) => (t.token_id === token.token_id ? { ...t, balance: t.balance - 1 } : t))
    );
    setTokenSelectionOpen(false);
    setSelectedPlot(null);
  };

  const handlePlotRemove = (landIndex: number, plotIndex: number) => {
    const token_id = landStakings[landIndex].plots[plotIndex].token_id;
    if (!token_id) return;

    const updatedStakings = [...landStakings];
    updatedStakings[landIndex].plots[plotIndex] = { token_id: null };
    setLandStakings(updatedStakings);

    setTokens((prev) =>
      prev.map((t) => (t.token_id === token_id ? { ...t, balance: t.balance + 1 } : t))
    );
  };

  const handleRemoveLand = (landIndex: number) => {
    const land = landStakings[landIndex].land;
    const plotsInUse = landStakings[landIndex].plots.some((plot) => plot.token_id !== null);

    if (plotsInUse) return;

    setLandStakings((prev) => prev.filter((_, index) => index !== landIndex));
    setTokens((prev) =>
      prev.map((t) => (t.token_id === land.token_id ? { ...t, balance: t.balance + 1 } : t))
    );
  };

  const isLandRemovable = (plots: Plot[]) => plots.every((plot) => !plot.token_id);

  return (
    <Box display="flex" height="100vh">
      <Box width="25%" borderRight="1px dashed grey" padding={2} overflow="auto">
        <Typography variant="h6" gutterBottom>
          Tokens
        </Typography>
        <List>
          {tokens
            .filter((token) => token.metadata.type === "Land")
            .map((token) => (
              <ListItem
                key={token.token_id}
                button
                onClick={() => setSelectedLandToken(token)}
              >
                <ListItemText
                  primary={token.metadata?.name ?? "Unknown Name"}
                  secondary={`Balance: ${token.balance}`}
                />
              </ListItem>
            ))}
        </List>
      </Box>

      <Box width="75%" padding={2} overflow="auto">
        {landStakings.map((staking, landIndex) => (
          <Accordion key={staking.land.token_id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{staking.land.metadata.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{staking.land.metadata.description}</Typography>
              <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                gap={2}
                marginTop={2}
              >
                {staking.plots.map((plot, plotIndex) => (
                  <Box
                    key={plotIndex}
                    height="100px"
                    border={plot.token_id ? "1px solid #ccc" : "2px dashed #00ff00"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() =>
                      plot.token_id
                        ? handlePlotRemove(landIndex, plotIndex)
                        : handlePlotClick(landIndex, plotIndex)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {plot.token_id ? `Staked: ${plot.token_id}` : "Empty Plot"}
                  </Box>
                ))}
              </Box>
              {isLandRemovable(staking.plots) && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveLand(landIndex)}
                  sx={{ marginTop: 2 }}
                >
                  Remove Land Card
                </Button>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Dialog
  open={!!selectedLandToken}
  onClose={() => setSelectedLandToken(null)}
  maxWidth="lg"
>
<DialogTitle
  sx={{
    fontWeight: "bold",
    fontSize: "1.5rem",
    textAlign: "center",
  }}
>
    <Box className="custom-container" sx={{ padding: "16px", borderRadius: "8px" }}>
      {selectedLandToken?.metadata?.name ?? "Unknown Land Card"}
    </Box>
  
  </DialogTitle>
  <DialogContent
  sx={{
    display: "flex",
    flexWrap: "wrap", // Ensure wrapping on smaller screens
    gap: 2,
  }}
>
  {/* Left: Metadata Information */}
  <Box
    className="metadata-container"
    sx={{
      flex: 1, // Allow it to share space with the image
      minWidth: "300px", // Set a minimum width for responsiveness
      maxWidth: "50%", // Prevent it from taking more than half of the space
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      color: "white",
      padding: "16px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  >
    <Typography sx={{ marginBottom: "8px", fontSize: "1.2rem" }}>
      <strong>Description:</strong> {selectedLandToken?.metadata?.description ?? "N/A"}
    </Typography>
    <Typography sx={{ marginBottom: "8px" }}>
      <strong>Edition:</strong> {selectedLandToken?.metadata?.edition ?? "N/A"}
    </Typography>
    <Typography sx={{ marginBottom: "8px" }}>
      <strong>Use Case:</strong> {selectedLandToken?.metadata?.use_case ?? "N/A"}
    </Typography>
    <Typography sx={{ marginBottom: "8px" }}>
      <strong>Special Trait:</strong> {selectedLandToken?.metadata?.special_trait ?? "N/A"}
    </Typography>
    <Typography sx={{ marginBottom: "8px" }}>
      <strong>Created By:</strong> {selectedLandToken?.metadata?.created_by ?? "N/A"}
    </Typography>
    <Typography sx={{ marginTop: "16px", fontWeight: "bold" }}>Properties:</Typography>
    <Box sx={{ marginLeft: 2 }}>
      {selectedLandToken?.metadata?.properties
        ? Object.entries(selectedLandToken.metadata.properties).map(([key, value]) => (
            <Typography key={key} sx={{ fontSize: "0.9rem", marginBottom: "4px" }}>
              <strong>{key}:</strong> {String(value ?? "N/A")}
            </Typography>
          ))
        : "No properties available"}
    </Box>
  </Box>

  {/* Right: Image Section */}
  <Box
    sx={{
      flex: 1, // Allow it to share space with the metadata
      minWidth: "300px", // Ensure responsiveness
      maxWidth: "50%", // Prevent it from taking more than half of the space
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.65)",
      padding: "16px",
      borderRadius: "8px",
      position: "relative",
    }}
  >
    <img
      src={`/assets/nfts/${selectedLandToken?.token_id.replace(/\./g, "-")}.png`}
      alt={`${selectedLandToken?.metadata?.name ?? "Unknown Token"}`}
      style={{
        maxWidth: "100%",
        maxHeight: "300px",
        borderRadius: "8px",
      }}
    />
    {/* Token Balance Overlay */}
    <Typography
      sx={{
        position: "absolute",
        bottom: "8px",
        right: "8px",
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "bold",
      }}
    >
      Balance: {selectedLandToken?.balance ?? 0}
    </Typography>
  </Box>
</DialogContent>

  <DialogActions>
    <Button
      variant="outlined"
      onClick={() => setSelectedLandToken(null)}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      color="primary"
      onClick={() => selectedLandToken && handleLandSelect(selectedLandToken)}
    >
      Place Land Card
    </Button>
  </DialogActions>
</Dialog>


      <Dialog
        open={tokenSelectionOpen}
        onClose={() => setTokenSelectionOpen(false)}
      >
        <DialogTitle>Select a Compatible Token</DialogTitle>
        <DialogContent>
          <List>
            {compatibleTokens.map((token) => (
              <ListItem key={token.token_id} button onClick={() => handleStakeToken(token)}>
                <ListItemText
                  primary={token.metadata.name}
                  secondary={`Balance: ${token.balance}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTokenSelectionOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StakingUI;
