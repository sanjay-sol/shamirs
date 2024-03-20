"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
function Page() {
  const [data, setData] = useState([]);

  const [contract, setContract] = useState(null);
  const [contract2, setContract2] = useState(null);
  const [receiver, setReceiver] = useState("");
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [place, setPlace] = useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0xE5bC89D74a6c47Afe02ED3f238e337135fd1FFbd";
      const contractAddress2 = "0xd1F42801e9586616663b9d23a38ae789920cd78f";

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
      const contractABI2 = [
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
        const contract2 = new ethers.Contract(
          contractAddress2,
          contractABI2,
          signer
        );
        setContract2(contract2);
        setContract(contract);
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);

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

  const sendMessage = async () => {
    try {
      const tx = await contract2.sendMessage(receiver, name, key, place);
      setTxHash(tx.hash);
      await tx.wait();
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <>
      <h1 className="text-heading1-bold text-white flex justify-center">
        Government
      </h1>
      <div className="flex ">
        <div
          className="w-1/2 h-auto p-8 py-10 mr-2 bg-gray-800  border-gray-800 rounded-lg shadow-2xl px-7"
          data-rounded="rounded-lg"
          data-rounded-max="rounded-full"
        >
          <div>
            <button
              className="justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md bg-violet-400"
              onClick={fetchData}
            >
              Fetch Data
            </button>
          </div>
          <div className="m-2 text-white">
            {data &&
              data.map((item, index) => (
                <div key={index} className="block w-full px-4 py-3 mb-1  border-2 border-transparent bg-gray-500 border-slate-400 rounded-lg text-white">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight">
                    Uploader:
                  </h5>
                  <p className="font-normal overflow-x-scroll" key={index}>
                    {item[0]}
                  </p>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight ">
                    Key:
                  </h5>
                  <p className="font-normal overflow-x-scroll" key={index}>
                    {item[1]}
                  </p>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight">
                    IPFS hash:
                  </h5>
                  <p className="font-normal overflow-x-scroll" key={index}>
                    {item[2]}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div
          className="w-1/2 h-auto p-8 py-10 bg-gray-800  border-gray-800 rounded-lg shadow-2xl px-7"
          data-rounded="rounded-lg"
          data-rounded-max="rounded-full"
        >
          <input
            type="text"
            className="block w-full px-4 py-3 mb-1  border-2 border-transparent bg-gray-500 border-slate-400 rounded-lg focus:ring text-white placeholder:text-gray-300 focus:ring-gray-500 focus:outline-none"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Receiver Address"
          />
          <br />
          <input
            type="text"
            className="block w-full px-4 py-3 mb-1  border-2 border-transparent bg-gray-500 border-slate-400 rounded-lg focus:ring text-white placeholder:text-gray-300 focus:ring-gray-500 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ipfs Hash"
          />
          <br />
          <input
            type="text"
            className="block w-full px-4 py-3 mb-1  border-2 border-transparent bg-gray-500 border-slate-400 rounded-lg focus:ring text-white placeholder:text-gray-300 focus:ring-gray-500 focus:outline-none"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Key"
          />
          <br />
          <input
            type="text"
            className="block w-full px-4 py-3 mb-2  border-2 border-transparent bg-gray-500 border-slate-400 rounded-lg focus:ring text-white placeholder:text-gray-300 focus:ring-gray-500 focus:outline-none"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Any message"
          />
          <br />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md bg-violet-400"
            onClick={sendMessage}
          >
            Send message
          </button>
          <div className="text-white">
            {txHash && <p>Transaction Hash: {txHash}</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;