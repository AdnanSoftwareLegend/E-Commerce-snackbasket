const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  address: user.address,
  sellerRequest: user.sellerRequest,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// @desc Register User
// @route POST /api/v1/auth/register
const registerUser = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password, phone, address });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// @desc Login User
// @route POST /api/v1/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      sellerRequest: user.sellerRequest,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// @desc Get User Profile
// @route GET /api/v1/auth/profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.json({ user: sanitizeUser(user) });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

// @desc User requests to become seller
// @route POST /api/v1/auth/request-seller
const requestSellerRole = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "seller") {
      return res.status(400).json({ message: "You are already a seller." });
    }

    if (user.sellerRequest?.status === "pending") {
      return res
        .status(400)
        .json({ message: "Your seller request is already pending." });
    }

    user.sellerRequest = {
      status: "pending",
      message: req.body.message || "Requested to become a seller",
      requestedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
    };

    await user.save();
    res.json({
      message: "Seller request sent successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Admin gets all pending seller requests
// @route GET /api/v1/auth/seller-requests
const getSellerRequests = async (req, res) => {
  try {
    const requests = await User.find({ "sellerRequest.status": "pending" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(requests.map((user) => sanitizeUser(user)));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Admin approves or rejects seller request
// @route PATCH /api/v1/auth/seller-requests/:id
const handleSellerRequest = async (req, res) => {
  try {
    const { action } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Seller request not found" });
    }

    if (action === "approve") {
      user.role = "seller";
      user.sellerRequest.status = "approved";
      user.sellerRequest.reviewedBy = req.user._id;
      user.sellerRequest.reviewedAt = new Date();
      user.sellerRequest.message =
        user.sellerRequest.message || "Approved as seller";
    } else if (action === "reject") {
      user.role = "user";
      user.sellerRequest.status = "rejected";
      user.sellerRequest.reviewedBy = req.user._id;
      user.sellerRequest.reviewedAt = new Date();
      user.sellerRequest.message =
        user.sellerRequest.message || "Seller request rejected";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    res.json({
      message:
        action === "approve"
          ? "Seller request approved."
          : "Seller request rejected.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Admin gets all users
// @route GET /api/v1/auth/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users.map((user) => sanitizeUser(user)));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Admin updates a user role
// @route PATCH /api/v1/auth/users/:id/role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["user", "seller", "admin"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    if (role === "seller") {
      user.sellerRequest.status = "approved";
      user.sellerRequest.reviewedAt = new Date();
      user.sellerRequest.reviewedBy = req.user._id;
    } else if (role !== "seller") {
      user.sellerRequest.status = "none";
      user.sellerRequest.message = "";
      user.sellerRequest.reviewedAt = new Date();
      user.sellerRequest.reviewedBy = req.user._id;
    }

    await user.save();
    res.json({
      message: "User role updated successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  requestSellerRole,
  getSellerRequests,
  handleSellerRequest,
  getUsers,
  updateUserRole,
};
