import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ViewItems from './pages/ViewItems';
import AddProduct from './pages/AddItems';
import ProductDisplay from './pages/ProductDisplay';
import Loader from './components/Loader';

import { Toaster } from 'react-hot-toast';
import { useGetAllProductsQuery } from './redux/productApi';

function App() {
  const { data, isLoading, isError, error } = useGetAllProductsQuery();
  const products = data?.data || [];

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-center text-red-500">Error: {error?.data?.message || 'Something went wrong'}</p>;

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<AddProduct />} />
        <Route path="/products" element={<ViewItems products={products} />} />
        <Route path="/product/:id" element={<ProductDisplay />} />

      </Routes>
      <Toaster  />
    </BrowserRouter>
  );
}

export default App;
