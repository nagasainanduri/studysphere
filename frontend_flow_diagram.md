# StudySphere Frontend Flow Diagram

```
[Landing Page]
  ├── Display: Logo, Headline, Subheading, Login Button
  ├── Action: Login with Internet Identity
  ├── Links:
  │   ├── [About Page]
  │   │   └── Display: Platform purpose, features overview
  │   │       └── Link: Back to Landing Page
  │   └── [How It Works Page]
  │       └── Display: Steps for using groups, notes, tokens
  │           └── Link: Back to Landing Page
  │
  └── Condition: If Login Successful
       └── [Dashboard] (Authenticated)
             ├── Display: User info, token balance, group/note summaries
             ├── Actions: Logout, Navigate to core pages
             ├── Links:
             │   ├── [Groups Page]
             │   │   ├── Display: List of user’s groups, create/join group forms
             │   │   ├── Actions: Create group, Join group, Remove member, Delete group, Delete message
             │   │   └── Link: Back to Dashboard
             │   ├── [Notes Page]
             │   │   ├── Display: User’s NFT notes, available notes for purchase
             │   │   ├── Actions: Mint note, Purchase note, Transfer note
             │   │   └── Link: Back to Dashboard
             │   └── [Tokens Page]
             │       ├── Display: Token balance, transfer history, transfer form
             │       ├── Actions: Transfer tokens
             │       └── Link: Back to Dashboard
             │
             └── Condition: If Logout
                  └── Return to [Landing Page]
```

## Page Details
- **Landing Page**: Unauthenticated entry point. Shows logo, headline ("Master Your Studies"), subheading, and login button. Links to About and How It Works pages.
- **About Page**: Static page with platform overview (e.g., "Decentralized learning with NFT notes and token rewards").
- **How It Works Page**: Static page explaining key actions (e.g., "Create NFT notes," "Join study groups," "Earn tokens").
- **Dashboard**: Authenticated hub. Shows user’s Principal ID, token balance (`getTokens`), and summaries of groups (`getUserGroups`) and notes (`getUserNotes`).
- **Groups Page**: Lists groups (`getUserGroups`), allows creating (`createGroup`), joining (`joinGroup`), managing members (`removeMember`), and moderating messages (`deleteMessage`).
- **Notes Page**: Lists user’s NFT notes (`getUserNotes`), available notes for purchase (`getNoteNFT`), and forms for minting (`mintNoteNFT`), purchasing (`purchaseNoteNFT`), and transferring (`transferNoteNFT`).
- **Tokens Page**: Shows token balance (`getTokens`), transfer history, and a form to transfer tokens (`transferTokens`).

## Navigation Flow
- **Unauthenticated Users**:
  - Start at Landing Page.
  - Can navigate to About or How It Works pages.
  - Must log in to access Dashboard and core pages.
- **Authenticated Users**:
  - Redirect to Dashboard after login.
  - Navigate to Groups, Notes, or Tokens pages.
  - Logout returns to Landing Page.
- **Backend Integration**:
  - Uses `@dfinity/agent` to call canister functions (e.g., `mintNoteNFT`, `getTokens`).
  - Authentication via Internet Identity (`auth.js`).

## Notes
- **Greyscale Styling**: All pages use greyscale light mode (`bg-gray-100`, `text-gray-900`, `bg-gray-700` for buttons).
- **Responsive**: Uses Tailwind CSS (`max-w-7xl`, `px-4`, `grid`) for responsiveness.
- **Accessibility**: High-contrast greyscale, semantic HTML, `aria-label` for buttons.