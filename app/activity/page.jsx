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
      const response = await axios.post("/api/reconstructkey", {
        key1,
        key2,
        ipfshash,
      });
      setMessage(response?.data?.message);

    } catch (error) {
      setError(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
     
      <div className="flex flex-col">
        <div className="text-white">
          <div className=" mt-16 md:mt-0 ">
            <div
              className=" h-auto p-8 py-10 bg-gray-800  border-gray-800 rounded-lg shadow-2xl px-7"
              data-rounded="rounded-lg"
              data-rounded-max="rounded-full"
            >
              <h3 className="mb-6  text-2xl font-medium text-center text-gray-300">
                Reconstruct the Key{" "}
              </h3>
              <input
                type="text"
                value={key1}
                onChange={(e) => setKey1(e.target.value)}
                className="block w-full px-4 py-3 mb-4  border-2 border-transparent bg-gray-500 border-slate-400 rounded-lg focus:ring text-white placeholder:text-gray-300 focus:ring-gray-500 focus:outline-none"
                data-rounded="rounded-lg"
                data-primary="blue-500"
                placeholder="Key1"
              />
              <input
                type="text"
                value={key2}
                onChange={(e) => setKey2(e.target.value)}
                className="block w-full px-4 py-3 mb-4  border-2 border-transparent bg-gray-500 border-slate-400 rounded-lg focus:ring text-white placeholder:text-gray-300 focus:ring-gray-500 focus:outline-none"
                data-rounded="rounded-lg"
                data-primary="blue-500"
                placeholder="key2"
              />
              <input
                type="text"
                value={ipfshash}
                onChange={(e) => setIpfsHash(e.target.value)}
                className="block w-full px-4 py-3 mb-4  border-2 border-transparent bg-gray-500 border-slate-400 rounded-lg focus:ring text-white placeholder:text-gray-300 focus:ring-gray-500 focus:outline-none"
                data-rounded="rounded-lg"
                data-primary="blue-500"
                placeholder="ipfs hash of encypted file"
              />
              <div className="block">
                <button
                  className="w-full px-3 py-4 text-black font-bold bg-violet-400 hover:bg-violet-500 rounded-lg"
                  data-primary="blue-600"
                  data-rounded="rounded-lg"
                  onClick={handleSubmit}
                >
                  Reconstruct
                </button>
                <p className="pt-2">Key:</p>
                {message && <p className="font-bold p-2">{message}</p>}
                {error && <p>{error}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="text-white flex flex-col items-center">
          <h2 className="font-bold p-2 m-2">Your Messages</h2>
          <button
            className="bg-violet-400 p-3 mb-2 rounded-md"
            onClick={fetchMessages}
          >
            Fetch Messages
          </button>

          <div class="w-10/12 flex flex-col  bg-sate-800 rounded-lg shadow dark:bg-gray-800 ">
            {messages.map((message, index) => (
              <div
                key={index}
                class=" p-4 mb-2 bg-white rounded-md md:p-8 dark:bg-gray-800"
                id="about"
                role="tabpanel"
                aria-labelledby="about-tab"
              >
                <h2 class="mb-1 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  IPFS Hash :
                </h2>
                <p class="mb-1 text-gray-500 dark:text-gray-400">
                  {message.name}
                </p>
                <h2 class="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Key :
                </h2>
                <p class="mb-3 text-gray-500 dark:text-gray-400 overflow-y-auto">
                  {" "}
                  {message.key}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
