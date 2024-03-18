import { createClip, getClip } from "../../lib/actions/ipfsfile.action.js";
import { connectToDB } from "../../lib/mongoose.js";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    await connectToDB();

    const body = await req.json();

    const {public_key, name, ipfshash, size, keys } = body;

    console.log(public_key, name, ipfshash, size, keys);

    await createClip({public_key, name, ipfshash, size, keys });

    return NextResponse.json({ message: "Clip created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};


export const GET = async (req, res) => {
  try {
    await connectToDB();
    const clips = await getClip();
    return NextResponse.json({ clips: clips }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
