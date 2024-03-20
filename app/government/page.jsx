"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers"; // Import ethers.js
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
      <div>
        <div className="text-white">
          <h1>Data Storage App</h1>

          <div>
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

        <div className="text-white">
          <h2>Send Message</h2>
          <label>
            Receiver Address:
            <input
              type="text"
              className="text-black p-2 m-2"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
          </label>
          <br />
          <label>
            Ipfs Hash:
            <input
              type="text"
              className="text-black p-2 m-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <br />
          <label>
            Key:
            <input
              type="text"
              className="text-black p-2 m-2"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </label>
          <br />
          <label>
            Any message:
            <input
                          type="text"
                className="text-black p-2 m-2"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </label>
          <br />
          <button onClick={sendMessage}>Send Message</button>
          {txHash && <p>Transaction Hash: {txHash}</p>}
        </div>
      </div>
    </>
  );
}

export default Page;
