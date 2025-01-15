require("dotenv").config();
const {
    Client,
    PrivateKey,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
} = require("@hashgraph/sdk");

(async () => {
    const inquirer = await import("inquirer"); // Use dynamic import for ESM
    const client = Client.forTestnet();
    client.setOperator(process.env.MY_ACCOUNT_ID, process.env.MY_PRIVATE_KEY);

    const supplyKey = PrivateKey.fromString(process.env.SUPPLY_KEY);

    const questions = [
        {
            type: "input",
            name: "tokenName",
            message: "Enter the token name:",
            default: "Buberry Worldwide Founders Card (ASCII Edition)",
        },
        {
            type: "input",
            name: "tokenSymbol",
            message: "Enter the token symbol:",
            default: "BWFD-A",
        },
        {
            type: "input",
            name: "tokenMemo",
            message: "Enter a token memo:",
            default: "First Buberry Worldwide NFT",
        },
        {
            type: "confirm",
            name: "isInfiniteSupply",
            message: "Should the token have infinite supply?",
            default: true,
        },
    ];

    const answers = await inquirer.default.prompt(questions);

    const supplyType = answers.isInfiniteSupply
        ? TokenSupplyType.Infinite
        : TokenSupplyType.Finite;

    try {
        const transaction = await new TokenCreateTransaction()
            .setTokenName(answers.tokenName)
            .setTokenSymbol(answers.tokenSymbol)
            .setTokenMemo(answers.tokenMemo)
            .setDecimals(0) // Required for NFTs
            .setTokenType(TokenType.NonFungibleUnique) // Set as NFT
            .setSupplyType(supplyType)
            .setInitialSupply(0) // No initial NFTs
            .setTreasuryAccountId(process.env.MY_ACCOUNT_ID)
            .setSupplyKey(supplyKey) // Required for minting NFTs
            .freezeWith(client);

        const signedTransaction = await transaction.sign(supplyKey);
        const response = await signedTransaction.execute(client);
        const receipt = await response.getReceipt(client);

        console.log(`Token created successfully! Token ID: ${receipt.tokenId}`);
    } catch (error) {
        console.error("Error creating token:", error);
    }
})();
