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

  const downloadKeys = (keys, fileName) => {
    const keysText = keys.join("\n");
    const blob = new Blob([keysText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleViewKeys = (itemId) => {
    setViewIndex((prevIndex) => (prevIndex === itemId ? null : itemId));
  };

  return (
    <div className="w-full relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-200 dark:text-gray-400">
        <thead className="text-xs text-gray-200 uppercase bg-gray-800 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Size
            </th>
            <th scope="col" className="px-6 py-3">
              IPFS hash
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              Download
            </th>
            <th scope="col" className="px-6 py-3">
              View Keys
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr
              key={item._id}
              className="bg-slate-900 border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-bold text-gray-100 whitespace-nowrap dark:text-white overflow-hidden"
              >
                {item.name}
              </th>
              <td className="px-6 py-4 overflow-hidden">{item.size}</td>
              <td className="px-6 py-4 overflow-hidden">{item.ipfshash}</td>
              <td className="px-6 py-4 overflow-hidden">{item.createdAt}</td>
              <td className="px-6 py-4 overflow-hidden">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md bg-violet-400"
                  onClick={() => downloadFile(item.ipfshash, item.name)}
                >
                  download
                </button>
              </td>
              <td>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md bg-violet-400"
                  onClick={() =>
                    downloadKeys(item.keys, `${item.name}_keys.txt`)
                  }
                >
                  Keys
                </button>
              </td>
              {viewIndex === item._id && (
                <td colSpan="6" className="px-6 py-4 overflow-hidden">
                  {item.keys.map((key, index) => (
                    <p key={index} className="text-gray-100 dark:text-white">
                      {key}
                    </p>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
