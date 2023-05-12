import express from "express";
import shopify from "../shopify.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    let query = req.query;
    if (!query.limit) {
      query = { ...query, limit: 15 };
    }
    const products = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session,
      ...query,
    });
    res.status(200).json({
      products: products.data,
      nextPageInfo: products.pageInfo?.nextPage?.query,
      prevPageInfo: products.pageInfo?.prevPage?.query,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/", upload.array("images"), async (req, res) => {
  try {
    const productId = req.body.productId;
    const images = req.files;

    for (const imageFile of images) {
      const image = new shopify.api.rest.Image({
        session: res.locals.shopify.session,
      });
      image.product_id = productId;
      image.position = 1;
      image.attachment = imageFile.buffer.toString("base64");
      image.filename = imageFile.originalname;
      await image.save({
        update: true,
      });
    }

    res.status(200).json({
      message: "done",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default router;
