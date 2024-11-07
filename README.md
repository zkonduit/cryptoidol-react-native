# CryptoIdol React Native Application

This is the **React Native** port of the website [cryptoidol.tech](https://cryptoidol.tech), designed to run on **iOS
17.5** and higher. The application leverages the power of on-device machine learning to assess users' singing skills and
allows them to mint a unique NFT based on their performance (coming soon).

**Recommended Device**: The app is optimized for **iPhone 15 Pro** or higher due to memory-intensive processes (RAM
requirement: 4GB+).

## Features

### 1. Record Your Singing 🎤

With the CryptoIdol app, you can record your singing directly through your iPhone. The app captures and processes the
recording locally, ensuring privacy and efficiency. This is the core functionality of the app, providing a user-friendly
interface to showcase your talent.

<img src="docs/record_singing.png" alt="Record Your Singing" width="30%">

### 2. Local Scoring with Machine Learning 🧠

The app uses an on-device machine learning model to **evaluate the quality of your singing**. The scoring happens
entirely on your device, meaning your recording never leaves your phone, ensuring privacy. The score is based on factors
such as pitch, rhythm, and clarity, offering an objective measure of your performance.

<img src="docs/local_scoring.png" alt="Local Scoring with Machine Learning" width="30%">

### 3. Generate Cryptographic Proof of Your Score 🔐

Once you have your score, the app allows you to generate a **cryptographic proof**
using [EZKL iOS Bindings](https://github.com/zkonduit/ezkl-swift-package). This proof ensures that your score is
authentic and has not been tampered with. The proof generation is performed locally, and this feature provides
transparency and trust in your singing score.

<img src="docs/generate_proof.png" alt="Generate Cryptographic Proof of Your Score" width="30%">

### 4. Mint a Unique NFT (Work in Progress) 🎨

In future versions, the app will allow you to mint a **unique NFT** based on your singing score. This NFT will be
generated as a reward for your performance, creating a verifiable and unique asset representing your talent. The NFT
minting feature is currently in development and will be released in upcoming updates.

## Requirements

- **iOS Version**: 17.5 or higher
- **Recommended Device**: iPhone 15 Pro or higher (due to RAM requirements)
- **RAM Requirement**: 4GB+ for smooth processing of the machine learning model and proof generation

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone https://github.com/zkonduit/cryptoidol-react-native.git
   ```
2. **Install dependencies**:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```
3. **Install iOS dependencies**:
   ```
   cd ios && pod install
   ```
4. **Run the app** (must be tested on a real iPhone due to hardware-specific features):
   ```
   react-native run-ios
   ```

### Notes:

- **CryptoIdol Rendering**: The avatar (dancing girl) will only render on a physical device. It will not appear on
  simulators due to hardware constraints. Ensure you test on a real iPhone for full functionality.
- **NFT Minting**: This feature is currently a work in progress. Future updates will unlock the ability to mint NFTs
  based on your singing performance.

## Future Updates

- **NFT Minting**: Full integration with blockchain technologies to allow users to mint their singing performance as
  unique NFTs.
- **Performance Improvements**: Ongoing optimizations to ensure smoother performance on older devices.
