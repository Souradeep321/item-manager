import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { createProduct, deleteProduct, getAllProducts, } from "../controllers/product.controller.js";

const router = Router();

router.route("/").get( getAllProducts)

router.route("/")
  .post(
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "additionalImages", maxCount: 5 },
    ]),
    createProduct
  );

router.route("/:id").delete(deleteProduct)

export default router;