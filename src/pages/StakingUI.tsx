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
import { v4 as uuidv4 } from "uuid";


interface Token {
  token_id: string;
  metadata: any;
  balance: number;
}

interface Plot {
  token_id: string | null;
}

interface LandStaking {
  instanceId: string; // Unique identifier for each land card instance

  land: Token;
  plots: Plot[];
}

const StakingUI: React.FC = () => {
  const { accountId } = useWalletInterface();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [landStakings, setLandStakings] = useState<LandStaking[]>([]);
  const [selectedLandToken, setSelectedLandToken] = useState<Token | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<{ instanceId: string; plotIndex: number } | null>(
    null
  );
  const [tokenSelectionOpen, setTokenSelectionOpen] = useState(false);
  const [compatibleTokens, setCompatibleTokens] = useState<Token[]>([]);


  const groupTokensByType = (tokens: Token[]) => {
    return tokens.reduce((groups, token) => {
      const type = token.metadata.type || "Unknown";
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(token);
      return groups;
    }, {} as Record<string, Token[]>);
  };

  const handleStakeLogic = async () => {
    if (!selectedPlot || compatibleTokens.length === 0) {
      console.warn("No token selected or plot not available for staking.");
      return;
    }
  
    const selectedToken = compatibleTokens[0]; // Use the first compatible token (or allow user to choose)
    try {
      // Example: Interact with staking smart contract
      console.log("Initiating staking process for token:", selectedToken);
  
      // Add custom staking contract interaction logic here
      // e.g., await stakingContract.stake(selectedPlot, selectedToken);
  
      // Update land staking state
      const updatedStakings = landStakings.map((staking) => {
        if (staking.instanceId === selectedPlot.instanceId) {
          staking.plots[selectedPlot.plotIndex] = { token_id: selectedToken.token_id };
        }
        return staking;
      });
  
      setLandStakings(updatedStakings);
  
      // Update token balances
      setTokens((prevTokens) =>
        prevTokens.map((token) =>
          token.token_id === selectedToken.token_id
            ? { ...token, balance: token.balance - 1 }
            : token
        )
      );
  
      console.log("Staking successful!");
      setTokenSelectionOpen(false);
      setSelectedPlot(null);
  
      // Optional: Reward disbursement
      await handleRewardDisbursement(selectedToken.token_id);
    } catch (error) {
      console.error("Error during staking:", error);
    }
  };
  
  const handleRewardDisbursement = async (tokenId: string) => {
    try {
      const rewardAmount = calculateReward(tokenId); // Implement your reward calculation logic
  
      // Example: Transfer reward tokens from a treasury
      console.log(`Disbursing ${rewardAmount} Carbon Points for token ${tokenId}`);
  
      // Add logic to interact with your treasury or reward distribution smart contract here
      // e.g., await rewardContract.transfer(accountId, rewardAmount);
  
      console.log("Rewards successfully disbursed!");
    } catch (error) {
      console.error("Error disbursing rewards:", error);
    }
  };
  
  // Example reward calculation function
  const calculateReward = (tokenId: string): number => {
    // Simple reward calculation based on token properties (customize as needed)
    const token = tokens.find((t) => t.token_id === tokenId);
    if (!token) return 0;
  
    const sequestration = token.metadata.properties?.carbon_sequestration || 0;
    return sequestration * 10; // Example: 10 points per sequestration unit
  };
  

  
  const [categorizedTokens, setCategorizedTokens] = useState<Record<string, Token[]>>({});
  
// Update the `fetchTokens` useEffect to categorize tokens after fetching
useEffect(() => {
  const categorizeTokens = () => {
    setCategorizedTokens(groupTokensByType(tokens));
  };
  categorizeTokens();
}, [tokens]);

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
      // Check for `capacity` or `plots` to determine the number of plots
      const numPlots =
        parseInt(token.metadata.properties.capacity, 10) ||
        parseInt(token.metadata.properties.plots, 10) ||
        0; // Default to 0 if neither is present
  
      if (isNaN(numPlots) || numPlots <= 0) {
        console.error("Invalid number of plots for Land token:", token);
        return;
      }
  
      const newPlots = Array(numPlots).fill({ token_id: null }); // Initialize empty plots
  
      console.log("Initialized Plots for Land Token:", {
        token,
        numPlots,
        newPlots,
      });
  
      const instanceId = uuidv4(); // Unique ID for each instance
  
      setLandStakings((prev) => [
        ...prev,
        { instanceId, land: token, plots: newPlots },
      ]);
  
      setTokens((prev) =>
        prev.map((t) =>
          t.token_id === token.token_id ? { ...t, balance: t.balance - 1 } : t
        )
      );
  
      setSelectedLandToken(null);
    }
  };
  
  

  const handlePlotClick = (instanceId: string, plotIndex: number) => {
    const staking = landStakings.find((ls) => ls.instanceId === instanceId);
    if (!staking) {
      console.warn("Staking instance not found for instanceId:", instanceId);
      return;
    }
  
    // Retrieve allowed stakes
    const allowedTypes = staking.land.metadata.properties?.allowed_stakes || [];
    console.log("Allowed Types for Land:", allowedTypes);
  
    // Filter tokens based on allowed types
    const compatible = tokens.filter(
      (token) => allowedTypes.includes(token.metadata.type) && token.balance > 0
    );
    console.log("Compatible Tokens for Plot:", compatible);
  
    // Update state
    setCompatibleTokens(compatible);
    setSelectedPlot({ instanceId, plotIndex });
    setTokenSelectionOpen(true);
  };
  

  const handleStakeToken = (token: Token) => {
    if (!selectedPlot) return;
  
    // Update the landStakings with the staked token
    const updatedStakings = landStakings.map((staking) => {
      if (staking.instanceId === selectedPlot.instanceId) {
        staking.plots[selectedPlot.plotIndex] = { token_id: token.token_id };
      }
      return staking;
    });
  
    // Update state for landStakings and tokens
    setLandStakings(updatedStakings);
    setTokens((prev) =>
      prev.map((t) =>
        t.token_id === token.token_id ? { ...t, balance: t.balance - 1 } : t
      )
    );
  
    // Reset state for token selection
    setTokenSelectionOpen(false);
    setSelectedPlot(null);
  };
  


  const handlePlotRemove = (instanceId: string, plotIndex: number) => {
    const staking = landStakings.find((ls) => ls.instanceId === instanceId);
    if (!staking) return;
  
    const token_id = staking.plots[plotIndex]?.token_id;
    if (!token_id) return;
  
    const updatedStakings = landStakings.map((ls) =>
      ls.instanceId === instanceId
        ? {
            ...ls,
            plots: ls.plots.map((plot, index) =>
              index === plotIndex ? { token_id: null } : plot
            ),
          }
        : ls
    );
  
    setLandStakings(updatedStakings);
    setTokens((prev) =>
      prev.map((t) => (t.token_id === token_id ? { ...t, balance: t.balance + 1 } : t))
    );
  };
  

  const handleRemoveLand = (instanceId: string) => {
    const staking = landStakings.find((ls) => ls.instanceId === instanceId);
    if (!staking) return;
  
    const plotsInUse = staking.plots.some((plot) => plot.token_id !== null);
    if (plotsInUse) return;
  
    const updatedStakings = landStakings.filter((ls) => ls.instanceId !== instanceId);
  
    setLandStakings(updatedStakings);
    setTokens((prev) =>
      prev.map((t) =>
        t.token_id === staking.land.token_id ? { ...t, balance: t.balance + 1 } : t
      )
    );
  };
  

  const isLandRemovable = (plots: Plot[]) => plots.every((plot) => !plot.token_id);

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar with categorized tokens */}
      <Box width="25%" borderRight="1px dashed grey" padding={2} overflow="auto">
        <Typography variant="h6" gutterBottom>
          Tokens by Type
        </Typography>
        {Object.keys(categorizedTokens).map((type) => (
          <Accordion key={type}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{type}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {categorizedTokens[type].map((token) => (
                  <ListItem
                    key={token.token_id}
                    button
                    onClick={() => setSelectedLandToken(token)}
                  >
                    <ListItemText
                      primary={token.metadata.name || "Unnamed Token"}
                      secondary={`Balance: ${token.balance}`}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
  
      {/* Land staking details */}
      <Box width="75%" padding={2} overflow="auto">
        {landStakings.map((staking) => (
          <Accordion key={staking.instanceId}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{staking.land.metadata?.name || "Unnamed Land"}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {staking.land.metadata?.description || "No description available"}
              </Typography>
              <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                gap={2}
                marginTop={2}
              >
                {staking.plots.map((plot, index) => (
                  <Box
                    key={`${staking.instanceId}-${index}`}
                    height="100px"
                    border={plot.token_id ? "1px solid #ccc" : "2px dashed #00ff00"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() =>
                      plot.token_id
                        ? handlePlotRemove(staking.instanceId, index)
                        : handlePlotClick(staking.instanceId, index)
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
                  onClick={() => handleRemoveLand(staking.instanceId)}
                  sx={{ marginTop: 2 }}
                >
                  Remove Land Card
                </Button>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
  
      {/* Dialog for placing land cards */}
      <Dialog
        open={!!selectedLandToken}
        onClose={() => setSelectedLandToken(null)}
        maxWidth="lg"
      >
        {/* Dialog content for land card details */}
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            textAlign: "center",
          }}
        >
          <Box
            className="custom-container"
            sx={{ padding: "16px", borderRadius: "8px" }}
          >
            {selectedLandToken?.metadata?.name ?? "Unknown Land Card"}
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Metadata information */}
          <Box
            className="metadata-container"
            sx={{
              flex: 1,
              minWidth: "300px",
              maxWidth: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            {/* Properties and metadata */}
            {Object.entries(selectedLandToken?.metadata?.properties || {}).map(
              ([key, value]) => (
                <Typography key={key} sx={{ marginBottom: "4px" }}>
                  <strong>{key}:</strong> {String(value ?? "N/A")}
                </Typography>
              )
            )}
          </Box>
  
          {/* Image section */}
          <Box
            sx={{
              flex: 1,
              minWidth: "300px",
              maxWidth: "50%",
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
              src={`/assets/nfts/${selectedLandToken?.token_id.replace(
                /\./g,
                "-"
              )}.png`}
              alt={`${selectedLandToken?.metadata?.name ?? "Unknown Token"}`}
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "8px",
              }}
            />
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
            onClick={() =>
              selectedLandToken && handleLandSelect(selectedLandToken)
            }
          >
            Place Land Card
          </Button>
        </DialogActions>
      </Dialog>
  
      {/* Dialog for selecting compatible tokens */}
      <Dialog
  open={tokenSelectionOpen}
  onClose={() => setTokenSelectionOpen(false)}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <DialogTitle id="dialog-title">Select a Compatible Token</DialogTitle>
  <DialogContent id="dialog-description">
    {Object.keys(groupTokensByType(compatibleTokens)).map((type) => (
      <Box key={type} sx={{ marginBottom: "16px" }}>
        <Typography variant="subtitle1">{type}</Typography>
        <List>
          {groupTokensByType(compatibleTokens)[type].map((token) => (
            <ListItem
              key={token.token_id}
              button
              onClick={() => handleStakeToken(token)} // Update state for selected token
            >
              <ListItemText
                primary={token.metadata.name}
                secondary={`Balance: ${token.balance}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    ))}
  </DialogContent>
  <DialogActions>
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        if (selectedPlot) {
          handleStakeLogic();
        }
      }}
    >
      Stake
    </Button>
    <Button onClick={() => setTokenSelectionOpen(false)}>Cancel</Button>
  </DialogActions>
</Dialog>

    </Box>
  );
  
};

export default StakingUI;
