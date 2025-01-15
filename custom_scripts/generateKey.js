const { PrivateKey } = require("@hashgraph/sdk");

const privateKey = PrivateKey.generate();
const publicKey = privateKey.publicKey;

console.log("Private Key:", privateKey.toString());
console.log("Public Key:", publicKey.toString());
