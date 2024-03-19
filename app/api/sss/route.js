// route.js

import { NextResponse } from "next/server";
import { SSS } from "../../utils/newShamirs.js";

export const POST = async (req, res) => {
  try {
    const body = await req.json();

    const { secret, shares, threshold } = body;
    console.log(secret, shares, threshold);

    const keys = SSS(secret, shares, threshold);

    return NextResponse.json({ keys }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
