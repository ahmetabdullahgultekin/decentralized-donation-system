# Decentralized Donation System

*A transparent, on‑chain platform that connects donors with verified non‑profit organizations.*

This monorepo contains the **Solidity smart contracts** that manage donations, donors and NGOs, and an **Angular 19** single‑page application that lets users interact with the contracts through MetaMask.

> **Status:** Research prototype – not audited, use on testnets only.

---

## ✨ Key Concepts

| Actor | NFT Role Token | Highlights |
|-------|---------------|------------|
| **Organization** | `ORG‑NFT` | Applies for approval; receives donations; earns *likes* & levels *(Silver → Gold → Platinum)* |
| **Donor** | `DONOR‑NFT` | Commits & later reveals donations (commit‑reveal protects privacy) |
| **Admin** | – | Approves organizations; can upgrade contract params |

### Donation Flow
1. **Org Application** – NGO calls `addOrganization(name, wallet)` → awaits admin approval.
2. **Commit** – Donor sends ETH & `hash(sender, secret)` via `commitDonation(amount, hash, orgId)`.
3. **Reveal** – Before the `revealDueDate` donor discloses `secret` → donation becomes *confirmed*.
4. **Like / Level‑up** – Anyone can `likeOrganization(id)`; every *N* likes auto‑upgrades org level *(affects their badge color in UI)*.

---

## 🏗 Project Structure

```text
decentralized-donation-system/
├── backend-solidity/          # Hardhat / Remix workspace
│   ├── contracts/
│   │   ├── DonationControl.sol  # Org registry & likes
│   │   ├── donor.sol           # Donation + Donor NFT
│   │   └── organ.sol           # Legacy org contract (kept for ref)
│   └── tests/                  # Solidity unit tests
├── frontend-angular/
│   ├── src/app/               # Angular components & services
│   └── package.json
└── README.md                  # you are here
```

---

## ⚡ Tech Stack

| Layer | Tech |
|-------|------|
| **Smart Contracts** | Solidity 0.8 · OpenZeppelin v5 · Hardhat (optional) |
| **Frontend** | Angular 19 · RxJS · Web3.js (v4) · ngx‑bootstrap |
| **Storage** | Ethereum / Sepolia testnet |

---

## 🚀 Quick Start

### 0. Prerequisites
* Node 20, npm 10
* Angular CLI ≥ 19
* MetaMask (or any EIP‑1193 wallet)

### 1. Clone & install
```bash
git clone https://github.com/<your‑fork>/decentralized-donation-system.git
cd decentralized-donation-system/frontend-angular
npm install
```

### 2. Deploy Contracts (Remix)
1. Open **Remix** and import `backend-solidity/contracts/`.
2. Compile with *Solidity 0.8.x*.
3. **Deploy** `DonationControl` then `DonationSystem` (from `donor.sol`) – pass the address of `DonationControl` if required by the constructor.

> **Hardhat alternative**
> ```bash
> cd backend-solidity
> npm install
> npx hardhat compile
> npx hardhat run scripts/deploy.ts --network sepolia
> ```

### 3. Configure Frontend
Edit `src/environments/environment.ts`:
```ts
export const environment = {
  donationAddress: '0xYOUR_DONATION_CONTRACT',
  controlAddress:  '0xYOUR_ORG_CONTROL_CONTRACT',
  network:         'sepolia' // or hardhat
};
```

### 4. Run Angular
```bash
npm start        # http://localhost:4200
```
Connect MetaMask → switch to the configured network.

---

## 🔑 Contract API (excerpt)

| Contract | Function | Purpose |
|----------|----------|---------|
| `DonationControl` | `addOrganization(string name, address wallet)` | NGO applies for listing |
| | `approveOrganization(uint id)` *(admin)* | Marks org as approved |
| | `likeOrganization(uint id)` | Up‑vote an NGO |
| `DonationSystem` | `commitDonation(uint256 amount, bytes32 hash, uint orgId)` | Pay & commit hash |
| | `revealDonation(uint donationId, uint secret)` | Reveal secret to confirm |
| | `withdraw(uint orgId)` | Org pulls its available funds |

Full NatSpec docs are embedded in the `.sol` files.

---

## 🧪 Testing

### Solidity
```bash
cd backend-solidity
npm test  # Hardhat + chai
```

### Angular
```bash
npm run test   # Karma + Jasmine
```

---

## 🌐 Roadmap
- DAO‑based governance for organization approval
- Reputation oracle integration (Gitcoin Passport)
- Permit‑style gas‑less donations (EIP‑2612)
- IPFS metadata for NFTs

---

> Built with ❤️ for transparent giving.

