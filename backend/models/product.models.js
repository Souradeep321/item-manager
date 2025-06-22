import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter a product name"],
    },
    type: {
        type: String,
        required: [true, "Please enter a product type"],
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, "Please enter a product description"],
    },
    coverImage: {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },
    additionalImages: [
        {
            url: {
                type: String,
                required: true,
            },
            public_id: {
                type: String,
                required: true,
            },
        }
    ],
}, { timestamps: true })

function formatSlug(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-');        // Replace spaces with dashes
}

productSchema.pre("save", function (next) {
    if (this.isModified("type")) {
        this.type = formatSlug(this.type);
    }
    next();
});


export const Product = mongoose.model("Product", productSchema)