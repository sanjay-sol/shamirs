import mongoose from "mongoose";

const Ipfs_FileSchema2 = new mongoose.Schema(
  {
    public_key: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    ipfshash: {
      type: String,
    },
    size: {
      type: Number,
    },
    keys: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Clip2 = mongoose.models.Ipfs_File2 || mongoose.model("Ipfs_File2", Ipfs_FileSchema2);

export default Clip2;
