// route.js

import { NextResponse } from "next/server";
import { exportKeys } from "../../utils/exportkeys.js";

export const POST = async (req, res) => {
  try {
    const body = await req.json();

    const { secret, shares, threshold } = body;
    console.log(secret, shares, threshold);

      const shares_ = exportKeys(secret, shares, threshold);
        let keys = [];
        for (let i = 0; i < shares_.length; i++) {
        //   keys.push(`${shares_[i][1]}`); for ''
          keys.push(shares_[i][1]);
        }
      console.log(keys);

    return NextResponse.json({ keys }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
