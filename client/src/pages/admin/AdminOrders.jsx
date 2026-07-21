import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  adminGetAllOrders,
  adminVerifyPayment,
  adminUpdateOrderStatus,
  clearOrderError,
} from "../../store/order/orderSlice";
import Loader from "../../extras/Loader";
import EmptyState from "../../components/EmptyState";

const STATUS_OPTIONS = [
  "",
  "Pending Verification",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// The fulfilment lifecycle an admin can move an order through. Mirrors the
// backend FULFILLMENT_STATUSES in orderController.adminUpdateOrderStatus, which
// only accepts these post-confirmation statuses (payment verification is
// handled separately via Approve/Reject).
const FULFILLMENT_STATUSES = [
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusColor = (status) => {
  switch (status) {
    case "Success":
    case "Confirmed":
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Pending":
    case "Pending Verification":
    case "Processing":
    case "Shipped":
      return "bg-yellow-100 text-yellow-800";
    case "Failed":
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (d) =>
  new Date(d).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { adminOrders, loading, error } = useSelector((state) => state.order);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(adminGetAllOrders(filter || undefined));
  }, [dispatch, filter]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearOrderError());
    }
  }, [error, dispatch]);

  const handleApprove = (id) => {
    dispatch(adminVerifyPayment({ id, action: "approve" })).then((res) => {
      if (adminVerifyPayment.fulfilled.match(res)) {
        toast.success("Payment approved and order confirmed");
        dispatch(adminGetAllOrders(filter || undefined));
      }
    });
  };

  const handleReject = (id) => {
    const reason = window.prompt(
      "Reason for rejecting this payment (optional):",
      ""
    );
    // window.prompt returns null if the admin cancels.
    if (reason === null) return;
    dispatch(
      adminVerifyPayment({ id, action: "reject", rejectionReason: reason })
    ).then((res) => {
      if (adminVerifyPayment.fulfilled.match(res)) {
        toast.success("Payment rejected and order cancelled");
        dispatch(adminGetAllOrders(filter || undefined));
      }
    });
  };

  // Advance an order through its fulfilment lifecycle. The backend enforces the
  // payment-verified rule (Processing/Shipped/Delivered require a successful
  // payment); we surface any rejection message it returns.
  const handleStatusChange = (id, orderStatus, carrier, trackingNumber) => {
    dispatch(adminUpdateOrderStatus({ id, orderStatus, carrier, trackingNumber })).then((res) => {
      if (adminUpdateOrderStatus.fulfilled.match(res)) {
        toast.success(`Order status/shipment updated`);
        dispatch(adminGetAllOrders(filter || undefined));
      } else if (adminUpdateOrderStatus.rejected.match(res)) {
        toast.error(res.payload || "Failed to update order status");
      }
    });
  };

  if (loading && (!adminOrders || adminOrders.length === 0)) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900">
            Manage Orders
          </h1>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s || "all"} value={s}>
                {s === "" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>

        {!adminOrders || adminOrders.length === 0 ? (
          <EmptyState
            icon="Inbox"
            title="No orders found"
            message={filter ? `No orders with status "${filter}". Try a different filter.` : "No orders have been placed yet. They will appear here once customers start ordering."}
          />
        ) : (
          <div className="space-y-6">
            {adminOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                          order.paymentStatus
                        )}`}
                      >
                        Payment: {order.paymentStatus}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        {order.paymentMethod}
                      </span>
                    </div>

                    <p className="font-mono text-xs text-gray-500 break-all mb-1">
                      {order._id}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {formatDate(order.createdAt)}
                    </p>

                    <div className="text-sm text-gray-700 mb-3">
                      <span className="font-semibold">Customer:</span>{" "}
                      {order.user?.name || "—"}{" "}
                      {order.user?.email ? `(${order.user.email})` : ""}
                    </div>

                    <div className="text-sm text-gray-700 mb-3">
                      <span className="font-semibold">Ship to:</span>{" "}
                      {order.shippingAddress?.fullName},{" "}
                      {order.shippingAddress?.addressLine},{" "}
                      {order.shippingAddress?.city}
                      {order.shippingAddress?.state
                        ? ", " + order.shippingAddress.state
                        : ""}{" "}
                      - {order.shippingAddress?.pincode}, Ph:{" "}
                      {order.shippingAddress?.phone}
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-1 mb-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={item._id || item.part || `${order._id}-${idx}`}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-700 pr-2">
                            {item.name}{" "}
                            <span className="text-gray-400">
                              x{item.quantity}
                            </span>
                          </span>
                          <span className="font-semibold text-gray-900 whitespace-nowrap">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="text-lg font-bold text-gray-900">
                      Total: ₹{order.itemsTotal.toLocaleString()}
                    </div>

                    {order.upiReference && (
                      <p className="text-sm text-gray-500 mt-1">
                        UPI Ref: {order.upiReference}
                      </p>
                    )}
                    {order.rejectionReason && (
                      <p className="text-sm text-red-600 mt-2 bg-red-50 rounded-lg px-3 py-1.5 inline-block">
                        Rejected: {order.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Screenshot + actions */}
                  <div className="lg:w-64 flex-shrink-0 flex flex-col gap-3">
                    {order.paymentScreenshot?.url ? (
                      <a
                        href={order.paymentScreenshot.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Click to view full screenshot"
                      >
                        <img
                          src={order.paymentScreenshot.url}
                          alt="Payment screenshot"
                          className="w-full h-40 object-cover rounded-xl border border-gray-200 hover:opacity-90 transition"
                        />
                      </a>
                    ) : (
                      <div className="w-full h-40 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 text-center p-3">
                        {order.paymentMethod === "COD"
                          ? "COD — no screenshot"
                          : "No screenshot"}
                      </div>
                    )}

                    {order.paymentStatus === "Pending Verification" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(order._id)}
                          className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(order._id)}
                          className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Fulfilment status control — available once the order is
                        no longer awaiting payment verification and not in a
                        terminal state. Lets the admin advance the lifecycle
                        (Confirmed -> Processing -> Shipped -> Delivered) or
                        cancel. */}
                    {order.orderStatus !== "Pending Verification" &&
                      order.orderStatus !== "Delivered" &&
                      order.orderStatus !== "Cancelled" && (
                        <div className="border-t border-gray-100 pt-3 mt-1 space-y-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Update fulfilment status & tracking
                          </label>
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value, order.carrier, order.trackingNumber)
                            }
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            {FULFILLMENT_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Carrier (e.g. Blue Dart)"
                            defaultValue={order.carrier || ""}
                            onBlur={(e) =>
                              handleStatusChange(order._id, order.orderStatus, e.target.value, order.trackingNumber)
                            }
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          <input
                            type="text"
                            placeholder="Tracking Number"
                            defaultValue={order.trackingNumber || ""}
                            onBlur={(e) =>
                              handleStatusChange(order._id, order.orderStatus, order.carrier, e.target.value)
                            }
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                        </div>
                      )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
