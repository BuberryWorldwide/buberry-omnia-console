const { TransferTransaction, Client } = require("@hashgraph/sdk");
require("dotenv").config();

(async () => {
    const client = Client.forTestnet();
    client.setOperator(process.env.MY_ACCOUNT_ID, process.env.MY_PRIVATE_KEY);

    try {
        const transferTransaction = new TransferTransaction()
            .addNftTransfer("0.0.5341855", 1, process.env.MY_ACCOUNT_ID, "0.0.5327323")
            .freezeWith(client);

        const signedTransaction = await transferTransaction.signWithOperator(client);
        const response = await signedTransaction.execute(client);
        const receipt = await response.getReceipt(client);

        console.log(`Transfer Status: ${receipt.status}`);
    } catch (error) {
        console.error("Transfer failed:", error);
    }
})();
