# StudySphere

StudySphere is a decentralized educational platform built on the Internet Computer (ICP) using Motoko for the backend and React for the frontend. It leverages blockchain technology to provide secure user authentication and manage educational resources, enabling students and educators to interact in a decentralized environment.

## Features

### 1. Internet Identity Authentication

- **Secure Login**: Utilizes DFINITY's Internet Identity (`https://identity.ic0.app`) for decentralized, privacy-preserving user authentication.
- **Principal Management**: Securely handles user principal IDs, ensuring authenticated access to platform features.
- **Implementation**: Authentication logic is modularized in `auth.js`, using `@dfinity/auth-client` for seamless integration with ICP.

### 2. Motoko Backend

- **Canister**: Deployed at `u6s2n-gx777-77774-qaaba-cai` on the ICP mainnet, managing core platform logic.
- **Modules**:
  - `main.mo`: Entry point for backend operations, including user registration via the `registerUser` function.
  - `user.mo`: Manages user profiles and authentication data.
  - `types.mo`: Defines shared data structures for the platform.
  - `group.mo`: Supports group creation and management for collaborative learning.
  - `noteNFT.mo`: Enables creation and management of note-based NFTs for educational content.
  - `studyToken.mo`: Manages a token system for rewarding study activities.
- **Purpose**: Provides a scalable, decentralized backend for storing and managing educational data securely.

### 3. React Frontend

- **Framework**: Built with React (`^18.2.0`) and Vite (`^5.0.0`) for fast development and optimized builds.
- **Files**:
  - `App.jsx`: Core frontend component for user interaction.
  - `auth.js`: Handles Internet Identity login and logout logic.
  - `index.jsx`: Entry point for rendering the React application.
  - `index.html`: Defines the HTML structure for the frontend.
- **Purpose**: Facilitates user interaction with the backend through a responsive interface.

### 4. DFX Integration

- **Version**: Uses DFX `0.27.0` for canister management and deployment.
- **Canisters**:
  - `studysphere_backend`: Motoko-based backend logic.
  - `studysphere_frontend`: React-based frontend assets.
  - `internet_identity`: Custom canister for authentication, integrated with ICP’s mainnet II (local II Canister for testing).
- **Configuration**: Defined in `dfx.json` for local and mainnet deployment.

## Prerequisites

- **DFX**: Version `0.27.0` (Internet Computer SDK).
- **Node.js**: Version 16 or higher for frontend development.
- **Git**: For version control and cloning the repository.

## Running on Local Testnet

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/nagasainanduri/studysphere.git
   cd StudySphere
   ```

2. **Install DFX**:

   ```bash
   DFX_VERSION=0.27.0 sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"
   ```

3. **Install Frontend Dependencies**:

   ```bash
   cd src/studysphere_frontend
   npm install
   ```

4. **Start DFX Local Testnet**:

   ```bash
   cd /home/$HOME/Documents/studysphere
   dfx start --clean --background
   ```

5. **Deploy Canisters Locally**:

   ```bash
   dfx deploy internet_identity --argument null
   dfx deploy studysphere_backend
   dfx deploy studysphere_frontend
   ```

6. **Access Frontend**:

   ```bash
   cd src/studysphere_frontend
   npm run start
   ```

   Access the application at `http://localhost:3000`.

## Contributing

- Fork the repository and submit pull requests with your changes.
- Follow the existing code style and include tests for new features.
- Report issues or suggest improvements via GitHub Issues.

## License

This project is licensed under the MIT License (to be added).

## Acknowledgments

- Built for the WCHL 2025 hackathon (deadline: July 25, 2025).
- Powered by the Internet Computer (ICP) and DFINITY’s Internet Identity.