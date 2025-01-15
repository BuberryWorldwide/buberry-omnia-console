const { TokenMintTransaction, PrivateKey, Client } = require("@hashgraph/sdk");
require("dotenv").config();

(async () => {
    const client = Client.forTestnet();
    client.setOperator(process.env.MY_ACCOUNT_ID, process.env.MY_PRIVATE_KEY);

    const supplyKey = PrivateKey.fromString(process.env.SUPPLY_KEY);
    const tokenId = "0.0.5341855"; // Replace with your token ID

    const metadata = Buffer.from(
        JSON.stringify({
            url: "ipfs://bafybeihet64yfymeezi6hupddo35yvdrs4ufcgr5c4u3ufpku56upozrru/founders-card.json"
        })
    );

    try {
        console.log("Metadata size:", metadata.length, "bytes");
        const mintTransaction = new TokenMintTransaction()
            .setTokenId(tokenId)
            .addMetadata(metadata)
            .freezeWith(client);

        const signedTransaction = await mintTransaction.sign(supplyKey);
        const response = await signedTransaction.execute(client);
        const receipt = await response.getReceipt(client);

        console.log("Transaction Receipt:", receipt);
        console.log(`Minted NFT with Serial Number: ${receipt.serials[0]}`);
    } catch (error) {
        console.error("Minting failed:", error);
    }
})();
