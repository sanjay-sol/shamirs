"use client";
import { useState } from "react";
import axios from "axios";
import JSZip from "jszip";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Please Select any File");
  const [ipfshash, setipfshash] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        let formData;
        if (file.length > 1) {
          const zip = new JSZip();
          Array.from(file).forEach((f, index) => {
            zip.file(`${f.name ? f.name : `file${index}`}`, f);
          });
          formData = await zip.generateAsync({ type: "blob" });
        } else {
            formData = new FormData();
            formData.append("file", file[0]);
            console.log(file[0]);
        }

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

          const data = {
              public_key: "public_key",
              name: file[0]?.name,
              ipfshash: resFile?.data?.IpfsHash,
              size: file[0]?.size,
              keys: ["key1", "key2", "key3", "key4", "key5"]
          }
          const res = await axios.post("/api/ipfs", data);
          console.log("res", res);
          
        setipfshash(resFile.data.IpfsHash);
      } catch (e) {
        alert("Can't upload file to Pinata");
      }
    }
    alert("Image Uploaded Successfully");
    setFileName("Select another file");
    setFile(null);
  };

  const retrieveFile = (e) => {
    const data = e.target.files;
    const fileList = Array.from(data);
    setFile(fileList);
    setFileName(fileList.length > 1 ? `${fileList.length} files selected` : fileList[0].name);
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
            <span className="textArea text-black"> Image: <u>{fileName}</u></span>
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
