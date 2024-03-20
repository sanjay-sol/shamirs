import { getClipByHash } from "../../lib/actions/ipfsfile.action.js";
import { connectToDB } from "../../lib/mongoose.js";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { key1, key2, ipfshash } = body;
    console.log(key1, key2, ipfshash);
      const clip = await getClipByHash(ipfshash);
      if (clip.length === 0) {
        return NextResponse.json({ message: "File not found" }, { status: 201 });
      } 
      const keys = clip[0].keys;

    console.log(keys);
    if (keys.includes(key1) && keys.includes(key2)) {
      return NextResponse.json(
        { message: keys[keys.length - 1] },
        { status: 201 }
      );
    } else {
      return NextResponse.json({ message: "Invalid keys" }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

