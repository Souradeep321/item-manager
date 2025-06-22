// src/pages/ProductDisplay.jsx
import { useLocation } from "react-router-dom";
import CustomSwiper from "../components/Swiper";

const ProductDisplay = () => {
  const { state: product } = useLocation();

  if (!product)
    return <div className="p-6 text-center text-gray-500">No product selected</div>;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left - Main Image & Thumbnails */}
        <div className="space-y-4">
          <div className="w-full h-[400px] rounded-xl overflow-hidden border shadow-sm">
            <img
              src={product.coverImage.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto">
            <img
              src={product.coverImage.url}
              alt="Cover"
              className="w-16 h-16 object-cover rounded-md border"
            />
            {product.additionalImages?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`Additional ${i + 1}`}
                className="w-16 h-16 object-cover rounded-md border"
              />
            ))}
          </div>
        </div>

        {/* Right - Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="mt-3 text-gray-600">{product.description}</p>
          <button
            onClick={() => alert("Enquiry submitted!")}
            className="mt-6 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold py-3 px-6 rounded-lg transition"
          >
            Enquire
          </button>
        </div>
      </div>

      {/* Swiper Carousel */}
      <div className="w-full mt-10 px-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          More Images
        </h2>
        <CustomSwiper
          img={product.additionalImages?.map((img) => ({
            image: img.url,
            title: product.name,
            description: product.description,
          }))}
        />
      </div>
    </>
  );
};

export default ProductDisplay;
