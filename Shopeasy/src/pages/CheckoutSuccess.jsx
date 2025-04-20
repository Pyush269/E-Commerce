import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  
  useEffect(() => {
    // If no order ID is present, redirect to home
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  if (!orderId) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your order has been received and is being processed.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
            <div>
              <p className="text-gray-600">Order Number</p>
              <p className="font-medium text-lg">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Order Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              We've sent a confirmation email to your email address with all the details of your order.
            </p>
            <p className="text-gray-700">
              You can expect to receive your items within 3-5 business days.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="bg-primary-600 text-white py-3 px-8 rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/products"
            className="bg-white text-gray-700 border border-gray-300 py-3 px-8 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CheckoutSuccess;