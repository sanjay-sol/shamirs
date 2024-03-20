"use client";
import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { decryptFile } from '../utils/decFile.js';

const DecryptionComponent = () => {
  const [encryptedFileBlob, setEncryptedFileBlob] = useState(null);
  const [hexKey, setHexKey] = useState('');

  const hexStringToBuffer = (hexString) => {
    const buffer = new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    return buffer;
  };

    const handleDecryption = () => {
      
    if (!encryptedFileBlob || !hexKey) {
      alert('Please provide the encrypted file and the hex key.');
      return;
    }

    // Convert the hex key to buffer
    const symmetricKey = hexStringToBuffer(hexKey);

    // Read the encrypted file
    const reader = new FileReader();
    reader.onload = function () {
      // Decrypt the file
      const decryptedData = decryptFile(Buffer.from(this.result), symmetricKey);

      // Convert decrypted data to blob
      const decryptedBlob = new Blob([decryptedData]);

      // Save the decrypted blob as a file
      saveAs(decryptedBlob, 'decrypted_file');
    };
    reader.readAsArrayBuffer(encryptedFileBlob);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEncryptedFileBlob(file);
  };

  return (
    <div>
      <h2>Decryption Component</h2>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter Hex Key"
        value={hexKey}
        onChange={(e) => setHexKey(e.target.value)}
      />
      <button onClick={handleDecryption}>Decrypt File</button>
    </div>
  );
};

export default DecryptionComponent;
