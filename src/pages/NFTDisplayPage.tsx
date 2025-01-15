import React, { useEffect, useState } from "react";
import { MirrorNodeClient } from "../services/wallets/mirrorNodeClient";
import { AccountId } from "@hashgraph/sdk";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { networkConfig } from "../config/networks";
import "./NFTDisplayPage.css";
import { Typography } from "@mui/material";

interface NFT {
  token_id: string;
  serial_number: number;
  image: string;
  metadataPath: string;
  metadata?: {
    name?: string;
    creator?: string;
    description?: string;
    type?: string;
    image?: string;
    properties?: Record<string, string>;
    files?: { uri: string; type: string }[];
  } | null;
}

interface Stack {
  token_id: string;
  count: number;
  nfts: NFT[];
}

const NFTDisplayPage: React.FC = () => {
  const { accountId } = useWalletInterface();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [stackedNFTs, setStackedNFTs] = useState<Stack[]>([]);
  const [selectedMetadata, setSelectedMetadata] = useState<any | null>(null);
  const [hiddenNFTs, setHiddenNFTs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load hidden NFTs from local storage on component mount
  useEffect(() => {
    const storedHiddenNFTs = localStorage.getItem("hiddenNFTs");
    if (storedHiddenNFTs) {
      setHiddenNFTs(JSON.parse(storedHiddenNFTs));
    }
  }, []);

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        setLoading(true);

        if (!accountId) {
          setError("No wallet connected. Please connect a wallet to view NFTs.");
          return;
        }

        const accountIdObj = AccountId.fromString(accountId);
        const client = new MirrorNodeClient(networkConfig.testnet);

        const nftData = await client.getNftInfo(accountIdObj);

        const enrichedNFTs = nftData.map((nft) => {
          const baseName = nft.token_id.replaceAll(".", "-");
          return {
            ...nft,
            image: `/assets/nfts/${baseName}.png`,
            metadataPath: `/metadata/${baseName}.json`,
          };
        });

        // Group NFTs by token_id
        const groupedNFTs = new Map<string, NFT[]>();
        enrichedNFTs.forEach((nft) => {
          if (!groupedNFTs.has(nft.token_id)) {
            groupedNFTs.set(nft.token_id, []);
          }
          groupedNFTs.get(nft.token_id)!.push(nft);
        });

        const stacks = Array.from(groupedNFTs.entries()).map(([token_id, nftList]) => ({
          token_id,
          count: nftList.length,
          nfts: nftList,
        }));

        setStackedNFTs(stacks);
        setError(null);
      } catch (err) {
        setError("Failed to load NFTs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNFTData();
  }, [accountId]);

  // Function to hide an NFT and persist it in local storage
  const handleHideNFT = (token_id: string) => {
    const updatedHiddenNFTs = [...hiddenNFTs, token_id];
    setHiddenNFTs(updatedHiddenNFTs);
    localStorage.setItem("hiddenNFTs", JSON.stringify(updatedHiddenNFTs));
  };

  // Function to unhide an NFT and update local storage
  const handleUnhideNFT = (token_id: string) => {
    const updatedHiddenNFTs = hiddenNFTs.filter((id) => id !== token_id);
    setHiddenNFTs(updatedHiddenNFTs);
    localStorage.setItem("hiddenNFTs", JSON.stringify(updatedHiddenNFTs));
  };

  const isHidden = (token_id: string) => hiddenNFTs.includes(token_id);

  const handleStackClick = async (stack: Stack) => {
    try {
      const firstNFT = stack.nfts[0];
      if (firstNFT.metadataPath) {
        const response = await fetch(firstNFT.metadataPath);
        if (!response.ok) throw new Error("Metadata not found");
        const metadata = await response.json();
        setSelectedMetadata({ ...firstNFT, metadata });
      }
    } catch (err) {
      console.error("Error fetching metadata:", err);
      setSelectedMetadata({
        metadata: {
          name: "Unknown NFT",
          description: "Metadata could not be retrieved.",
          creator: "Unknown",
          type: "N/A",
          properties: {},
        },
      });
    }
  };

  const closeMetadata = () => {
    setSelectedMetadata(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMetadata();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (loading) return <p>Loading NFTs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="nft-page">
      <div className="nft-layout">
        <div className="nft-content">
          <Typography variant="h4" mb={3}>
            Card Vault
          </Typography>
          {stackedNFTs.length === 0 ? (
            <p>No NFTs found in this account. (•́︵•̀)</p>
          ) : (
            <div className="nft-grid">
              {stackedNFTs.map(
                (stack, index) =>
                  !isHidden(stack.token_id) && (
                    <div
                      key={index}
                      className="nft-card"
                      onClick={() => handleStackClick(stack)}
                    >
                      <img
                        src={stack.nfts[0].image}
                        alt={`Token ID: ${stack.token_id}`}
                        className="nft-image"
                      />
                      <p>Token ID: {stack.token_id}</p>
                      <p>Count: {stack.count}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHideNFT(stack.token_id);
                        }}
                      >
                        Hide
                      </button>
                    </div>
                  )
              )}
            </div>
          )}

          {hiddenNFTs.length > 0 && (
            <div className="hidden-nfts">
              <h3>Hidden NFTs</h3>
              {hiddenNFTs.map((token_id) => (
                <div key={token_id} className="hidden-nft">
                  <p>Token ID: {token_id}</p>
                  <button onClick={() => handleUnhideNFT(token_id)}>Unhide</button>
                </div>
              ))}
            </div>
          )}

          {selectedMetadata && (
            <div
              className="modal"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeMetadata();
              }}
            >
              <div className="modal-content">
                <span className="close" onClick={closeMetadata}>
                  &times;
                </span>
                <h2>Token ID: {selectedMetadata.token_id}</h2>
                <p>
                  <strong>Name:</strong> {selectedMetadata.metadata?.name || "Unnamed NFT"}
                </p>
                <p>
                  <strong>Creator:</strong> {selectedMetadata.metadata?.creator || "Unknown"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedMetadata.metadata?.description || "No description available"}
                </p>
                <h4>Properties:</h4>
                <ul>
                  {selectedMetadata.metadata?.properties
                    ? Object.entries(selectedMetadata.metadata.properties).map(
                        ([key, value]) => (
                          <li key={key}>
                            <strong>{key}:</strong>{" "}
                            {typeof value === "string" || typeof value === "number"
                              ? value
                              : JSON.stringify(value)}
                          </li>
                        )
                      )
                    : null}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTDisplayPage;
