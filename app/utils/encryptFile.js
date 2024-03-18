import crypto from "crypto";
import path from "path";

function bufferToHexString(buffer) {
  return buffer.toString("hex");
}

function encryptFile(fileBuffer, symmetricKey) {
  console.log("Type of fileBuffer:", typeof fileBuffer);
  console.log("Content of fileBuffer:", fileBuffer);
  const cipher = crypto.createCipher("aes-256-cbc", symmetricKey);
  let encryptedData = cipher.update(fileBuffer);
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);
  return { encryptedData };
}

// Modify the encryptFileWithKey function to accept file data directly
export function encryptFileWithKey(file, symmetricKey) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      const fileBuffer = Buffer.from(this.result); // Convert file data to buffer
      const { encryptedData } = encryptFile(fileBuffer, symmetricKey);
      const fileName = path.basename(file.name);
      const fileExt = path.extname(fileName).slice(1);
      const encryptedFileName = `${fileName}.enc`;
      const symmetricKeyHexString = bufferToHexString(symmetricKey);

      const encryptedBlob = new Blob([encryptedData]); // Create a Blob from encryptedData

      resolve({
        encryptedBlob, // Pass the Blob instead of the encryptedData
        encryptedFileName,
        symmetricKey: symmetricKeyHexString,
      });
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsArrayBuffer(file); // Read file as ArrayBuffer
  });
}

