import { useCart } from '../../contexts/CartContext';

function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200 animate-fade-in">
      <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-contain p-2"
        />
      </div>
      <div className="flex-1 sm:ml-6 flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-base font-medium text-gray-900">{item.title}</h3>
          <p className="ml-4 text-base font-medium text-gray-900">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {item.description}
        </p>
        <div className="mt-auto pt-4 flex justify-between items-center">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={handleDecrement}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="number"
              className="w-12 border-0 text-center focus:outline-none focus:ring-0"
              value={item.quantity}
              min="1"
              onChange={handleQuantityChange}
            />
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={handleIncrement}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-primary-600 hover:text-primary-800"
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;