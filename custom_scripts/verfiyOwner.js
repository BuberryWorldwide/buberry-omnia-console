const { TokenNftInfoQuery, NftId, TokenId, Client } = require("@hashgraph/sdk");
require("dotenv").config();

(async () => {
    const client = Client.forTestnet();
    client.setOperator(process.env.MY_ACCOUNT_ID, process.env.MY_PRIVATE_KEY);

    try {
        const tokenId = TokenId.fromString("0.0.5341855"); // Ensure TokenId is explicitly created
        const serialNumber = 1; // Replace with your Serial Number

        // Create an NftId instance
        const nftId = new NftId(tokenId, serialNumber);

        // Query for the NFT info
        const nftInfo = await new TokenNftInfoQuery()
            .setNftId(nftId) // Pass the NftId instance
            .execute(client);

        console.log("NFT Info:", nftInfo[0]);
        console.log("Owner Account ID:", nftInfo[0].accountId.toString());
    } catch (error) {
        console.error("Error fetching NFT info:", error);
    }
})();
