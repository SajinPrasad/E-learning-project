import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getCartItems, removeCartItem } from "../../services/cartServices";
import { Header } from "../common";
import { CartSkeleton } from "../Skeletons";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      const fetchedCartItems = await getCartItems();

      if (fetchedCartItems) {
        setCartItems(fetchedCartItems);
        updateTotalPrice(fetchedCartItems);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateTotalPrice = (items) => {
    const total = items.reduce((acc, item) => acc + parseFloat(item.price), 0);
    setTotalPrice(total.toFixed(2)); // Ensure the total has two decimal points
  };

  const handleDeleteCartItem = async (id) => {
    setIsLoading(true);
    await removeCartItem(id);
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter((item) => item.id !== id);
      updateTotalPrice(updatedCartItems); // Recalculate total price after deletion
      return updatedCartItems;
    });

    setIsLoading(false);
  };

  console.log("Cart Items: ", cartItems);

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div
          onClick={() => navigate("/login")}
          className="flex h-screen items-center justify-center"
        >
          <p className="cursor-pointer text-center font-bold hover:text-gray-700 sm:text-2xl md:text-3xl lg:text-4xl">
            Please login to access cart
          </p>
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <CartSkeleton />
      </>
    );
  }

  return (
    <>
      <Header cartItemNumbers={cartItems.length} />
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">Shopping Cart</h1>

        {/* Grid Container */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Courses and Saved for Later (Spanning 2 columns on larger screens) */}
          <div className="lg:col-span-2">
            {/* Courses in Cart */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">
                {cartItems.length} {cartItems.length > 1 ? "Courses" : "Course"}{" "}
                in Cart
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
                          onClick={() => handleDeleteCartItem(item.id)}
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

          {/* Summary and Promotions (Spanning 1 column on larger screens) */}
          {cartItems.length > 0 ? (
            <div className="self-start rounded bg-white p-4 shadow-md md:p-8">
              <h2 className="mb-4 text-xl font-semibold">
                Total: ₹{totalPrice}
              </h2>
              <button
                onClick={() => navigate("/confirm-order")}
                className="w-full rounded bg-theme-primary py-2 text-lg font-semibold text-white hover:bg-purple-700"
              >
                Checkout
              </button>
            </div>
          ) : (
            <div className="self-start rounded bg-white p-4 shadow-md md:p-8">
              <h2 className="mb-4 text-xl font-semibold">
                Add items to purchase
              </h2>
              <button
                onClick={() => navigate("/courses")}
                className="w-full rounded bg-theme-primary py-2 text-lg font-semibold text-white hover:bg-purple-700"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
