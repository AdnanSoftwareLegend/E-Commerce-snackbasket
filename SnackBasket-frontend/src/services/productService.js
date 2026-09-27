import apiClient from "./api";

export const uploadToImgbb = async (file) => {
  if (!file) return null;

  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_IMGBB_KEY is not configured.");
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", key);

  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.error?.message || "Image upload failed");
  }

  return result.data.url;
};

// Shob Products Fetch
export const getProducts = async (params = {}) => {
  return await apiClient.get("/products", { params });
};

export const getSellerProducts = async () => {
  return await apiClient.get("/products/my-products");
};

// Single Product Details
export const getProductById = async (id) => {
  return await apiClient.get(`/products/${id}`);
};

export const createProduct = async (productData) => {
  return await apiClient.post("/products", productData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Shob Categories
export const getCategories = async () => {
  return await apiClient.get("/categories");
};

// Deals / Discounted Products
export const getFeaturedDeals = async () => {
  return await apiClient.get("/products/deals");
};
