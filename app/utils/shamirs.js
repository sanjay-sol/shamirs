const readline = require("readline-sync");
const bigInt = require("big-integer");
const mime = require("mime-types");
let PRIME = bigInt(2).pow(127).minus(1);
const SECRET = readline.question("Enter secret: ");
const SHARES = readline.questionInt("Enter no. of shares: ");
const THRESHOLD = readline.questionInt("Enter threshold: ");

function stringToBytes(str) {
  let byteArray = [];
  for (let i = 0; i < str.length; i++) {
    let currCharacter = str[i];
    let byte = currCharacter.charCodeAt(0);
    byteArray.push(byte);
  }
  return byteArray;
}

function stringToInteger(secret) {
  let byteArray = stringToBytes(secret);
  let secretInt = bigInt(
    byteArray.map((e) => e.toString(16).padStart(2, "0")).join(""),
    16
  );
  return secretInt;
}

function choosePrime(n, secretInt) {
  let max = secretInt.compare(n) == 1 ? secretInt : bigInt(n);

  for (let i = max.plus(1); ; i = i.plus(1)) {
    if (i.isPrime()) return i;
  }
}

function generateRandomCoefficients(n) {
  let coefficients = [];
  for (let i = 0; i < n; i++) {
    let currCoefficient = bigInt.randBetween(1, PRIME.minus(1));
    coefficients.push(currCoefficient);
  }
  return coefficients;
}

function evaluatePolynomial(coefficients, x) {
  let answer = bigInt(0);
  let acc = bigInt(1);
  for (let i = coefficients.length - 1; i >= 0; i--) {
    let term = acc.multiply(coefficients[i]);
    term = term.mod(PRIME);
    answer = answer.plus(term);
    answer = answer.mod(PRIME);
    acc = acc.multiply(bigInt(x));
    acc = acc.mod(PRIME);
  }
  return answer.mod(PRIME);
}

function SSS(secret, n, t) {
  let secretInt = stringToInteger(secret);

  console.log();
  console.log(`Secret as`, secretInt);
  console.log(`Secret as Hex { value: 0x${secretInt.toString(16)} }`);
  console.log();

  let degree = t - 1;
  let numberOfKeys = n;

  PRIME = choosePrime(numberOfKeys, secretInt);

  let coefficients = generateRandomCoefficients(degree);

  coefficients.push(secretInt);

  let sharedSecrets = [];
  for (let i = 1; i <= n; i++) {
    let fi = evaluatePolynomial(coefficients, i);
    sharedSecrets.push([bigInt(i), fi]);
  }

  return sharedSecrets;
}

function getCoefficientAtZero(points) {
  let p1 = bigInt(1);
  for (let i = 0; i < points.length; i++) {
    let xCoordinate = points[i][0];
    p1 = p1.multiply(xCoordinate.multiply(-1).mod(PRIME)).mod(PRIME);
  }

  let p2 = bigInt(0);

  for (let i = 0; i < points.length; i++) {
    let numerator = points[i][1];
    numerator = numerator
      .multiply(p1)
      .multiply(points[i][0].multiply(-1).modInv(PRIME))
      .mod(PRIME);
    let denominator = bigInt(1).mod(PRIME);

    for (let j = 0; j < points.length; j++) {
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

function generateSecret(points) {
  let integerSecret = getCoefficientAtZero(points);
  return integerToString(integerSecret);
}

let points = SSS(SECRET, SHARES, THRESHOLD);
console.log("Shares:");
for (let point of points) {
  console.log(`(${point[0]}, ${point[1]})`);
}

let logged = false;
console.log();
for (let i = SHARES; i >= 1; i--) {
  let recoveredSecret = generateSecret(points.slice(0, i));
  if (!logged && i < THRESHOLD) {
    console.log();
    console.log(
      `Invalid recovered secrets when using shares less than threshold: `
    );
    logged = true;
  }
  console.log(
    `Recovered secret with ${i} shares: ${recoveredSecret}`,
    stringToInteger(recoveredSecret)
  );
}
