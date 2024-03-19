"use client";
import React, { useState } from "react";
import crypto from "crypto";

import path from "path";

function DecryptFile({ filePath }) {
  const [secretKey, setSecretKey] = useState("");
  const [decryptedData, setDecryptedData] = useState(null);
  const [error, setError] = useState(null);

  const bufferToHexString = (buffer) => {
    return buffer.toString("hex");
  };

  const hexStringToBuffer = (hexString) => {
    return Buffer.from(hexString, "hex");
  };

  const decryptFile = (encryptedData, symmetricKey) => {
    try {
      const decipher = crypto.createDecipher("aes-256-cbc", symmetricKey);
      let decryptedData = decipher.update(encryptedData);
      decryptedData = Buffer.concat([decryptedData, decipher.final()]);
      return decryptedData;
    } catch (error) {
      throw new Error("Decryption failed. Invalid secret key.");
    }
  };

  const handleDecryption = async () => {
    try {
      const fileExt = path.extname(filePath).slice(1); // Get file extension
      const fileName = path.basename(filePath, path.extname(filePath)); // Get file name without extension

      const hexKey =
        "29a07b8efef3e2d7bb4fe48a82856389807c14681dee4e5b603963ca1d46392e";
      const symmetricKeyBuffer = hexStringToBuffer(hexKey);

      const encryptedFileContent = "/decrypts/your-file.pdf.enc";

      const decryptedData = decryptFile(
        encryptedFileContent,
        symmetricKeyBuffer
      );

      setDecryptedData(decryptedData);
      setError(null);
    } catch (error) {
      setDecryptedData(null);
      setError(error.message);
    }
  };

  return (
    <div>
      <input
        type="password"
        placeholder="Enter secret key"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
      />
      <button onClick={handleDecryption}>Decrypt File</button>
      {error && <p>{error}</p>}
      {decryptedData && (
        <a
          href={`data:application/${fileExt};base64,${decryptedData.toString(
            "base64"
          )}`}
          download={`decrypted_file.${fileExt}`}
        >
          Download Decrypted File
        </a>
      )}
    </div>
  );
}

export default DecryptFile;
