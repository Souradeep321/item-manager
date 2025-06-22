// src/pages/AddProduct.jsx
import React, { useState, useRef } from 'react';
import { FiUpload, FiXSquare , FiPlus, FiImage } from 'react-icons/fi';
import { useCreateProductsMutation } from '../redux/productApi';

const AddProduct = () => {
  const [createProducts, { isLoading }] = useCreateProductsMutation();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
  });
  
  // Image state
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  
  // UI state
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Refs
  const coverImageRef = useRef(null);
  const additionalImagesRef = useRef(null);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle cover image selection
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if image
    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file');
      return;
    }
    
    // Generate preview
    const preview = URL.createObjectURL(file);
    setCoverImage({ file, preview });
    setFormError('');
  };
  
  // Handle additional images selection
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Filter only images
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Generate previews
    const imagesWithPreviews = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    // Add to existing images (limit to 5)
    setAdditionalImages(prev => [...prev, ...imagesWithPreviews].slice(0, 5));
    setFormError('');
  };
  
  // Remove additional image
  const removeAdditionalImage = (index) => {
    const newImages = [...additionalImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
  };
  
  // Remove cover image
  const removeCoverImage = () => {
    if (coverImage) {
      URL.revokeObjectURL(coverImage.preview);
      setCoverImage(null);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      // Validate form data
      if (!formData.name || !formData.type || !formData.description) {
        throw new Error('Please fill all fields');
      }
      
      if (!coverImage) {
        throw new Error('Cover image is required');
      }
      
      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('coverImage', coverImage.file);
      
      // Append additional images
      additionalImages.forEach(image => {
        formDataToSend.append('additionalImages', image.file);
      });
      
      // Call API
      await createProducts(formDataToSend).unwrap();
      
      // Reset form on success
      setFormData({ name: '', type: '', description: '' });
      removeCoverImage();
      additionalImages.forEach(img => URL.revokeObjectURL(img.preview));
      setAdditionalImages([]);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setFormError(err.data?.message || err.message || 'Failed to create product');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
            <h1 className="text-3xl font-bold text-white">Add New Product</h1>
            <p className="mt-1 text-blue-100">Fill in the details below to create a new product</p>
          </div>
          
          <div className="p-8">
            {formError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                <FiXSquare  className="mr-2 flex-shrink-0" />
                {formError}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FiPlus className="text-green-600 rotate-45" />
                </div>
                Product created successfully!
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-lg"
                      placeholder="Enter product name"
                    />
                  </div>
                </div>
                
                {/* Product Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-lg"
                    >
                      <option value="">Select a type</option>
                      <option value="electronics">Sneakers</option>
                      <option value="clothing">Shirts</option>
                      <option value="furniture">Tshirts</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                {/* Description */}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-lg"
                      placeholder="Describe your product..."
                    />
                  </div>
                </div>
                
                {/* Cover Image */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Image <span className="text-red-500">*</span>
                  </label>
                  <p className="mt-1 text-sm text-gray-500">This will be the main image for your product</p>
                  
                  <div className="mt-4">
                    {coverImage ? (
                      <div className="relative">
                        <img
                          src={coverImage.preview}
                          alt="Cover preview"
                          className="w-full h-64 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeCoverImage}
                          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                        >
                          <FiXSquare  className="text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={() => coverImageRef.current.click()}
                      >
                        <div className="space-y-1 text-center">
                          <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                              Upload a file
                            </span>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        <input
                          ref={coverImageRef}
                          type="file"
                          className="hidden"
                          onChange={handleCoverImageChange}
                          accept="image/*"
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Additional Images */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Images
                  </label>
                  <p className="mt-1 text-sm text-gray-500">Add up to 5 extra images of your product</p>
                  
                  <div className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {/* Existing images */}
                      {additionalImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiXSquare  className="text-red-500 text-sm" />
                          </button>
                        </div>
                      ))}
                      
                      {/* Add more button */}
                      {additionalImages.length < 5 && (
                        <div 
                          className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                          onClick={() => additionalImagesRef.current.click()}
                        >
                          <div className="text-center">
                            <FiPlus className="mx-auto text-gray-400" />
                            <p className="text-sm text-gray-500 mt-1">Add Image</p>
                          </div>
                          <input
                            ref={additionalImagesRef}
                            type="file"
                            className="hidden"
                            onChange={handleAdditionalImagesChange}
                            accept="image/*"
                            multiple
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-10 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="py-3 px-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Product...
                    </span>
                  ) : (
                    "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;