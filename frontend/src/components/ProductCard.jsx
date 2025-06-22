import { useNavigate } from "react-router-dom";
import { useDeleteProductsMutation } from "../redux/productApi";
import toast from "react-hot-toast";


const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const [deleteProducts, { isLoading }] = useDeleteProductsMutation();
    const handleView = () => {
    navigate(`/product/${product._id}`, {
      state: product, // pass full product object
    });
  };
  return (
    <div 
    onClick={()=> navigate(`/product/${product._id}`, { state: product })}
    className="bg-white rounded-2xl shadow-md overflow-hidden w-80 hover:shadow-lg transition">
      {/* Image */}
      <div className="bg-gradient-to-br from-purple-200 to-purple-600 p-4 flex justify-center items-center h-48">
        <img
          src={product?.coverImage.url}
          alt={product?.name}
          className="h-36 object-cover drop-shadow-lg rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product?.name}</h3>

        {/* Tags */}
        <div className="flex gap-2 my-2">
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
            {product?.type}
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
            ID: {product?._id.slice(0, 6)}...
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">{product?.description}</p>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleView}
            className="text-purple-600 text-sm font-medium hover:underline"
          >
            View
          </button>
          <button
            onClick={async (e) => {
              e.preventDefault();
              try {
                await deleteProducts(product?._id).unwrap();
              } catch (error) {
                toast.error(error?.data?.message || "Failed to delete product");
              }
            }}
            className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
