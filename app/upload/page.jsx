"use client";
import { useState } from "react";
import axios from "axios";
import crypto from "crypto";
import { encryptFileWithKey } from "../utils/encryptFile.js";
import { exportKeys } from "../utils/exportkeys.js";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Please Select any File");
  const [ipfshash, setipfshash] = useState(null);

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
        console.log(shares);

            let keys = [];
            for(let i = 0; i < shares.length; i++) {
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
        
    //   console.log("Response:", res.data);

      setipfshash(resFile.data.IpfsHash);
    } catch (error) {
      console.error("Error:", error);
      alert("Can't upload file to Pinata");
    }

    // Reset form
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

  return (
    <>
      <div className="top1">
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
      </div>
    </>
  );
};

export default Upload;
