import Coupon from "../models/couponModel.js";
import Cart from "../models/cartModel.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";



// ── Admin: create a coupon ────────────────────────────────────────────────
export const createCoupon = catchAsyncErrors(async (req, res, next) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    expiresAt,
    usageLimit,
    isActive,
  } = req.body;



  const normalizedCode = String(code).trim().toUpperCase();
  const existing = await Coupon.findOne({ code: normalizedCode });
  if (existing) {
    return next(new ErrorHandler("A coupon with this code already exists", 400));
  }

  const coupon = await Coupon.create({
    code: normalizedCode,
    description: description || "",
    discountType,
    discountValue,
    minOrderAmount: minOrderAmount ?? 0,
    maxDiscount: maxDiscount ?? 0,
    expiresAt: expiresAt || null,
    usageLimit: usageLimit ?? 0,
    isActive: isActive ?? true,
  });

  res.status(201).json({ success: true, coupon });
});

// ── Admin: list all coupons ───────────────────────────────────────────────
export const getAllCoupons = catchAsyncErrors(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, coupons });
});

// ── Admin: update a coupon ────────────────────────────────────────────────
export const updateCoupon = catchAsyncErrors(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return next(new ErrorHandler("Coupon not found", 404));

  const {
    code,
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    expiresAt,
    usageLimit,
    isActive,
  } = req.body;

  const effectiveType = discountType ?? coupon.discountType;
  const effectiveValue = discountValue ?? coupon.discountValue;
  if (effectiveType === "PERCENTAGE" && effectiveValue > 100) {
    return next(new ErrorHandler("A percentage discount cannot exceed 100", 400));
  }

  if (code !== undefined && String(code).trim()) {
    const normalizedCode = String(code).trim().toUpperCase();
    if (normalizedCode !== coupon.code) {
      const clash = await Coupon.findOne({ code: normalizedCode });
      if (clash) {
        return next(new ErrorHandler("A coupon with this code already exists", 400));
      }
      coupon.code = normalizedCode;
    }
  }

  if (description !== undefined) coupon.description = description;
  if (discountType !== undefined) coupon.discountType = discountType;
  if (discountValue !== undefined) coupon.discountValue = discountValue;
  if (minOrderAmount !== undefined) coupon.minOrderAmount = minOrderAmount;
  if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
  if (expiresAt !== undefined) coupon.expiresAt = expiresAt || null;
  if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
  if (isActive !== undefined) coupon.isActive = isActive;

  await coupon.save();
  res.status(200).json({ success: true, coupon });
});

// ── Admin: delete a coupon ────────────────────────────────────────────────
export const deleteCoupon = catchAsyncErrors(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return next(new ErrorHandler("Coupon not found", 404));
  await coupon.deleteOne();
  res.status(200).json({ success: true, message: "Coupon deleted" });
});

// ── User: validate a coupon against the current cart ──────────────────────
// Computes the discount server-side from the user's own cart subtotal so the
// client cannot influence the amount. Returns the discount and resulting total
// for display only — order creation re-validates independently.
export const validateCoupon = catchAsyncErrors(async (req, res, next) => {
  const { code } = req.body;

  const coupon = await Coupon.findOne({
    code: String(code).trim().toUpperCase(),
  });
  if (!coupon) {
    return next(new ErrorHandler("Invalid coupon code", 404));
  }

  const redeemable = coupon.isRedeemable();
  if (!redeemable.ok) {
    return next(new ErrorHandler(redeemable.reason, 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    return next(new ErrorHandler("Your cart is empty", 400));
  }

  const subtotal = cart.total || 0;
  if (subtotal < coupon.minOrderAmount) {
    return next(
      new ErrorHandler(
        `This coupon requires a minimum order of ₹${coupon.minOrderAmount}`,
        400
      )
    );
  }

  const discount = coupon.computeDiscount(subtotal);
  if (discount <= 0) {
    return next(new ErrorHandler("This coupon does not apply to your cart", 400));
  }

  res.status(200).json({
    success: true,
    coupon: {
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    },
    subtotal,
    discount,
    payable: Math.max(0, subtotal - discount),
  });
});
