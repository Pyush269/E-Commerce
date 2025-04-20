import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const categoryParam = searchParams.get('category') || '';
  const searchQuery = searchParams.get('query') || '';
  
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const loadProductsData = async () => {
      try {
        setLoading(true);
        
        // Get categories
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Get products based on active category
        const productsData = await fetchProducts(0, activeCategory);
        setProducts(productsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    loadProductsData();
  }, [activeCategory]);

  useEffect(() => {
    // Update URL with active category and search term
    const params = new URLSearchParams();
    if (activeCategory) params.set('category', activeCategory);
    if (searchTerm) params.set('query', searchTerm);
    setSearchParams(params);
  }, [activeCategory, searchTerm, setSearchParams]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category === activeCategory ? '' : category);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The search term state is already updated via the input
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const filteredProducts = products
    .filter((product) => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'rating-desc':
          return (b.rating?.rate || 0) - (a.rating?.rate || 0);
        default:
          return 0;
      }
    });

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar with filters */}
        <div className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0 md:mr-8">
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <h2 className="font-medium text-lg mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => setActiveCategory('')}
                className={`block w-full text-left px-2 py-1 rounded ${
                  activeCategory === ''
                    ? 'bg-primary-100 text-primary-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`block w-full text-left px-2 py-1 rounded capitalize ${
                    activeCategory === category
                      ? 'bg-primary-100 text-primary-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-medium text-lg mb-4">Price Range</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  id="min-price"
                  min="0"
                  className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  placeholder="$0"
                />
              </div>
              <div>
                <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  id="max-price"
                  min="0"
                  className="w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  placeholder="$1000"
                />
              </div>
              <button
                type="button"
                className="w-full bg-primary-600 text-white rounded-md py-2 hover:bg-primary-700 transition-colors"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Search and Sort Controls */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>
              <div className="w-full sm:w-48">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Sort by</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="rating-desc">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-2">
              {activeCategory ? (
                <span className="capitalize">{activeCategory}</span>
              ) : (
                'All Products'
              )}
            </h1>
            <p className="text-gray-600 mb-6">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;