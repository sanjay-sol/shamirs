const bigInt = require("big-integer");

function getCoefficientAtZero(points, THRESHOLD) {
  const PRIME = bigInt(2).pow(127).minus(1);

  let p1 = bigInt(1);
  for (let i = 0; i < THRESHOLD; i++) {
    let xCoordinate = points[i][0];
    p1 = p1.multiply(xCoordinate.multiply(-1).mod(PRIME)).mod(PRIME);
  }

  let p2 = bigInt(0);

  for (let i = 0; i < THRESHOLD; i++) {
    let numerator = points[i][1];
    numerator = numerator
      .multiply(p1)
      .multiply(points[i][0].multiply(-1).modInv(PRIME))
      .mod(PRIME);
    let denominator = bigInt(1).mod(PRIME);

    for (let j = 0; j < THRESHOLD; j++) {
      if (i == j) continue;
      let front = points[i][0];
      let back = points[j][0];
      denominator = denominator
        .multiply(front.minus(back).mod(PRIME))
        .mod(PRIME);
    }

    let frac = numerator.multiply(denominator.modInv(PRIME)).mod(PRIME);
    p2 = p2.plus(frac).mod(PRIME);
  }

  return p2.mod(PRIME).plus(PRIME).mod(PRIME);
}

function hexStringToByteArray(hex) {
  let byteArray = [];

  for (let i = 0; i < hex.length; i += 2) {
    let byteString = hex.slice(i, i + 2);
    byteArray.push(parseInt(byteString, 16));
  }
  return byteArray;
}

function integerToString(intSecret) {
  let hexString = intSecret.toString(16);

  let byteArray = hexStringToByteArray(hexString);

  let stringSecret = "";

  for (let byte of byteArray) {
    stringSecret += String.fromCharCode(byte);
  }
  return stringSecret;
}

function stringToInteger(secret) {
  let byteArray = [];
  for (let i = 0; i < secret.length; i++) {
    let currCharacter = secret[i];
    let byte = currCharacter.charCodeAt(0);
    byteArray.push(byte);
  }
  let hexString = byteArray
    .map((e) => e.toString(16).padStart(2, "0"))
    .join("");
  return bigInt(hexString, 16);
}

function generateSecret(points, THRESHOLD) {
  let integerSecret = getCoefficientAtZero(points, THRESHOLD);
  return integerToString(integerSecret);
}

module.exports = { generateSecret, stringToInteger };
