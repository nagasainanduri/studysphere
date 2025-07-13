**StudySphere** is a decentralized application (dApp) built on the Internet Computer (IC) using Motoko, designed to facilitate collaborative learning through study groups, note-sharing as non-fungible tokens (NFTs), and a token-based reward system. This README details the backend features, architecture, and setup instructions for various systems, excluding the frontend.

## Table of Contents
- [Overview](#overview)
- [Smart Contracts & Features](#)
  - [User Management](#user-management)
  - [Group Management](#group-management)
  - [Note NFT Management](#note-nft-management)
  - [StudyToken Management](#studytoken-management)
- [Project Structure](#project-structure)
- [Setup Guides](#setup-guides)
  - [Prerequisites](#prerequisites)
  - [macOS](#macos)
  - [Linux (Ubuntu/Debian)](#linux-ubuntudebian)
  - [Windows (via WSL)](#windows-via-wsl)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview
StudySphere enables users to register, create or join study groups, share notes as NFTs, and earn or spend StudyTokens for contributions and purchases. The backend is implemented as a single canister in Motoko, with modular components for user management, group management, note NFTs, and token handling. All data is stored persistently using `HashMap` structures, and the system ensures registered users can interact securely with groups and notes.

## Smart Contracts &  Features

### User Management
Managed by `user.mo`, this module handles user registration and profile management.

- **Register User**:
  - Function: `registerUser(caller: Principal, username: Text): async ?Principal`
  - Allows a user to register with a unique username (1-50 characters).
  - Stores user data (`Principal`, `username`, `createdAt`) in a `HashMap<Principal, User>`.
  - Returns the user's `Principal` on success, or `null` if the username is invalid or already taken.

- **Get User**:
  - Function: `getUser(caller: Principal): async ?User`
  - Query function to retrieve a user’s profile by their `Principal`.
  - Returns `?User` (with `id`, `username`, `createdAt`) or `null` if not registered.

### Group Management
Managed by `group.mo`, this module supports creating, joining, and managing study groups.

- **Create Group**:
  - Function: `createGroup(caller: Principal, name: Text, isPublic: Bool, isRegistered: Bool): async ?Types.GroupId`
  - Registered users can create public or private groups with a name (1-100 characters).
  - Stores group data (`id`, `name`, `creator`, `members`, `createdAt`, `isPublic`) in a `HashMap<GroupId, Group>`.
  - Returns the group ID or `null` if invalid.

- **Join Group**:
  - Function: `joinGroup(caller: Principal, groupId: Types.GroupId, isRegistered: Bool): async Bool`
  - Registered users can join public groups if not already a member.
  - Updates the group’s `members` array and returns `true` on success, `false` otherwise.

- **Remove Member**:
  - Function: `removeMember(caller: Principal, groupId: Types.GroupId, member: Principal): async Bool`
  - Group creators can remove members (except themselves) from a group.
  - Returns `true` on success, `false` if the caller is not the creator or the member is invalid.

- **Delete Group**:
  - Function: `deleteGroup(caller: Principal, groupId: Types.GroupId): async Bool`
  - Group creators can delete a group, removing it and all associated messages.
  - Returns `true` on success, `false` if the caller is not the creator or the group doesn’t exist.

- **Post Message**:
  - Function: `postMessage(caller: Principal, groupId: Types.GroupId, content: Text, isRegistered: Bool): async ?Types.MessageId`
  - Group members can post messages (1-1000 characters) to a group.
  - Stores messages in a `HashMap<MessageId, Message>` and returns the message ID or `null`.

- **Delete Message**:
  - Function: `deleteMessage(caller: Principal, groupId: Types.GroupId, messageId: Types.MessageId): async Bool`
  - Group creators can delete messages from their group.
  - Returns `true` on success, `false` if the caller is not the creator or the message is invalid.

- **Get Groups**:
  - Function: `getGroups(): [(Types.GroupId, Types.Group)]`
  - Returns all groups as an array of `(GroupId, Group)` tuples (non-query for full access).

### Note NFT Management
Managed by `noteNFT.mo`, this module handles creating, updating, and trading notes as NFTs.

- **Mint Note NFT**:
  - Function: `mintNoteNFT(caller: Principal, title: Text, subject: Text, content: Text, price: Nat, isRegistered: Bool): async ?Types.NoteId`
  - Registered users can create a note NFT with a title, subject, content, and price (≤1,000,000 tokens).
  - Stores the note (`id`, `title`, `subject`, `content`, `owner`, `creator`, `createdAt`, `price`) in a `HashMap<NoteId, NoteNFT>`.
  - Awards StudyTokens based on word count (1 token per 10 words).
  - Returns the note ID or `null` if invalid.

- **Get Note NFT**:
  - Function: `getNoteNFT(noteId: Types.NoteId): async ?Types.NoteNFT`
  - Query function to retrieve a note by its ID.
  - Returns the `NoteNFT` or `null` if not found.

- **Get User Notes**:
  - Function: `getUserNotes(userId: Types.UserId): async [Types.NoteNFT]`
  - Query function to retrieve all notes owned by a user.
  - Returns an array of `NoteNFT` objects or an empty array if the user ID is invalid.

- **Transfer Note NFT**:
  - Function: `transferNoteNFT(caller: Principal, to: Principal, noteId: Types.NoteId): async Bool`
  - Note owners can transfer a note to another registered user.
  - Updates the note’s `owner` and returns `true` on success, `false` if invalid.

- **Purchase Note NFT**:
  - Function: `purchaseNoteNFT(caller: Principal, noteId: Types.NoteId): async Bool`
  - Registered users can purchase a note with a non-zero price using StudyTokens.
  - Transfers tokens from the buyer to the owner, sets the note’s price to 0, and updates ownership.
  - Returns `true` on success, `false` if insufficient tokens or invalid.

### StudyToken Management
Managed by `studyToken.mo`, this module handles the token economy for rewards and purchases.

- **Award Tokens**:
  - Function: `awardTokens(user: Principal, amount: Nat): async Bool`
  - Awards StudyTokens to a registered user (e.g., for creating notes).
  - Updates the user’s balance in a `HashMap<Principal, Nat>` and returns `true`.

- **Spend Tokens**:
  - Function: `spendTokens(user: Principal, amount: Nat): async Bool`
  - Deducts StudyTokens from a user’s balance for note purchases.
  - Returns `true` if the user has sufficient tokens, `false` otherwise.

- **Tranfer Tokens**:
  - Function: `transferTokens(caller: Principal, to: Principal, amount: Nat)`
  - Tranfers the available tokens to another user
  - Returns `true` if the user has sufficient tokens, `false` otherwise.

- **Get Token History**:
  - Function: `getTokenHistory(caller: Principal): async [Types.Transaction]`
  - Gets the token spending history

- **Get Total Tokens**:
  - Function: `getTotalTokens(): async Nat`
  - Gets the user's total number of tokens
  - `True` if user is registered / `False` if not

- **Get Balance**:
  - Function: `getBalance(user: Principal): async Nat`
  - Query function to retrieve a user’s StudyToken balance.
  - Returns the balance or 0 if the user is not registered.

## Project Structure
The backend is organized in a modular structure under `src/studysphere_backend/`:
```
src/studysphere_backend/
├── main.mo           # Main canister actor, orchestrates modules
├── user/
│   └── user.mo       # User management (registration, profiles)
├── group/
│   └── group.mo      # Group management (creation, joining, messaging)
├── note/
│   └── noteNFT.mo    # Note NFT management (creation, trading)
├── token/
│   └── studyToken.mo # StudyToken management (rewards, purchases)
├── types/
│   └── types.mo      # Shared type definitions
```

### Key Types (`types.mo`)
- `User`: `{ id: Principal; username: Text; registeredAt: Int }`
- `Group`: `{ id: Nat; name: Text; creator: Principal; members: [Principal]; createdAt: Int;}`
- `Message`: `{ id: Nat; groupId: Nat; content: Text; sender: Principal; timestamp: Int }`
- `NoteNFT`: `{ id: Nat; title: Text; subject: Text; content: Text; owner: Principal; creator: Principal; createdAt: Int; price: Nat }`
- `UserId`, `GroupId`, `MessageId`, `NoteId`: Aliases for `Principal` or `Nat`.

## Setup Guides

### Prerequisites
- **DFX (Internet Computer SDK)**:
  - Install the DFX CLI (version ≥0.15.0) for canister development and deployment.
- **Node.js**: Required for `dfx` dependencies (version ≥16).
- **Git**: To clone the repository.
- **Internet Computer Identity**: A developer identity for deploying canisters.
- **Operating System**: macOS, Linux (Ubuntu/Debian), or Windows (via WSL).

### macOS
1. **Install Homebrew** (if not installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
2. **Install DFX**:
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```
3. **Install Node.js**:
   ```bash
   brew install node
   ```
4. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/studysphere.git
   cd studysphere/src/studysphere_backend
   ```
5. **Start the Local IC**:
   ```bash
   dfx start --clean --background
   ```
6. **Create a Developer Identity**:
   ```bash
   dfx identity new my-identity
   dfx identity use my-identity
   ```

### Linux (Ubuntu/Debian)
1. **Update Package Manager**:
   ```bash
   sudo apt update && sudo apt upgrade
   ```
2. **Install Dependencies**:
   ```bash
   sudo apt install curl git nodejs npm
   ```
3. **Install DFX**:
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```
4. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/studysphere.git
   cd studysphere/src/studysphere_backend
   ```
5. **Start the Local IC**:
   ```bash
   dfx start --clean --background
   ```
6. **Create a Developer Identity**:
   ```bash
   dfx identity new my-identity
   dfx identity use my-identity
   ```

### Windows (via WSL)
1. **Install WSL2**:
   ```powershell
   wsl --install
   ```
   - Choose Ubuntu as the default distribution.
2. **Open WSL Terminal** and update:
   ```bash
   sudo apt update && sudo apt upgrade
   ```
3. **Install Dependencies**:
   ```bash
   sudo apt install curl git nodejs npm
   ```
4. **Install DFX**:
   ```bash
   sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```
5. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/studysphere.git
   cd studysphere/src/studysphere_backend
   ```
6. **Start the Local IC**:
   ```bash
   dfx start --clean --background
   ```
7. **Create a Developer Identity**:
   ```bash
   dfx identity new my-identity
   dfx identity use my-identity
   ```

## Deployment
1. **Configure `dfx.json`**:
   Ensure the `dfx.json` file in the project root specifies the canister:
   ```json
   {
     "canisters": {
       "studysphere_backend": {
         "main": "src/studysphere_backend/main.mo",
         "type": "motoko"
       }
     },
     "defaults": {
       "build": {
         "packtool": ""
       }
     },
     "version": 1
   }
   ```
2. **Deploy Locally**:
   ```bash
   dfx deploy --network local
   ```
3. **Deploy to IC Mainnet**:
   ```bash
   dfx deploy --network ic
   ```
   - Ensure you have sufficient cycles in your wallet (use `dfx wallet balance` to check).
4. **Interact with the Canister**:
   - Use `dfx canister call` or a frontend to invoke functions (e.g., `dfx canister call studysphere_backend registerUser '("username")'`).

## Testing
1. **Start a Local IC**:
   ```bash
   dfx start --clean --background
   ```
2. **Deploy the Canister**:
   ```bash
   dfx deploy
   ```
3. **Run Tests**:
   - Test user registration:
     ```bash
     dfx canister call studysphere_backend registerUser '("testuser")'
     ```
   - Test group creation:
     ```bash
     dfx canister call studysphere_backend createGroup '("Math Study", true, true)'
     ```
   - Test note minting:
     ```bash
     dfx canister call studysphere_backend mintNoteNFT '("Algebra Notes", "Math", "Content here", 100, true)'
     ```
   - Test queries:
     ```bash
     dfx canister call studysphere_backend getUserGroups '(principal "<your-principal>")'
     dfx canister call studysphere_backend searchNotes '("Math")'
     ```
4. **Validate Output**:
   - Ensure functions return expected results (e.g., group IDs, note IDs, user data).
   - Check token balances after minting or purchasing notes.

5. **Access Frontend**:

   ```bash
   cd src/studysphere_frontend
   npm run start
   ```
   Access the application at `http://localhost:3000`.

## Troubleshooting
- **DFX Start Fails**:
  - Ensure no other `dfx` processes are running: `pkill dfx`.
  - Clear the local IC state: `dfx start --clean`.
- **Canister Deployment Errors**:
  - Verify `dfx.json` paths and Motoko syntax.
  - Check cycle balance for mainnet deployment: `dfx wallet balance --network ic`.
- **Function Call Errors**:
  - Ensure the caller is registered for non-query functions (e.g., `createGroup`, `mintNoteNFT`).
  - Use `principal` types correctly in `dfx canister call` (e.g., `principal "aaaaa-aa"` for anonymous).
- **Syntax Errors**:
  - Run `dfx build` to catch Motoko compilation errors.
  - Check for missing `query` keywords or incorrect `Array.map` usage (as fixed in `group.mo` and `noteNFT.mo`).


## Contributing

- Fork the repository and submit pull requests with your changes.
- Follow the existing code style and include tests for new features.
- Report issues or suggest improvements via GitHub Issues.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- Built for the WCHL 2025 hackathon (deadline: July 25, 2025).
- Powered by the Internet Computer (ICP) and DFINITY’s Internet Identity.
