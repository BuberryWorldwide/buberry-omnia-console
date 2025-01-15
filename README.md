

# Omnia by Buberry Worldwide 🌐  
A Hedera-powered dApp for **token management**, **staking**, **NFTs**, and **gamified rewards** designed to empower sustainable communities and incentivize participation through decentralized technology.

---

## **About Omnia**
Omnia is a decentralized application (dApp) built on the **Hedera network** to serve as a cornerstone for Buberry Worldwide’s mission: creating self-sufficient, sustainable communities through technology and gamification.  

By integrating **staking**, **token rewards**, **NFT creation**, and **game mechanics**, Omnia encourages participation in real-world actions and educational activities, rewarding users with tokens and achievements. The platform bridges blockchain with real-world incentives for sustainable action.

---

## **Why Omnia Exists**
1. **Incentivize Action:** Reward participation in regenerative agriculture, educational activities, and sustainable practices.
2. **Decentralized Economy:** Enable token-based systems for communities, facilitating resource sharing and collaboration.
3. **Gamified Engagement:** Make learning and participation fun and rewarding through gamification.
4. **Proof of Sustainability:** Leverage blockchain technology for transparent tracking of contributions to sustainability goals.
5. **NFT Integration:** Utilize NFTs for creative and practical uses like staking, rewards, and tracking contributions.

---

## **Key Features**
### **1. Staking and Rewards**
- Stake tokens to earn rewards and unlock achievements.
- Reward participation in real-world activities like sustainability projects or educational tasks.

### **2. Gamification**
- Leaderboards and challenges encourage user engagement.
- Tasks and milestones are incentivized with tokenized rewards.

### **3. Token Management**
- Transfer, manage, and associate Hedera tokens.
- Treasury management tools for administrative accounts.

### **4. NFT Creation and Management**
- Create and mint unique NFTs tied to specific activities or assets.
- NFTs integrate into staking and gamification systems.

### **5. Wallet Integration**
- Full support for **HashPack**, **Blade**, and **MetaMask** wallets, making it easy to connect and interact with the dApp.

---

## **How to Use Omnia**

### **1. Clone the Repository**
```bash
git clone https://github.com/BuberryWorldwide/buberry-omnia-console.git
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Start the Frontend**
```bash
npm run start
```

### **4. Start the Backend**
If you’re running the backend locally for staking or advanced tools:
```bash
node server.js
```

### **5. Open Omnia**
Visit `https://localhost:3000` for local development or the hosted version at [omnia.buberryworldwide.com](https://omnia.buberryworldwide.com).

---

## **Prerequisites**
### **Hedera Testnet Account**
- Create a free testnet account at [Hedera Portal](https://portal.hedera.com/register).
- Test accounts receive **10,000 HBAR daily** for testing.

### **Supported Wallets**
1. **HashPack Wallet**  
   - Install the [HashPack extension](https://chrome.google.com/webstore/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk).
   - Import a Hedera ED25519 testnet account.

2. **Blade Wallet**  
   - Install the [Blade extension](https://chrome.google.com/webstore/detail/blade-%E2%80%93-hedera-web3-digit/abogmiocnneedmmepnohnhlijcjpcifd).
   - Import a Hedera ED25519 testnet account.

3. **MetaMask Wallet**  
   - Install the [MetaMask extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn).
   - Activate your testnet account by transferring HBAR to your EVM address.

---

## **Configuration**
Omnia connects to the Hedera testnet using JSON RPC. The configuration is in `src/config/networks.ts`:

```typescript
export const networkConfig: NetworkConfigs = {
  testnet: {
    network: "testnet",
    jsonRpcUrl: "https://testnet.hashio.io/api",
    mirrorNodeUrl: "https://testnet.mirrornode.hedera.com",
    chainId: "0x128",
  },
};
```

---

## **How Omnia Works**
### **Frontend**
Built using **React** with **Material UI** and **TypeScript** for a modern, responsive, and accessible user interface.

### **Backend**
The backend powers staking and rewards functionality using Hedera Consensus Service (HCS) and Hedera Token Service (HTS). It provides APIs for managing:
- Token staking and reward distribution.
- NFT metadata and minting records.

### **Wallet Integration**
Omnia detects your connected wallet and tailors navigation and features:
- Standard users can manage tokens and interact with gamified tasks.
- Treasury accounts unlock advanced tools for NFT creation and staking management.

---

## **Real-World Applications**
1. **Incentivizing Sustainability:** Encourage participation in agriculture, renewable energy, and waste management through gamified rewards.
2. **Decentralized Education:** Reward users for completing courses and projects related to regenerative practices.
3. **Local and Global Impact:** Create token economies that support local communities while enabling global collaboration.

---

## **Key Links**
- [Live Application](https://omnia.buberryworldwide.com)
- [Hedera Testnet Dashboard](https://hashscan.io/testnet/dashboard)
- [Hedera Developer Resources](https://hedera.com/developers)

---

## **License**
Licensed under the Apache 2.0 License.
