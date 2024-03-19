"use client"
import React, { useState , useEffect } from 'react';
import { ethers } from 'ethers'; // Import ethers.js
function Page() {
    const [data, setData] = useState([]);


    const [contract, setContract] = useState(null);
    useEffect(()=>{
        const connectWallet = async() => {
            const contractAddress = "0xE5bC89D74a6c47Afe02ED3f238e337135fd1FFbd";
            const contractABI  = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_key",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			}
		],
		"name": "uploadData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getData",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "uploaders",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userData",
		"outputs": [
			{
				"internalType": "address",
				"name": "uploader",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "key",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
            try {
                const { ethereum } = window;
                if (ethereum) {
                    const account = await ethereum.request({method: "eth_requestAccounts"});
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
    },[]);


        // Function to fetch data from the smart contract
        const fetchData = async () => {
            try {
                const result = await contract.getData();
                console.log('Fetched data:', result);
                const arr = result[0].map((address, index) => {
                    return [address, result[1][index], result[2][index]];
                }
                );
                console.log('Array:', arr);
                setData(arr);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
  return (
    <div className='text-white'>
      <h1>Data Storage App</h1>
      
      <div>
        <button onClick={fetchData}>Fetch Data</button>
      </div>
      <div>
              <h2>Uploaded Data:</h2>
              -----------------
        <ul>
          {data&&data.map((item, index) => (
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
}

export default Page;