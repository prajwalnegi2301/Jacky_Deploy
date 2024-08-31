import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import Product from "../models/product.models.js";
import cloudinary from 'cloudinary'
import redis from 'redis'

import { createClient } from "redis";

const client = createClient();
client.connect();

// create feedback
export const postProduct = asyncErrorHandler(async (req, res, next) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar Required!", 400));
  }
  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported", 400));
  }


  const { productType, productName, isFoodItem, productId, desc } = req.body;

  if (!productType || !productId || !productName || !isFoodItem || !desc) {
    return next(new ErrorHandler("Please Fill All the Credentials", 400));
  }




  await client.lPush('product', JSON.stringify({productType, productName, isFoodItem, productId, desc}) )




  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }


  const avatarData = {
    public_id: cloudinaryResponse.public_id,
    url: cloudinaryResponse.secure_url,
  };
  client.lPush('product', JSON.stringify(avatarData));

  const product = new Product({
    productType, productName, isFoodItem, desc, productId, avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },

  });

  await product.save();

  res.status(200).json({ message: "Complaint listed", success: true, product });
});



export const getProducts = asyncErrorHandler(async (req, res, next) => {

  const productInRedis = await client.lRange('product', 0,-1);
  if (productInRedis) {
    res.status(200).json({ success: true, productInRedis });
  } else {
    const products = await Product.find();
    if (!products) {
      return next(new ErrorHandler("No Products Found", 404))
    }
    await client.lPush('product', products)
    res.status(200).json({ success: true, products })
  }
})
