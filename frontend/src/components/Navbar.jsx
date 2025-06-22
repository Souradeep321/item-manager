import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-wide">
        Item Manager App
      </Link>

      <div className="flex items-center space-x-6">
        <Link
          to="/products"
          className="text-gray-700 font-medium hover:text-indigo-600 transition duration-200"
        >
          View Items
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
