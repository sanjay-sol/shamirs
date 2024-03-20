import crypto from "crypto";

function hexStringToBuffer(hexString) {
  return Buffer.from(hexString, "hex");
}

export function decryptFile(encryptedData, symmetricKey) {
  const decipher = crypto.createDecipher("aes-256-cbc", symmetricKey);
  let decryptedData = decipher.update(encryptedData);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);
  return decryptedData;
}
