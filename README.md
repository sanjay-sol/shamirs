# Secure Vault System on Blockchain

## Overview
This project aims to develop a secure vault system leveraging blockchain technology and cryptographic techniques. The system allows users to securely store and access their files while ensuring data integrity, confidentiality, and authenticity.

## System Architecture

![evault](https://github.com/sanjay-sol/commitzz/assets/114111046/c23ef5f4-9063-4d98-92c0-e67cd834799e)

## Features
- **User Authentication:** Users can log in using their MetaMask wallet address, ensuring secure access to the platform.
- **File Upload:** Users can upload files to the vault system, initiating the encryption process.
- **Encryption:** Uploaded files are encrypted using the AES-256 symmetric encryption algorithm for confidentiality.
- **Key Distribution:** The symmetric encryption key is divided using Shamir's Secret Sharing scheme and distributed to designated entities for secure storage.
- **Digital Signatures:** A signature is generated using the user's MetaMask private key to authenticate the file and its contents.
- **Access Control:** Users can specify access control settings, such as public or private, to regulate access to their files.
- **Blockchain Storage:** File metadata, including filename, size, file hash, Shamir's Secret Sharing parameters, access control settings, timestamp, user public key, and signature, are stored on the blockchain.
- **File Retrieval:** Users can retrieve the required key parts from authorized entities to reconstruct the symmetric key for decryption.
- **Data Integrity Check:** Users can verify the integrity of the file by comparing its hash stored on the blockchain with the recalculated hash.
- **Authentication:** The authenticity of the file is verified using the digital signature and the user's MetaMask public key stored on the blockchain.

## Installation
1. Clone the repository:
``` 
git clone https://github.com/sanjay-sol/shamirs
```
2. Install dependencies:
```
npm Install

Note: Have Metamask installed
```

## Pinata Setup
```
get pinata credentials from https://www.pinata.cloud/

API_KEY = "pwx..."
API_SECRET = "Qmcisewr34....."
```

## Usage
1. Start the application:
```
npm run dev
```
2. Access the application at http://localhost:3000 in your web browser.


## Contact
For any inquiries or feedback, please contact [email](mailto:sanjaysirangi@gmail.com).
