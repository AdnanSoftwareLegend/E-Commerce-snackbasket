const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  requestSellerRole,
  getSellerRequests,
  handleSellerRequest,
  getUsers,
  updateUserRole,
} = require("../controllers/authController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.post("/request-seller", protect, requestSellerRole);
router.get("/seller-requests", protect, admin, getSellerRequests);
router.patch("/seller-requests/:id", protect, admin, handleSellerRequest);
router.get("/users", protect, admin, getUsers);
router.patch("/users/:id/role", protect, admin, updateUserRole);

module.exports = router;
