// route.js
import { NextResponse } from "next/server";
import { generateSecret } from "../../utils/reconstruct.js";

export const POST = async (req, res) => {
  try {
    const body = await req.json();

    const { shares, threshold } = body;
    const keys = body.keys;

    const recoveredSecrets = [];

    for (let i = shares; i >= 1; i--) {
      const recoveredSecret = generateSecret(keys.slice(0, i));
      recoveredSecrets.push(recoveredSecret);
    }

    return NextResponse.json({ recoveredSecrets }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
