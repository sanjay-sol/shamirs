"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [data, setData] = useState([]);
    const [viewIndex, setViewIndex] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("/api/ipfs");
      const data = response.data?.clips;
      setData(data);
      console.log(data);
    }
    fetchData();
  }, []);
  const downloadFile = async (hash, fileName) => {
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${hash}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  const toggleViewKeys = (itemId) => {
    setViewIndex((prevIndex) => (prevIndex === itemId ? null : itemId));
  };


  return (
    <>
      <main className="flex text-white min-h-screen flex-col items-center justify-between p-24">
        {data?.map((item) => (
          <div key={item._id} className="flex flex-col items-center gap-4">
            --------------------------------------------------------------------------
            <h1 className="text-4xl font-bold">{item.name}</h1>
            <p className="text-lg">{item.size}</p>
            <p className="text-lg">{item.ipfshash}</p>
            <p className="text-lg">{item.createdAt}</p>
            <div>
              <button onClick={() => downloadFile(item.ipfshash, item.name)}>
                Download
              </button>
            </div>
            <button onClick={() => toggleViewKeys(item._id)}>View Keys</button>
            <div>
              {viewIndex === item._id &&
                item.keys.map((key, keyIndex) => <p key={keyIndex}>{key}</p>)}
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
