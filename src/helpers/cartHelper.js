import axios from "axios";
import toast from "react-hot-toast";

const addProductToCart = async (productId) => {
  try {
    // Send request to add product to cart
    await axios.post(
      `${process.env.REACT_APP_API_URL}/add-to-cart`,
      { productId },
      { withCredentials: true } // Ensure cookies are sent for session tracking
    );
    toast.success("🎉 Item added to cart! 🛒");
  } catch (err) {
    if (err.response?.status === 401) {
      // Custom toast warning for unauthorized access (user not logged in)
      toast("Kindly login to add products to your cart", {
        icon: "⚠️",
        duration: 5000,
      });
    } else {
      // General error handling: show error toast
      const errorMessage = err.response?.data?.message || "Error adding product to cart";
      toast.error(errorMessage, { duration: 5000 });
    }
  } finally {
    setInterval(
      () => {
        window.location.reload();
      }, 2500)
  }
};

const removeProductFromCart = async (productId) => {
  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/remove-from-cart`,
      { productId },
      { withCredentials: true }
    );
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Error removing product from cart";
    toast.error(errorMessage, { duration: 5000 });
  } finally {
    setInterval(
      () => {
        window.location.reload();
      }, 2500)
  }
};

export { addProductToCart, removeProductFromCart };
