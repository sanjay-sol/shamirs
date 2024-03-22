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
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key:
            process.env.REACT_APP_PINATA_SECRET_API_KEY ,
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
        <div className=" mt-16 md:mt-0 ">
          <div
            className=" h-auto p-8 py-10 bg-gray-800  border-gray-800 rounded-lg shadow-2xl px-7"
            data-rounded="rounded-lg"
            data-rounded-max="rounded-full"
          >
            <h3 className="mb-6  text-2xl font-medium text-center text-gray-300">
              Upload to E-Vault
            </h3>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="block w-full px-4 py-3 mb-4  border-2 border-transparent bg-gray-500 border-slate-400 rounded-lg focus:ring text-white placeholder:text-gray-300 focus:ring-gray-500 focus:outline-none"
              data-rounded="rounded-lg"
              data-primary="blue-500"
              placeholder="Key"
            />
            <input
              type="text"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
              className="block w-full px-4 py-3 mb-4  border-2 border-transparent bg-gray-500 border-slate-400 rounded-lg focus:ring text-white placeholder:text-gray-300 focus:ring-gray-500 focus:outline-none"
              data-rounded="rounded-lg"
              data-primary="blue-500"
              placeholder="Ipfs hash"
            />
            <div className="block">
              <button
                className="w-full px-3 py-4 text-black font-bold bg-violet-400 hover:bg-violet-500 rounded-lg"
                data-primary="blue-600"
                data-rounded="rounded-lg"
                onClick={handleUpload}
              >
                Upload Data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="top1 text-white flex flex-col justify-center items-center">
        <div className="top">
          <form className="form" onSubmit={handleSubmit}>
            <div className="relative">
              <label className="font-medium text-gray-400 ">
                Upload to IPFS
              </label>
              <div className="extraOutline p-4  bg-gray-700 w-max bg-whtie mt-4 rounded-lg ">
                <div className="file_upload p-5 relative border-4 border-dotted border-gray-500 rounded-lg">
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
                        name="data"
                        onChange={retrieveFile}
                        multiple
                      />
                      <button
                        type="submit"
                        className="text bg-violet-400 text-gray-800 border border-gray-800 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-violet-500"
                      >
                        Upload
                      </button>
                    </label>

                    <div className="title text-yellow-100 uppercase">
                      {fileName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* {ipfshash ? (
              <div>
                <p className="text-black">
                  <b className="text-black">IPFS Hash:</b> {ipfshash}
                </p>
              </div>
            ) : null} */}
          </form>
        </div>
      </div>
      <div className="pt-20">{renderUi()}</div>
    </>
  );
};

export default Upload;
