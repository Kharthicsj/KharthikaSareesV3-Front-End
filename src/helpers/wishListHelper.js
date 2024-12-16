import axios from "axios";
import toast from "react-hot-toast";

const addProductToWishList = async (productId) => {
  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/add-to-wishlist`,
      { productId },
      { withCredentials: true }
    );
    toast.success("💖 Item added to wishlist!");

  } catch (err) {
    if (err.response?.status === 401) {
      toast("Kindly login to add products to your wishlist", {
        icon: "⚠️",
        duration: 5000,
      });
    } else {
      const errorMessage =
        err.response?.data?.message || "Error adding product to wishlist";
      toast.error(errorMessage, { duration: 5000 });
    }
  } finally {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

const removeProductFromWishList = async (productId) => {
  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/remove-from-wishlist`,
      { productId },
      { withCredentials: true }
    );
    toast.success("💔 Item removed from wishlist!");
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Error removing product from wishlist";
    toast.error(errorMessage, { duration: 5000 });
  } finally {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
};

export { addProductToWishList, removeProductFromWishList };
