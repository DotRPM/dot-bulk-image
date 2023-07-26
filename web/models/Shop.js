import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", ShopSchema);

export default Shop;
