"use client";
import DecryptFile from "../../components/DecryptFile.jsx";

const Decrypt = () => {
  

  return (
    <>
      <div className="top1 text-white">
       <DecryptFile filePath="path/to/your-file.pdf.enc" />
      </div>
    </>
  );
};

export default Decrypt;
