"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import crypto from "crypto";
import { encryptFileWithKey } from "../utils/encryptFile.js";
import { exportKeys } from "../utils/exportkeys.js";
import { ethers } from "ethers";
const Upload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Please Select any File");
  const [ipfshash, setipfshash] = useState(null);
  const [key, setKey] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [data, setData] = useState([]);
  const [contract, setContract] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !file[0]) {
      alert("Please select a file");
      return;
    }
    try {
      console.log("File:", file[0]);

      const symmetricKey = crypto.randomBytes(32);
      console.log("Symmetric Key:", symmetricKey.toString("hex"));

      const {
        encryptedBlob,
        encryptedFileName,
        symmetricKey: symmetricKeyHex,
      } = await encryptFileWithKey(file[0], symmetricKey);

      const formData = new FormData();
      formData.append("file", encryptedBlob, encryptedFileName); // Use encryptedBlob instead of encryptedData

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: "514787962d7d2725022d",
          pinata_secret_api_key:
            "1486a1291f9ecc0cc8de3b60eb538a225b6f1ee2b193edf924f7faec2eec2588",
          "Content-Type": "multipart/form-data",
        },
      });

      let shares = exportKeys(symmetricKeyHex, 5, 2);
      let keys = [];
      for (let i = 0; i < shares.length; i++) {
        keys.push(`${shares[i][1]}`);
      }
      const data = {
        public_key: "public_key",
        name: encryptedFileName,
        ipfshash: resFile.data.IpfsHash,
        size: file[0].size,
        keys: [...keys, symmetricKeyHex],
      };

      const res = await axios.post("/api/ipfs", data);
      setipfshash(resFile.data.IpfsHash);
    } catch (error) {
      console.error("Error:", error);
      alert("Can't upload file to Pinata");
    }

    alert("Image Uploaded Successfully");
    setFileName("Select another file");
    setFile(null);
  };

  const retrieveFile = (e) => {
    const fileList = Array.from(e.target.files);
    setFile(fileList);
    setFileName(
      fileList.length > 1
        ? `${fileList.length} files selected`
        : fileList[0].name
    );
  };

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0xE5bC89D74a6c47Afe02ED3f238e337135fd1FFbd";
      const contractABI = [
        {
          inputs: [
            {
              internalType: "string",
              name: "_key",
              type: "string",
            },
            {
              internalType: "string",
              name: "_ipfsHash",
              type: "string",
            },
          ],
          name: "uploadData",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "getData",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
            {
              internalType: "string[]",
              name: "",
              type: "string[]",
            },
            {
              internalType: "string[]",
              name: "",
              type: "string[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "uploaders",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "userData",
          outputs: [
            {
              internalType: "address",
              name: "uploader",
              type: "address",
            },
            {
              internalType: "string",
              name: "key",
              type: "string",
            },
            {
              internalType: "string",
              name: "ipfsHash",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ];
      try {
        const { ethereum } = window;
        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });
        }
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contract);
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);
  const handleUpload = async () => {
    try {
      const tx = await contract.uploadData(key, ipfsHash);
      await tx.wait();
      console.log("Data uploaded successfully!");
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const result = await contract.getData();
      console.log("Fetched data:", result);
      const arr = result[0].map((address, index) => {
        return [address, result[1][index], result[2][index]];
      });
      console.log("Array:", arr);
      setData(arr);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderUi = () => {
    return (
      <div className="text-white">
        <h1>Data Storage App</h1>
        <div>
          <label>
            Key:
            <input
              className="text-black"
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            IPFS Hash:
            <input
              className="text-black"
              type="text"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button onClick={handleUpload}>Upload Data</button>
          <button onClick={fetchData}>Fetch Data</button>
        </div>
        <div>
          <h2>Uploaded Data:</h2>
          -----------------
          <ul>
            {data &&
              data.map((item, index) => (
                <li key={index}>
                  <p>Uploader: {item[0]}</p>
                  <p>Key: {item[1]}</p>
                  <p>IPFS Hash: {item[2]}</p>
                  -----------------
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="top1 text-white flex flex-col justify-center items-center">
        <strong className="text-xxl-center">UPLOAD TO IPFS NETWORK</strong>
        <div className="top">
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="choose">
              Choose File
            </label>
            <input
              type="file"
              id="file-upload"
              name="data"
              onChange={retrieveFile}
              multiple
            />
            <span className="textArea text-black">
              {" "}
              Image: <u>{fileName}</u>
            </span>
            <button type="submit" className="upload" disabled={!file}>
              Upload
            </button>
            {ipfshash ? (
              <div>
                <p className="text-black">
                  <b className="text-black">IPFS Hash:</b> {ipfshash}
                </p>
              </div>
            ) : null}
          </form>
        </div>
        <div className="pt-20">{renderUi()}</div>
      </div>
    </>
  );
};

export default Upload;
