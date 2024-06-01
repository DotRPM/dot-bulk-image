import express from "express";
import shopify from "../shopify.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  const session = res.locals.shopify.session;
  let variables = req.query;
  try {
    if (!variables.limit) {
      variables = { ...variables, limit: 15 };
    }
    const client = new shopify.api.clients.Graphql({ session });
    const { data } = await client.request(
      `
        query productsQuery ($limit:Int, $query: String, $cursor: String) {
          products (${
            variables.prev ? "last" : "first"
          }: $limit, query:$query, ${
        variables.prev ? "before" : "after"
      }: $cursor, sortKey: TITLE) {
            nodes {
              id
              title
              updatedAt
              legacyResourceId
              featuredImage {
                url
                altText
              }
            }
            pageInfo {
              endCursor
              startCursor
              hasNextPage
              hasPreviousPage
            }
          }
        }
      `,
      {
        variables,
      }
    );
    res.status(200).json({
      products: data.products.nodes,
      pageInfo: data.products.pageInfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/", upload.array("images"), async (req, res) => {
  try {
    const productId = req.body.productId;
    const addToLast = Boolean(req.body.addToLast);
    const images = req.files;
    const session = res.locals.shopify.session;

    const { count: imageCount } = await shopify.api.rest.Image.count({
      session: session,
      product_id: productId,
    });

    for (const imageFile of images) {
      const image = new shopify.api.rest.Image({
        session: session,
      });
      image.product_id = productId;
      image.position = addToLast ? imageCount + 1 : 1;
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
