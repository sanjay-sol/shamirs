import axios from "axios"; 
export const uploadToIpfs = async (formData) => {
    if (formData) {
        try {
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: "514787962d7d2725022d",
            pinata_secret_api_key:
              "1486a1291f9ecc0cc8de3b60eb538a225b6f1ee2b193edf924f7faec2eec2588",
          },
        });
          const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
          return ImgHash;

      } catch (error) {
          return error;
      }
    }
  };
