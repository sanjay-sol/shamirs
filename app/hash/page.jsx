"use client";
import { useState, useRef } from "react";
import { ethers } from "ethers";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";

const signMessage = async ({ setError, message }) => {
  try {
    console.log({ message });
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return {
      message,
      signature,
      address,
    };
  } catch (err) {
    setError(err.message);
  }
};

const verifyMessage = async ({ message, address, signature }) => {
  try {
    const signerAddr = await ethers.utils.verifyMessage(message, signature);
    if (signerAddr !== address) {
      return false;
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default function SignMessage() {
  const resultBox = useRef();
  const [signatures, setSignatures] = useState([]);
  const [error, setError] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const handleSign = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    const sig = await signMessage({
      setError,
      message: data.get("message"),
    });
    if (sig) {
      setSignatures([...signatures, sig]);
    }
  };
  const handleVerification = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setSuccessMsg();
    setError();
    const isValid = await verifyMessage({
      setError,
      message: data.get("message"),
      address: data.get("address"),
      signature: data.get("signature"),
    });

    if (isValid) {
      setSuccessMsg("Signature is valid!");
    } else {
      setError("Invalid signature");
    }
  };

  return (
    <>
      <form className="m-4" onSubmit={handleSign}>
        <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-slate-800">
          <main className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-400 text-center">
              Sign messages
            </h1>
            <div className="">
              <div className="my-3">
                <textarea
                  required
                  type="text"
                  name="message"
                  className="textarea w-full h-24 bg-slate-400 rounded-md textarea-bordered focus:ring focus:outline-none"
                  placeholder="Message"
                />
              </div>
            </div>
          </main>
          <footer className="p-4">
            <button
              type="submit"
              className="btn btn-primary bg-violet-400 p-2 rounded-md submit-button focus:ring focus:outline-none w-full"
            >
              Sign message
            </button>
            {/* <ErrorMessage message={error} /> */}
          </footer>
          {signatures.map((sig, idx) => {
            return (
              <div className="p-2" key={sig}>
                <div className="my-2">
                  <p className="text-white">
                    Message {idx + 1}: {sig.message}
                  </p>
                  <p className="text-white">Signer: {sig.address}</p>
                  <textarea
                    type="text"
                    readOnly
                    ref={resultBox}
                    className="textarea w-full h-24 p-2 mt-1 text-white bg-slate-700 textarea-bordered focus:ring focus:outline-none"
                    placeholder="Generated signature"
                    value={sig.signature}
                  />
                </div>
              </div>
            );
          })}
        </div>
          </form>
          <form className="m-4" onSubmit={handleVerification}>
      <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-slate-800">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-white text-center">
            Verify signature
          </h1>
          <div className="">
            <div className="my-3">
              <textarea
                required
                type="text"
                name="message"
                className="textarea bg-slate-400 w-full h-24 textarea-bordered focus:ring focus:outline-none placeholder:text-slate-600"
                placeholder="Message"
              />
            </div>
            <div className="my-3">
              <textarea
                required
                type="text"
                name="signature"
                className="textarea bg-slate-400 text-black w-full h-24 textarea-bordered rounded-md focus:ring focus:outline-none placeholder:text-slate-600"
                placeholder="Signature"
              />
            </div>
            <div className="my-3">
              <input
                required
                type="text"
                name="address"
                className="textarea bg-slate-400 w-full h-10 input input-bordered focus:ring rounded-md focus:outline-none placeholder:text-slate-600"
                placeholder="Signer address"
              />
            </div>
          </div>
        </main>
        <footer className="p-4">
          <button
            type="submit"
            className="btn btn-primary submit-button bg-violet-400 p-2 rounded-md focus:ring focus:outline-none w-full"
          >
            Verify signature
          </button>
        </footer>
        <div className="p-4 mt-4">
          <ErrorMessage message={error} />
          <SuccessMessage message={successMsg} />
        </div>
      </div>
    </form>
    </>
  );
}
