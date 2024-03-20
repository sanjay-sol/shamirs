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

    const symmetricKey = hexStringToBuffer(hexKey);

    const reader = new FileReader();
    reader.onload = function () {

      const decryptedData = decryptFile(Buffer.from(this.result), symmetricKey);

      const decryptedBlob = new Blob([decryptedData]);

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
      
          <div className="relative flex flex-col items-center ">
              <label className="font-medium text-gray-400 ">
                Decrypt the File
              </label>
              <div className="extraOutline p-4  bg-gray-700 w-max bg-whtie mt-4 rounded-lg ">
                  <div className="file_upload flex flex-col p-5 relative border-4 border-dotted border-gray-500 rounded-lg">
                        <input
                                  type="text"
                                  className='p-2 rounded-md bg-slate-200 '
        placeholder="Enter Secret Key"
        value={hexKey}
        onChange={(e) => setHexKey(e.target.value)}
                      />
                      <br />
                  <svg
                    className="text-violet-400 w-24 mx-auto mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className="input_field flex flex-col w-max mx-auto text-center">
                    <label>
                      <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileChange}
                              />
                             
                      <button
                       onClick={handleDecryption}
                        className="text bg-violet-400 text-gray-800 border border-gray-800 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-violet-500"
                      >
                        Decrypt
                      </button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
};

export default DecryptionComponent;
