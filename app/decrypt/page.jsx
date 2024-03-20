"use client";
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import crypto from 'crypto';

const CryptoDemo = () => {
  const [textToEncrypt, setTextToEncrypt] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [hashToDecrypt, setHashToDecrypt] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const accounts = await ethereum.request({
            method: 'eth_requestAccounts',
          });
          const provider = new ethers.providers.Web3Provider(ethereum);
          const connectedSigner = provider.getSigner();
          setSigner(connectedSigner);
        } else {
          console.error('MetaMask extension not installed');
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    };

    connectWallet();
  }, []);

  // Function to encrypt text with receiver's public key
  const encryptText = async () => {
    try {
      // Ensure receiver's address is provided
      if (!receiverAddress) {
        console.error('Receiver address is required.');
        return;
      }

      // Encrypt text
      const receiverPublicKeyBytes = Buffer.from(receiverAddress.replace('0x', ''), 'hex');
      const encryptedData = crypto.publicEncrypt(
        {
          key: receiverPublicKeyBytes,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(textToEncrypt)
      );
      setEncryptedText(encryptedData.toString('base64'));
    } catch (error) {
      console.error('Error encrypting text:', error);
    }
  };

  // Function to decrypt text with private key
  const decryptText = async () => {
    try {
      if (!signer) {
        console.error('MetaMask connection not established');
        return;
      }

      const privateKey = await signer.getPrivateKey();

      const privateKeyBytes = Buffer.from(privateKey.substring(2), 'hex');
      const hashBytes = Buffer.from(hashToDecrypt, 'hex');

      // Use ethers to recover the public key from the hash
      const recoveredPublicKey = ethers.utils.recoverPublicKey(hashBytes, privateKeyBytes);

      // If the recovered public key matches the sender's public key, proceed with decryption
      if (recoveredPublicKey) {
        const decryptedData = crypto.privateDecrypt(
          {
            key: privateKeyBytes,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
          },
          Buffer.from(encryptedText, 'base64')
        );
        setDecryptedText(decryptedData.toString());
      } else {
        console.error('Recovery failed. Public key does not match.');
      }
    } catch (error) {
      console.error('Error decrypting text:', error);
    }
  };

  return (
    <div className='text-white'>
      <h2>Encryption</h2>
      <label>Text to Encrypt:</label>
      <input type="text" className='text-black' value={textToEncrypt} onChange={(e) => setTextToEncrypt(e.target.value)} />
      <br />
      <label> Receivers Address:</label>
      <input type="text" className='text-black' value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} />
      <br />
      <button onClick={encryptText}>Encrypt</button>
      <p>{encryptedText}</p>
      
      <h2>Decryption</h2>
      <label>Hash to Decrypt:</label>
      <input type="text" className='text-black' value={hashToDecrypt} onChange={(e) => setHashToDecrypt(e.target.value)} />
      <br />
      <button onClick={decryptText}>Decrypt</button>
      <br />
      <label>Decrypted Text:</label>
      <div>{decryptedText}</div>
    </div>
  );
};

export default CryptoDemo;
