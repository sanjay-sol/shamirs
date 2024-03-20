"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";

export default function DecryptForm() {
  const [key1, setKey1] = useState("");
  const [key2, setKey2] = useState("");
  const [ipfshash, setIpfsHash] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [contract, setContract] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const contractAddress = "0xd1F42801e9586616663b9d23a38ae789920cd78f"; // Replace with your contract address
    const contractABI = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "receiver",
            type: "address",
          },
          {
            indexed: false,
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "key",
            type: "string",
          },
          {
            indexed: false,
            internalType: "string",
            name: "place",
            type: "string",
          },
        ],
        name: "MessageSent",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_receiver",
            type: "address",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_key",
            type: "string",
          },
          {
            internalType: "string",
            name: "_place",
            type: "string",
          },
        ],
        name: "sendMessage",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getMessages",
        outputs: [
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "key",
                type: "string",
              },
              {
                internalType: "string",
                name: "place",
                type: "string",
              },
            ],
            internalType: "struct MessageSender.Message[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
    const connectToBlockchain = async () => {
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
        console.error("Error connecting to blockchain:", error);
      }
    };

    connectToBlockchain();
  }, []);

  const fetchMessages = async () => {
    try {
      if (contract) {
        const fetchedMessages = await contract.getMessages();
        setMessages(fetchedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/decrypt", {
        key1,
        key2,
        ipfshash,
      });
      setMessage(response?.data?.message);
      //   setError("error");
    } catch (error) {
      //   setMessage("messa");
      setError(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <div className="text-white">
        <form onSubmit={handleSubmit}>
          <label>
            Key 1:
            <input
              type="text"
              className="text-black p-2 m-2"
              value={key1}
              onChange={(e) => setKey1(e.target.value)}
            />
          </label>
          <br />
          <label>
            Key 2:
            <input
              type="text"
              className="text-black p-2 m-2"
              value={key2}
              onChange={(e) => setKey2(e.target.value)}
            />
          </label>
          <br />
          <label>
            IPFS Hash:
            <input
              type="text"
              className="text-black p-2 m-2"
              value={ipfshash}
              onChange={(e) => setIpfsHash(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Decrypt File</button>
        </form>
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
      </div>
      <div className="text-white">
        <h2>Messages</h2>
        <button onClick={fetchMessages}>Fetch Messages</button>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              <strong>Name:</strong> {message.name}, <strong>Key:</strong>{" "}
              {message.key}, <strong>Place:</strong> {message.place}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
