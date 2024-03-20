"use client";
import React, { useState } from 'react';

const FileDecryption = () => {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  
  const handleKeyChange = (event) => {
    setKey(event.target.value);
  };

  const decryptFile = async () => {
    if (!file || !key) {
      setError('Please select a file and enter a decryption key.');
      return;
    }

    try {
      const fileContent = await readFile(file);
      const decryptedData = await decryptData(fileContent, key);
      const blob = new Blob([decryptedData], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.enc', '');
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error decrypting file:', error);
      setError('Error decrypting file. Please check the decryption key.');
    }
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const decryptData = async (fileContent, key) => {
    const keyBuffer = hexStringToBuffer(key);
    const iv = new Uint8Array(16); // IV must be the same as the one used during encryption
    const algorithm = { name: 'AES-CBC', iv };
    const cryptoKey = await crypto.subtle.importKey('raw', keyBuffer, algorithm, false, ['decrypt']);
    const decryptedData = await crypto.subtle.decrypt(algorithm, cryptoKey, fileContent);
    return decryptedData;
  };

  const hexStringToBuffer = (hexString) => {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".enc" />
      <input type="text" value={key} onChange={handleKeyChange} placeholder="Enter decryption key" />
      <button onClick={decryptFile}>Decrypt File</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default FileDecryption;
