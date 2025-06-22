import ProductCard from '../components/ProductCard';

const ViewItems = ({ products }) => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))
      ) : (
        <p className="text-center col-span-full text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default ViewItems;
