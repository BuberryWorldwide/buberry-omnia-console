const { TokenBurnTransaction, Client, PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config();

(async () => {
    const client = Client.forTestnet();
    client.setOperator(process.env.MY_ACCOUNT_ID, process.env.MY_PRIVATE_KEY);

    const tokenId = "0.0.5341855"; // Replace with your Token ID
    const serialNumber = 3; // Replace with your NFT Serial Number
    const supplyKey = PrivateKey.fromString(process.env.SUPPLY_KEY);

    try {
        const burnTransaction = new TokenBurnTransaction()
            .setTokenId(tokenId)
            .setSerials([serialNumber]) // Burn specific serial number
            .freezeWith(client);

        const signedTransaction = await burnTransaction.sign(supplyKey);
        const response = await signedTransaction.execute(client);
        const receipt = await response.getReceipt(client);

        console.log(`Burned NFT Serial Number ${serialNumber}:`, receipt.status);
    } catch (error) {
        console.error("Error burning NFT:", error);
    }
})();
