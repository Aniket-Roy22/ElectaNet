# Blockchain Voting Network

## 📑 Table of Contents

* [Overview](#-overview)
* [Features](#-features)
* [Architecture](#-architecture)
* [Technology Stack](#-technology-stack)
* [Smart Contract Design](#-smart-contract-design)
* [Data Model](#-data-model)
* [Contract Functions](#-contract-functions)
* [Project Structure](#-project-structure)
* [Installation](#-installation)
* [Deployment](#-deployment)
* [Testing](#-testing)
* [Security Considerations](#-security-considerations)

---

# 📖 Overview

Traditional voting systems often suffer from a lack of transparency, centralized control, and limited auditability.

This project leverages blockchain technology to provide:

* Immutable election records
* Transparent vote counting
* Decentralized verification
* One-vote-per-election enforcement
* On-chain election results

Every vote is permanently recorded on-chain and can be independently verified.

---

# ✨ Features

| Feature                | Description                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| Election Creation      | Administrators can create elections with custom start and end times |
| Candidate Management   | Candidates can be reused across multiple elections                  |
| One Vote Per Election  | Prevents duplicate voting within the same election                  |
| Multi-Election Support | Users may vote once in each election                                |
| On-Chain Vote Counting | Vote totals are stored and calculated on-chain                      |
| Transparent Results    | Anyone can verify election outcomes                                 |
| Time-Based Elections   | Elections automatically transition through lifecycle states         |

---

# 🏗️ Architecture

```text
                    ┌────────────────────┐
                    │    Election Owner  │
                    └──────────┬─────────┘
                               │
                 ┌─────────────▼─────────────┐
                 │      Voting Contract      │
                 └─────────────┬─────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   Elections            Candidates            Vote Records
          │                    │                    │
          └────────────┬───────┴────────────┬───────┘
                       ▼                    ▼
                Election-Candidate     Voter Status
                    Mapping             Tracking
```

---


# 📜 Smart Contract Design

## Election

```solidity
struct Election {
    uint256 id;
    string title;
    uint256 startTime;
    uint256 endTime;
}
```

Represents a voting event with a unique identifier and active voting period.

---

## Candidate

```solidity
struct Candidate {
    uint256 id;
    string name;
}
```

Candidates are stored independently and may participate in multiple elections.

---

## Election Result

```solidity
struct ElectionResult {
    uint256 candidateId;
    uint256 voteCount;
}
```

Used for retrieving election results efficiently.

---

# 🗄 Data Model

## Elections

```text
Election ID
    │
    ▼
Election Data
```

---

## Candidates

```text
Candidate ID
    │
    ▼
Candidate Data
```

---

## Election Participation

```text
Election 1
 ├── Candidate 1
 ├── Candidate 2
 └── Candidate 3

Election 2
 ├── Candidate 1
 └── Candidate 4
```

---

## Voting Records

```text
Election ID
    │
    ▼
Wallet Address
    │
    ▼
Has Voted?
```

This structure guarantees:

* One vote per wallet per election
* Multiple elections supported
* Candidate reusability

---

# ⚙ Contract Functions

## Administration

| Function                 | Purpose                      |
| ------------------------ | ---------------------------- |
| createCandidate()        | Create a new candidate       |
| createElection()         | Create a new election        |
| addCandidateToElection() | Assign candidate to election |

---

## Voting

| Function | Purpose     |
| -------- | ----------- |
| vote()   | Cast a vote |

---

## Queries

| Function                  | Purpose                        |
| ------------------------- | ------------------------------ |
| getElectionById()         | Retrieve election information  |
| getCandidateById()        | Retrieve candidate information |
| getElectionCandidateIds() | Retrieve election candidates   |
| getVoteCount()            | Retrieve vote totals           |
| getElectionResults()      | Retrieve all election results  |
| userHasVoted()            | Check voter status             |
| getElectionStatus()       | Get election lifecycle state   |

---

# 📂 Project Structure

```text
.
├── src/
│   └── Voting.sol
│
├── scripts/
│   ├── VotingDeploy.s.sol
│   └── Interactions.s.sol
│
├── test/
│   └── Voting.t.sol
│
├── lib/
│
├── foundry.toml
└── README.md
```

---

# 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/Aniket-Roy22/Blockchain-Voting-Network.git
```

```bash
cd Blockchain-Voting-Network
```

Install Foundry dependencies:

```bash
forge install
```

Build:

```bash
forge build
```

---

# 🚀 Deployment

Deployed at: [Contract Address](https://sepolia.etherscan.io/address/0x112b0Ec8794fF67A92dd2047A2364Cad1FF5D22C)

---

# 🧪 Testing

Run the complete test suite:

```bash
forge test
```

Verbose output:

```bash
forge test -vvv
```

Gas report:

```bash
forge test --gas-report
```

Coverage:

```bash
forge coverage
```

---

# 🔒 Security Considerations

| Consideration             | Status |
| ------------------------- | ------ |
| Ownership Protection      | ✅      |
| Double Voting Prevention  | ✅      |
| Election Time Validation  | ✅      |
| Candidate Validation      | ✅      |
| Election Validation       | ✅      |
| Transparent Vote Counting | ✅      |