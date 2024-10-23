import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Header, Loading, PayPalButton } from "../common";
import { getCartItems, removeCartItem } from "../../services/cartServices";
import { deleteCartItem } from "../../features/cartItem/cartItemSlice";

const ConfirmOrder = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      const fetchedCartItems = await getCartItems();

      if (fetchedCartItems) {
        setCartItems(fetchedCartItems);
        updateTotalPrice(fetchedCartItems);
      }
    };

    fetchCartItems();
  }, []);

  const updateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + parseFloat(item.price), 0);
    setTotalPrice(total.toFixed(2));
  };

  const handleRemoveItem = useCallback(
    async (itemId) => {
      setIsLoading(true);
      try {
        await removeCartItem(itemId);
        setCartItems((prevCartItems) => {
          const updatedCartItems = prevCartItems.filter(
            (item) => item.id !== itemId,
          );
          updateTotalPrice(updatedCartItems); // Recalculate total price after deletion
          return updatedCartItems;
        });
      } catch (error) {
        console.error("Failed to remove item:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header cartItemNumbers={cartItems.length} />
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="mb-6 text-3xl font-bold">Confirm your order</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">
                {cartItems.length} {cartItems.length > 1 ? "Courses" : "Course"}{" "}
                Selected
              </h2>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="mb-4 flex flex-col items-start justify-between rounded bg-white p-4 shadow-md md:flex-row"
                  >
                    <img
                      src={item.course.preview_image}
                      alt="Course Thumbnail"
                      className="mb-4 h-24 w-24 rounded object-cover md:mb-0 md:h-32 md:w-32"
                    />
                    <div className="flex-1 md:ml-4">
                      <h3 className="text-lg font-semibold">
                        {item.course.title}
                      </h3>
                      <p className="text-gray-600">
                        By {item.course.mentor_name}
                      </p>
                      <span className="my-2 inline-block rounded bg-yellow-400 px-2 py-1 text-xs font-semibold text-white">
                        Bestseller
                      </span>
                      <p className="text-sm text-gray-600">
                        4.6 ★ (144,477 ratings)
                      </p>
                      <p className="text-sm text-gray-600">
                        32 total hours • 520 lectures • All Levels
                      </p>
                      <div className="mt-2">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="mr-4 text-theme-primary hover:underline"
                        >
                          Remove
                        </button>
                        <button className="mr-4 text-theme-primary hover:underline">
                          Save for Later
                        </button>
                        <button className="text-theme-primary hover:underline">
                          Move to Wishlist
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 text-lg font-semibold md:mt-0">
                      ₹{item.price}
                    </p>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>
          </div>

          {cartItems && (
            <div className="self-start rounded bg-white p-4 shadow-md md:p-8">
              <h2 className="mb-4 text-xl font-semibold">
                Total: ₹{totalPrice}
              </h2>
              {cartItems.length > 0 && (
                <PayPalButton
                  cartItems={cartItems}
                  onError={(errorMessage) => setError(errorMessage)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfirmOrder;
