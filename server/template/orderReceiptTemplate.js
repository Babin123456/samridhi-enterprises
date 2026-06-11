// Builds a clean, email-client-friendly HTML receipt from an Order document.
// Uses only inline styles + a simple table layout (no flex/grid) for maximum
// compatibility across email clients.

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const inr = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`;

const orderReceiptHtml = (order, user) => {
  const date = new Date(order.createdAt || Date.now()).toLocaleString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const addr = order.shippingAddress || {};
  const customerName = escapeHtml(addr.fullName || user?.name || "Customer");

  const rows = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">${escapeHtml(
          item.name
        )}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;text-align:center;">${escapeHtml(
          item.quantity
        )}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;text-align:right;">${inr(
          item.price
        )}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;text-align:right;">${inr(
          item.price * item.quantity
        )}</td>
      </tr>`
    )
    .join("");

  const upiRefRow = order.upiReference
    ? `<p style="margin:4px 0;font-size:14px;color:#555555;"><strong>UPI Reference:</strong> ${escapeHtml(
        order.upiReference
      )}</p>`
    : "";

  return `
  <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;background-color:#ffffff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
    <div style="background-color:#111827;padding:24px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:22px;">Samridhi Enterprises</h1>
      <p style="margin:6px 0 0;color:#cbd5e1;font-size:13px;">Order Receipt</p>
    </div>

    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr>
          <td style="vertical-align:top;font-size:13px;color:#555555;">
            <p style="margin:0 0 4px;"><strong>Receipt No:</strong><br/>${escapeHtml(
              order._id
            )}</p>
            <p style="margin:8px 0 0;"><strong>Date:</strong><br/>${escapeHtml(
              date
            )}</p>
          </td>
          <td style="vertical-align:top;font-size:13px;color:#555555;text-align:right;">
            <p style="margin:0 0 4px;"><strong>Billed To:</strong><br/>${customerName}</p>
            ${
              user?.email
                ? `<p style="margin:8px 0 0;">${escapeHtml(user.email)}</p>`
                : ""
            }
          </td>
        </tr>
      </table>

      <div style="background-color:#f9fafb;border:1px solid #eeeeee;border-radius:6px;padding:12px 14px;margin-bottom:18px;">
        <p style="margin:0 0 4px;font-size:13px;color:#111827;"><strong>Shipping Address</strong></p>
        <p style="margin:0;font-size:13px;color:#555555;line-height:1.5;">
          ${escapeHtml(addr.fullName)}<br/>
          ${escapeHtml(addr.addressLine)}<br/>
          ${escapeHtml(addr.city)}${addr.state ? ", " + escapeHtml(addr.state) : ""} - ${escapeHtml(
    addr.pincode
  )}<br/>
          Phone: ${escapeHtml(addr.phone)}
        </p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <thead>
          <tr>
            <th style="padding:10px 8px;border-bottom:2px solid #111827;font-size:13px;color:#111827;text-align:left;">Item</th>
            <th style="padding:10px 8px;border-bottom:2px solid #111827;font-size:13px;color:#111827;text-align:center;">Qty</th>
            <th style="padding:10px 8px;border-bottom:2px solid #111827;font-size:13px;color:#111827;text-align:right;">Unit Price</th>
            <th style="padding:10px 8px;border-bottom:2px solid #111827;font-size:13px;color:#111827;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:12px 8px;font-size:15px;color:#111827;text-align:right;"><strong>Grand Total</strong></td>
            <td style="padding:12px 8px;font-size:15px;color:#111827;text-align:right;"><strong>${inr(
              order.itemsTotal
            )}</strong></td>
          </tr>
        </tfoot>
      </table>

      <div style="border-top:1px solid #eeeeee;padding-top:14px;">
        <p style="margin:4px 0;font-size:14px;color:#555555;"><strong>Payment Method:</strong> ${escapeHtml(
          order.paymentMethod
        )}</p>
        <p style="margin:4px 0;font-size:14px;color:#555555;"><strong>Payment Status:</strong> ${escapeHtml(
          order.paymentStatus
        )}</p>
        <p style="margin:4px 0;font-size:14px;color:#555555;"><strong>Order Status:</strong> ${escapeHtml(
          order.orderStatus
        )}</p>
        ${upiRefRow}
      </div>

      <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;text-align:center;">
        Thank you for shopping with Samridhi Enterprises.
      </p>
    </div>
  </div>`;
};

export default orderReceiptHtml;
