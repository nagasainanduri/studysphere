# StudySphere: Decentralized Learning Platform on the Internet Computer (ICP) Blockchain

**StudySphere** is a decentralized application (dApp) built on the Internet Computer (ICP) blockchain, designed to foster collaborative learning by enabling users to create and join study groups, share notes as non-fungible tokens (NFTs), and earn or spend StudyTokens for contributions and purchases. This README outlines the application's objective, how to use its features, and how it leverages the ICP blockchain for secure, scalable, and decentralized education.

## Table of Contents
- [Objective](#objective)
- [Why ICP Blockchain?](#why-icp-blockchain)
- [How to Use StudySphere](#how-to-use-studysphere)
  - [Getting Started](#getting-started)
  - [User Registration](#user-registration)
  - [Study Groups](#study-groups)
  - [Note NFTs](#note-nfts)
  - [StudyTokens](#studytokens)
- [Interacting with the Canister](#interacting-with-the-canister)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Objective
StudySphere aims to revolutionize education by providing a decentralized platform where students, educators, and learners can:
- **Collaborate in Study Groups**: Create or join public or private study groups to discuss topics, share resources, and communicate via messages.
- **Share Knowledge as NFTs**: Create and trade high-quality notes as NFTs, ensuring ownership and incentivizing content creation.
- **Earn Rewards**: Gain StudyTokens for contributing notes or participating in groups, fostering an economy of knowledge sharing.
- **Ensure Accessibility and Security**: Use the ICP blockchain to provide a transparent, tamper-proof, and scalable platform that operates without intermediaries.

By leveraging the ICP blockchain, StudySphere ensures that user data, group interactions, and note ownership are securely stored on-chain, with low-cost transactions and global accessibility. The platform empowers learners to take control of their education while rewarding valuable contributions.

## Why ICP Blockchain?
The Internet Computer (ICP), developed by DFINITY, is a third-generation blockchain that offers unique advantages for StudySphere:
- **Scalability**: ICP’s canister architecture allows StudySphere to handle thousands of users, groups, and notes efficiently.
- **Low Costs**: Query calls (e.g., retrieving notes or groups) are low-cost or free, and update calls (e.g., creating notes) use minimal cycles.
- **Decentralization**: All data (users, groups, notes, tokens) is stored on-chain, ensuring transparency and resistance to censorship.
- **Smart Contracts (Canisters)**: StudySphere’s backend is a single Motoko canister, providing a secure and programmable environment for all features.
- **Web3 Integration**: Users interact via their ICP principal (a unique identifier), enabling seamless authentication without traditional accounts.

## How to Use StudySphere
StudySphere’s backend is implemented as a Motoko canister on the ICP blockchain, exposing functions for user management, group interactions, note trading, and token handling. Below is a detailed guide on how to use each feature, assuming interaction via the ICP command-line tool (`dfx`) or a frontend (not covered here).

### Getting Started
To use StudySphere, you need:
- An **ICP Identity**: A principal (unique identifier) created via the `dfx` tool or an ICP wallet (e.g., Internet Identity).
- **DFX CLI**: The DFINITY SDK to interact with the canister locally or on the ICP mainnet.
- **Cycles**: The ICP blockchain’s resource for deploying and running canisters (available via an ICP wallet).

**Setup Steps**:
1. **Install DFX**:
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```
2. **Create an Identity**:
   ```bash
   dfx identity new my-identity
   dfx identity use my-identity
   ```
   - This generates your `Principal` (e.g., `aaaaa-aa` for anonymous or a unique ID).
3. **Clone the Repository** (if testing locally):
   ```bash
   git clone https://github.com/your-username/studysphere.git
   cd studysphere/src/studysphere_backend
   ```
4. **Start the Local IC** (for testing):
   ```bash
   dfx start --clean --background
   ```

### User Registration
To participate in StudySphere, you must register with a unique username.

- **Register**:
  - **Function**: `registerUser(username: Text): async ?Principal`
  - **Usage**: Choose a username (1-50 characters) and register to receive your `Principal`.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend registerUser '("testuser")'
    ```
    - Returns `(opt principal "<your-principal>")` on success, or `(null)` if the username is taken or invalid.
  - **Purpose**: Registers you as a user, storing your `Principal`, username, and registration timestamp on the blockchain.

- **Check Profile**:
  - **Function**: `getUser(caller: Principal): async ?User`
  - **Usage**: Retrieve your profile (username, registration date) using your `Principal`.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend getUser '(principal "<your-principal>")'
    ```
    - Returns `(opt record { id = principal "<your-principal>"; username = "testuser"; createdAt = <timestamp> })` or `(null)` if not registered.

### Study Groups
Study groups allow collaboration on specific topics, with public or private access and messaging.

- **Create a Group**:
  - **Function**: `createGroup(name: Text, isPublic: Bool, isRegistered: Bool): async ?Nat`
  - **Usage**: Registered users can create a group with a name (1-100 characters) and specify if it’s public or private.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend createGroup '("Math Study", true, true)'
    ```
    - Returns `(opt <group-id>)` (e.g., `(opt 0)`) or `(null)` if invalid.
  - **Purpose**: Creates a group with you as the creator, stored on-chain with an ID, name, members, and visibility.

- **Join a Public Group**:
  - **Function**: `joinGroup(groupId: Nat, isRegistered: Bool): async Bool`
  - **Usage**: Join a public group by its ID if you’re registered and not already a member.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend joinGroup '(0, true)'
    ```
    - Returns `(true)` on success, `(false)` if the group is private or you’re already a member.

- **Remove a Member**:
  - **Function**: `removeMember(groupId: Nat, member: Principal): async Bool`
  - **Usage**: As a group creator, remove a member from your group (except yourself).
  - **Example**:
    ```bash
    dfx canister call studysphere_backend removeMember '(0, principal "<member-principal>")'
    ```
    - Returns `(true)` on success, `(false)` if invalid.

- **Delete a Group**:
  - **Function**: `deleteGroup(groupId: Nat): async Bool`
  - **Usage**: As a group creator, delete your group and its messages.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend deleteGroup '(0)'
    ```
    - Returns `(true)` on success, `(false)` if you’re not the creator.

- **Post a Message**:
  - **Function**: `postMessage(groupId: Nat, content: Text, isRegistered: Bool): async ?Nat`
  - **Usage**: As a group member, post a message (1-1000 characters) to the group.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend postMessage '(0, "Discuss algebra notes", true)'
    ```
    - Returns `(opt <message-id>)` or `(null)` if invalid.

- **Delete a Message**:
  - **Function**: `deleteMessage(groupId: Nat, messageId: Nat): async Bool`
  - **Usage**: As a group creator, delete a message from your group.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend deleteMessage '(0, 0)'
    ```
    - Returns `(true)` on success, `(false)` if invalid.

### Note NFTs
Notes are created and traded as NFTs, ensuring ownership and enabling a marketplace.

- **Create a Note**:
  - **Function**: `mintNoteNFT(title: Text, subject: Text, content: Text, price: Nat, isRegistered: Bool): async ?Nat`
  - **Usage**: Registered users can create a note NFT with a title, subject, content, and price (≤1,000,000 tokens). Earn StudyTokens (1 per 10 words).
  - **Example**:
    ```bash
    dfx canister call studysphere_backend mintNoteNFT '("Algebra Notes", "Math", "Solve x^2 + 5x + 6 = 0", 100, true)'
    ```
    - Returns `(opt <note-id>)` or `(null)` if invalid.

- **View a Note**:
  - **Function**: `getNoteNFT(noteId: Nat): async ?NoteNFT`
  - **Usage**: Retrieve a note’s details by its ID.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend getNoteNFT '(0)'
    ```
    - Returns `(opt record { id = 0; title = "Algebra Notes"; ... })` or `(null)`.

- **Preview a Note**:
  - **Function**: `getNotePreview(noteId: Nat): async ?Text`
  - **Usage**: View the first 100 characters of a note’s content.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend getNotePreview '(0)'
    ```
    - Returns `(opt "Solve x^2 + 5x + 6 = 0")` or `(null)`.

- **Search Notes**:
  - **Function**: `searchNotes(query: Text): async [NoteNFT]`
  - **Usage**: Find notes by title or subject (partial match, case-sensitive).
  - **Example**:
    ```bash
    dfx canister call studysphere_backend searchNotes '("Math")'
    ```
    - Returns an array of matching notes.

- **Update a Note**:
  - **Function**: `updateNoteNFT(noteId: Nat, title: Text, subject: Text, content: Text): async Result<(), Text>`
  - **Usage**: As a note owner, update its title, subject, or content.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend updateNoteNFT '(0, "Updated Algebra Notes", "Math", "New content")'
    ```
    - Returns `(variant { ok = () })` or `(variant { err = "Not owner" })`.

- **View Your Notes**:
  - **Function**: `getUserNotes(userId: Principal): async [NoteNFT]`
  - **Usage**: Retrieve all notes you own.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend getUserNotes '(principal "<your-principal>")'
    ```
    - Returns an array of your notes.

- **Transfer a Note**:
  - **Function**: `transferNoteNFT(to: Principal, noteId: Nat): async Bool`
  - **Usage**: As a note owner, transfer it to another registered user.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend transferNoteNFT '(principal "<recipient-principal>", 0)'
    ```
    - Returns `(true)` on success, `(false)` if invalid.

- **Purchase a Note**:
  - **Function**: `purchaseNoteNFT(noteId: Nat): async Bool`
  - **Usage**: Buy a note with a non-zero price using StudyTokens. The note’s price is set to 0, and tokens are transferred to the owner.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend purchaseNoteNFT '(0)'
    ```
    - Returns `(true)` on success, `(false)` if insufficient tokens or invalid.

### StudyTokens
StudyTokens incentivize contributions and facilitate note trading.

- **Earn Tokens**:
  - **Function**: `awardTokens(user: Principal, amount: Nat): async Bool`
  - **Usage**: Automatically called when minting notes (1 token per 10 words). Tokens are added to your balance.
  - **Example**: Not directly called by users; triggered via `mintNoteNFT`.

- **Spend Tokens**:
  - **Function**: `spendTokens(user: Principal, amount: Nat): async Bool`
  - **Usage**: Automatically called when purchasing notes. Deducts tokens from your balance.
  - **Example**: Triggered via `purchaseNoteNFT`.

- **Check Balance**:
  - **Function**: `getBalance(user: Principal): async Nat`
  - **Usage**: View your StudyToken balance.
  - **Example**:
    ```bash
    dfx canister call studysphere_backend getBalance '(principal "<your-principal>")'
    ```
    - Returns your token balance (e.g., `100`).

## Interacting with the Canister
StudySphere’s backend is a single Motoko canister (`studysphere_backend`) deployed on the ICP blockchain. You can interact with it:
- **Locally**:
  1. Deploy the canister:
     ```bash
     dfx deploy --network local
     ```
  2. Use `dfx canister call` commands as shown above.
- **Mainnet**:
  1. Deploy to ICP:
     ```bash
     dfx deploy --network ic
     ```
     - Ensure you have cycles in your wallet (`dfx wallet balance --network ic`).
  2. Call functions using the canister ID (e.g., `dfx canister call <canister-id> registerUser '("testuser")'`).
- **Via Frontend**: A frontend (not covered here) typically calls these functions using the Candid interface generated by `dfx`.

**Candid Interface**:
The canister exposes all functions via Candid, allowing frontend integration or direct calls. Example Candid snippet:
```candid
service : {
  registerUser: (text) -> (opt principal) query;
  createGroup: (text, bool, bool) -> (opt nat);
  mintNoteNFT: (text, text, text, nat, bool) -> (opt nat);
  getBalance: (principal) -> (nat) query;
  // ... other functions
}
```

## Troubleshooting
- **Invalid Principal**:
  - Ensure you use your correct `Principal` (check with `dfx identity get-principal`).
- **Insufficient Cycles**:
  - Top up your wallet: `dfx wallet top-up --network ic`.
- **Function Call Fails**:
  - Verify registration: Call `registerUser` first for non-query functions.
  - Check input validity (e.g., non-empty strings, valid group/note IDs).
- **Local IC Not Running**:
  - Start with `dfx start --clean --background`.
  - Stop conflicting processes: `pkill dfx`.
- **Canister Not Found**:
  - Ensure deployment: `dfx deploy`.
  - Check canister ID: `dfx canister id studysphere_backend --network ic`.

## License
MIT License. See [LICENSE](LICENSE) for details.