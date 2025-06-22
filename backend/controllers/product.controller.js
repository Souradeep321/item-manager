import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 });

    if (!products || products.length === 0) {
        throw new ApiError(404, "No products found");
    }

    res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
})


const createProduct = asyncHandler(async (req, res) => {
  const { name, type, description } = req.body;

  if (!name || !type || !description) {
    throw new ApiError(400, "Please fill all the fields");
  }

  if (
    !req.files ||
    !req.files.coverImage ||
    req.files.coverImage.length === 0
  ) {
    throw new ApiError(400, "Cover image is required");
  }

  const publicIds = [];

  try {
    // Upload cover image
    const coverImageUpload = await uploadOnCloudinary(
      req.files.coverImage[0].path
    );

    if (!coverImageUpload) {
      throw new ApiError(400, "Cover image upload failed");
    }

    const coverImage = {
      url: coverImageUpload.secure_url,
      public_id: coverImageUpload.public_id,
    };

    publicIds.push(coverImage.public_id);

    // Upload additional images
    const additionalImages = [];

    if (req.files.additionalImages && req.files.additionalImages.length > 0) {
      for (const file of req.files.additionalImages) {
        const result = await uploadOnCloudinary(file.path);
        if (result) {
          additionalImages.push({
            url: result.secure_url,
            public_id: result.public_id,
          });
          publicIds.push(result.public_id);
        }
      }
    }

    // Create product in DB
    const product = await Product.create({
      name,
      type,
      description,
      coverImage,
      additionalImages,
    });

    res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    // Rollback: delete uploaded images if DB save fails
    if (publicIds.length > 0) {
      await Promise.all(publicIds.map(id => deleteFromCloudinary(id)));
    }

    throw new ApiError(500, `Product creation failed: ${error.message}`);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  try {
    const publicIdsToDelete = [];

    // Add cover image public_id
    if (product.coverImage?.public_id) {
      publicIdsToDelete.push(product.coverImage.public_id);
    }

    // Add additional images public_ids
    if (product.additionalImages && product.additionalImages.length > 0) {
      product.additionalImages.forEach((img) => {
        if (img?.public_id) publicIdsToDelete.push(img.public_id);
      });
    }

    // Delete all images from Cloudinary
    await Promise.all(
      publicIdsToDelete.map((publicId) => deleteFromCloudinary(publicId))
    );

    // Delete product from DB
    await Product.findByIdAndDelete(productId);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Product deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Failed to delete product: " + error.message);
  }
});


export {
    getAllProducts,
    createProduct,
    deleteProduct
};
