import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartItem from '../components/cart/CartItem';

function CartPage() {
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toLowerCase() === 'discount10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoError('Invalid promo code.');
    }
  };

  const calculateSubtotal = () => {
    return cart.total;
  };

  const calculateDiscount = () => {
    return promoApplied ? calculateSubtotal() * 0.1 : 0;
  };

  const calculateShipping = () => {
    // Free shipping for orders over $50
    return calculateSubtotal() > 50 ? 0 : 5.99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateShipping();
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { redirect: '/checkout' } });
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
      
      {cart.items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Cart Items ({cart.itemCount})
                </h2>
              </div>
              <div>
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
              <div className="p-6 flex justify-between items-center border-t border-gray-200">
                <button
                  type="button"
                  className="text-sm font-medium text-primary-600 hover:text-primary-800"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                <Link
                  to="/products"
                  className="text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-base">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium text-gray-900">{formatCurrency(calculateSubtotal())}</p>
                </div>
                
                {promoApplied && (
                  <div className="flex justify-between text-base text-accent-600">
                    <p>Discount (10%)</p>
                    <p>-{formatCurrency(calculateDiscount())}</p>
                  </div>
                )}
                
                <div className="flex justify-between text-base">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium text-gray-900">
                    {calculateShipping() === 0
                      ? 'Free'
                      : formatCurrency(calculateShipping())}
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-medium">
                  <p className="text-gray-900">Total</p>
                  <p className="text-primary-600">{formatCurrency(calculateTotal())}</p>
                </div>
              </div>
              
              {/* Promo Code */}
              <div className="px-6 pb-6">
                <div className="mt-4">
                  <form onSubmit={handleApplyPromo} className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="submit"
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                  {promoApplied && (
                    <p className="mt-2 text-sm text-green-600">Promo code applied successfully!</p>
                  )}
                  {promoError && (
                    <p className="mt-2 text-sm text-red-600">{promoError}</p>
                  )}
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-md font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;