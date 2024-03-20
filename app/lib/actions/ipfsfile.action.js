import Clip2 from "../models/ipfsfile.model.js";
import { connectToDB } from "../mongoose.js";

export async function createClip({ public_key, name, ipfshash, size, keys }) {
  try {
    await connectToDB();
    await Clip2.create({
      public_key: public_key,
      name: name,
      ipfshash: ipfshash,
      size: size,
      keys: keys,
    });
  } catch (error) {
    throw new Error(`Failed to create clip: ${error.message}`);
  }
}

export async function getClip() {
  try {
    await connectToDB();
    const clip = await Clip2.find();
    return clip;
  } catch (error) {
    throw new Error(`Failed to get clip: ${error.message}`);
  }
}

export async function getClipByHash(ipfshash) {
  try {
    await connectToDB();
    const clip = await Clip2.find({ ipfshash: ipfshash });
    return clip;
  } catch (error) {
    throw new Error(`Failed to get clip: ${error.message}`);
  }
}