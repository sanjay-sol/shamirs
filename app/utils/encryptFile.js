const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

function bufferToHexString(buffer) {
  return buffer.toString("hex");
}

function encryptFile(filePath, symmetricKey) {
  const fileContent = fs.readFileSync(filePath);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", symmetricKey, iv);
  let encryptedData = cipher.update(fileContent);
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);
  return { encryptedData, iv };
}

function decryptFile(encryptedData, symmetricKey, iv) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", symmetricKey, iv);
  let decryptedData = decipher.update(encryptedData);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);
  return decryptedData;
}

const symmetricKey = crypto.randomBytes(32);
console.log("Symmetric Key:", symmetricKey);

const filePath = "test.js";
const fileExt = filePath.split(".")[1];
const fileName = filePath.split(".")[0];

const symmetricKeyHexString = bufferToHexString(symmetricKey);
console.log("Symmetric Key Hex String:", symmetricKeyHexString);

const { encryptedData, iv } = encryptFile(filePath, symmetricKey);
const outDirPath_enc = path.join(__dirname, "encrypts");
fs.writeFileSync(`${outDirPath_enc}/${fileName}_enc.enc`, encryptedData);

const encryptedFileContent = fs.readFileSync(
  `${outDirPath_enc}/${fileName}_enc.enc`
);
const outDirPath_dec = path.join(__dirname, "decrypts");
const decryptedData = decryptFile(encryptedFileContent, symmetricKey, iv);
fs.writeFileSync(`${outDirPath_dec}/${fileName}_dec.${fileExt}`, decryptedData);
