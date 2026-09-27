"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  Heart,
  ShoppingBag,
  LayoutDashboard,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  ShieldCheck,
  UserCog,
  Plus,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import RequireAuth from "@/components/common/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useOrders } from "@/hooks/useOrders";
import { useCategories } from "@/hooks/useProducts";
import {
  requestSellerRole,
  getSellerRequests,
  handleSellerRequest,
  getUsers,
  updateUserRole,
} from "@/services/authService";
import {
  createProduct,
  getSellerProducts,
  uploadToImgbb,
} from "@/services/productService";

const favoriteProducts = [
  { name: "Organic Almond Mix", price: "$18.00" },
  { name: "Trail Snack Box", price: "$22.00" },
  { name: "Protein Granola", price: "$15.50" },
];

const reviewItems = [
  { product: "Coco Crunch Bites", rating: 5, comment: "Very fresh and tasty." },
  {
    product: "Fruit & Nut Mix",
    rating: 4,
    comment: "Loved the packaging and quality.",
  },
];

function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getOrderItems(order) {
  return order.items || order.orderItems || [];
}

function getOrderStatus(order) {
  return (
    order.orderStatus ||
    (order.isDelivered ? "Delivered" : order.isPaid ? "Paid" : "Processing")
  );
}

function DashboardContent() {
  const queryClient = useQueryClient();
  const { user, logout, refreshUser } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: categories = [] } = useCategories();

  const [requestMessage, setRequestMessage] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "10",
    category: "",
    image: "",
  });
  const [productLoading, setProductLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const orderList = Array.isArray(orders) ? orders : [];
  const recentOrders = orderList.slice(0, 5);

  const sellerProductsQuery = useQuery({
    queryKey: ["sellerProducts"],
    queryFn: getSellerProducts,
    enabled: !!user && user.role === "seller",
  });

  const sellerRequestsQuery = useQuery({
    queryKey: ["sellerRequests"],
    queryFn: getSellerRequests,
    enabled: !!user && user.role === "admin",
  });

  const allUsersQuery = useQuery({
    queryKey: ["allUsers"],
    queryFn: getUsers,
    enabled: !!user && user.role === "admin",
  });

  const stats = [
    {
      label: "Total Orders",
      value: orderList.length,
      icon: Package,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Items in Cart",
      value: cartItems.length,
      icon: ShoppingBag,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Wishlist Items",
      value: wishlistItems.length,
      icon: Heart,
      color: "bg-red-50 text-red-500",
    },
  ];

  const submitSellerRequest = async () => {
    if (!user || user.role === "seller") return;
    setRequestLoading(true);
    setFeedback("");

    try {
      const result = await requestSellerRole(requestMessage);
      setFeedback(result.message || "Seller request sent successfully.");
      setRequestMessage("");
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ["sellerRequests"] });
    } catch (error) {
      setFeedback(error.message || "Request failed");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    setFeedback("");

    try {
      const payload = {
        title: productForm.title,
        description: productForm.description,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        category: productForm.category,
        vendor: user?.name || "SnackBasket",
      };

      if (
        !payload.title ||
        !payload.description ||
        !payload.price ||
        !payload.category
      ) {
        throw new Error("Please fill all required fields.");
      }

      if (productForm.image) {
        const uploadedUrl = await uploadToImgbb(productForm.image);
        payload.image = uploadedUrl;
      }

      if (!payload.image) {
        throw new Error("Please choose an image for the product.");
      }

      await createProduct(payload);
      setFeedback("Product added successfully.");
      setProductForm({
        title: "",
        description: "",
        price: "",
        stock: "10",
        category: "",
        image: "",
      });
      queryClient.invalidateQueries({ queryKey: ["sellerProducts"] });
    } catch (error) {
      setFeedback(error.message || "Failed to add product.");
    } finally {
      setProductLoading(false);
    }
  };

  const approveSellerRequest = async (id) => {
    try {
      await handleSellerRequest(id, "approve");
      queryClient.invalidateQueries({ queryKey: ["sellerRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      await refreshUser();
    } catch (error) {
      setFeedback(error.message || "Could not approve seller request.");
    }
  };

  const rejectSellerRequest = async (id) => {
    try {
      await handleSellerRequest(id, "reject");
      queryClient.invalidateQueries({ queryKey: ["sellerRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      await refreshUser();
    } catch (error) {
      setFeedback(error.message || "Could not reject seller request.");
    }
  };

  const changeUserRole = async (id, role) => {
    try {
      await updateUserRole(id, role);
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      await refreshUser();
    } catch (error) {
      setFeedback(error.message || "Could not update role.");
    }
  };

  const userRole = user?.role || "user";

  const profileCard = (
    <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit space-y-4">
      <h3 className="font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
        <LayoutDashboard className="w-4 h-4 text-emerald-600" /> My Profile
      </h3>

      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold uppercase text-lg">
          {(user?.name || "U").charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize">{userRole}</p>
        </div>
      </div>

      <ul className="space-y-2 text-sm text-gray-600">
        {user?.email && (
          <li className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-600" /> {user.email}
          </li>
        )}
        {user?.phone && (
          <li className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-600" /> {user.phone}
          </li>
        )}
        {user?.address && (
          <li className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 mt-0.5" />{" "}
            {user.address}
          </li>
        )}
      </ul>

      <div className="space-y-2 pt-2">
        <Link
          href="/account"
          className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition text-sm"
        >
          View My Account
        </Link>
        <Link
          href="/shop"
          className="block text-center border border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold py-2.5 rounded-xl transition text-sm"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl mb-8">
        <h1 className="text-xl font-bold text-gray-800">
          {userRole === "admin"
            ? "Admin Dashboard"
            : userRole === "seller"
              ? "Seller Dashboard"
              : "User Dashboard"}
        </h1>
        <p className="text-xs text-emerald-800 font-medium">Home : Dashboard</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back,{" "}
          <span className="text-emerald-600">{user?.name || "Customer"}!</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {userRole === "admin"
            ? "Manage products, seller requests, and user access from one place."
            : userRole === "seller"
              ? "Manage your products, orders, and sales activity."
              : "Here is an overview of your shopping activity at SnackBasket."}
        </p>
      </div>

      {userRole === "user" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white border rounded-2xl p-6 flex items-center gap-4 shadow-sm"
            >
              <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {userRole === "user" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {profileCard}

          <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm h-fit p-6">
            <div className="flex items-center justify-between pb-4 border-b">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" /> My Orders
              </h3>
              <Link
                href="/account"
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                View All
              </Link>
            </div>

            {ordersLoading ? (
              <div className="py-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-14 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : orderList.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                No orders yet. Start shopping to see your order history here.
              </div>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-emerald-50 text-emerald-900 border-b text-xs font-semibold">
                      <th className="p-3">Order</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-sm">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="p-3 font-mono text-xs">
                          #{String(order._id).slice(-6).toUpperCase()}
                        </td>
                        <td className="p-3 text-gray-600">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td className="p-3">{getOrderItems(order).length}</td>
                        <td className="p-3 font-bold text-emerald-600">
                          ${Number(order.totalAmount ?? 0).toFixed(2)}
                        </td>
                        <td className="p-3">
                          <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium">
                            {getOrderStatus(order)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="rounded-2xl border bg-gray-50 p-4">
                <div className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                  <Star className="w-4 h-4 text-amber-500" /> My Review
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  {reviewItems.map((item) => (
                    <li key={item.product} className="bg-white rounded-xl p-3">
                      <div className="font-medium text-gray-800">
                        {item.product}
                      </div>
                      <div className="text-amber-500">
                        {"★".repeat(item.rating)}
                        {"☆".repeat(5 - item.rating)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.comment}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border bg-gray-50 p-4">
                <div className="flex items-center gap-2 font-bold text-gray-800 mb-3">
                  <Heart className="w-4 h-4 text-red-500" /> Favorite Product
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  {favoriteProducts.map((item) => (
                    <li
                      key={item.name}
                      className="bg-white rounded-xl p-3 flex justify-between items-center"
                    >
                      <span>{item.name}</span>
                      <span className="font-semibold text-emerald-600">
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t pt-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-800">Become a seller</h3>
                  <p className="text-xs text-gray-500">
                    Request seller access to list your own products.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Write a short seller request"
                    className="border rounded-xl px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <button
                    onClick={submitSellerRequest}
                    disabled={requestLoading || user?.role === "seller"}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-60"
                  >
                    {requestLoading
                      ? "Sending..."
                      : user?.role === "seller"
                        ? "Already Seller"
                        : "Request"}
                  </button>
                </div>
              </div>
              {feedback && (
                <p className="mt-3 text-sm text-emerald-700">{feedback}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {userRole === "seller" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {profileCard}

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Plus className="w-4 h-4 text-emerald-600" /> Add Product
              </h3>
              <form
                onSubmit={handleProductSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  value={productForm.title}
                  onChange={(e) =>
                    setProductForm({ ...productForm, title: e.target.value })
                  }
                  placeholder="Product title"
                  className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                  required
                />
                <select
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  type="number"
                  placeholder="Price"
                  className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                  required
                />
                <input
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                  type="number"
                  placeholder="Stock"
                  className="border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      image: e.target.files?.[0] || "",
                    })
                  }
                  className="md:col-span-2 border rounded-xl px-3 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:px-3 file:py-2"
                />
                <textarea
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Product description"
                  className="md:col-span-2 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none min-h-[100px]"
                  required
                />
                <button
                  type="submit"
                  disabled={productLoading}
                  className="md:col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl disabled:opacity-60"
                >
                  {productLoading ? "Adding..." : "Add Product"}
                </button>
              </form>
              {feedback && (
                <p className="mt-4 text-sm text-emerald-700">{feedback}</p>
              )}
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ShoppingBag className="w-4 h-4 text-emerald-600" /> My Product
              </h3>
              {sellerProductsQuery.isLoading ? (
                <div className="h-20 bg-gray-100 animate-pulse rounded-xl" />
              ) : sellerProductsQuery.data?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sellerProductsQuery.data.map((product) => (
                    <div
                      key={product._id}
                      className="border rounded-xl p-4 hover:shadow-sm transition"
                    >
                      <div className="font-semibold text-gray-800">
                        {product.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {product.category?.name || "General"}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-emerald-600 font-bold">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span className="text-gray-500">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No products added yet.</p>
              )}
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Order
                requests
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  New order request from customer #SK-1042
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  Pending delivery for product bundle order
                </div>
                <div className="bg-gray-50 border rounded-xl p-3">
                  No urgent action required
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {userRole === "admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {profileCard}

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <UserCog className="w-4 h-4 text-emerald-600" /> Manage User
              </h3>
              {allUsersQuery.isLoading ? (
                <div className="h-20 bg-gray-100 animate-pulse rounded-xl" />
              ) : (
                <div className="space-y-3">
                  {allUsersQuery.data?.map((userItem) => (
                    <div
                      key={userItem._id}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-3 border rounded-xl p-3 bg-gray-50"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {userItem.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {userItem.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full capitalize">
                          {userItem.role}
                        </span>
                        <select
                          defaultValue={userItem.role}
                          onChange={(e) =>
                            changeUserRole(userItem._id, e.target.value)
                          }
                          className="border rounded-lg px-2 py-1.5 text-sm"
                        >
                          <option value="user">User</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Manage
                request
              </h3>
              {sellerRequestsQuery.isLoading ? (
                <div className="h-20 bg-gray-100 animate-pulse rounded-xl" />
              ) : sellerRequestsQuery.data?.length ? (
                <div className="space-y-3">
                  {sellerRequestsQuery.data.map((requestUser) => (
                    <div
                      key={requestUser._id}
                      className="border rounded-xl p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {requestUser.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {requestUser.email}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {requestUser.sellerRequest?.message ||
                              "Requested seller access."}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              approveSellerRequest(requestUser._id)
                            }
                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectSellerRequest(requestUser._id)}
                            className="bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No pending seller requests.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {userRole === "user" && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={logout}
            className="border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-2 px-4 rounded-xl transition text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
