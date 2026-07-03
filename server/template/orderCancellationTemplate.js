const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const generateOrderCancellationEmail = (order) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Order Cancellation Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333;">
          <div style="background-color: #fff; padding: 20px; max-width: 600px; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #dc2626; text-align: center;">Order Cancellation Confirmation</h2>
            <p style="font-size: 16px;">Dear ${escapeHtml(order.user?.name || "Customer")},</p>
            <p style="font-size: 16px;">We are writing to confirm that your order <strong>#${order._id}</strong> has been successfully cancelled.</p>
            <p style="font-size: 16px;">Here are the details of your cancelled order:</p>
            <ul style="font-size: 16px;">
              ${(order.items || [])
                .map(
                  (item) =>
                    `<li><strong>Product:</strong> ${escapeHtml(item.name)} | <strong>Quantity:</strong> ${item.quantity}</li>`
                )
                .join("")}
            </ul>
            <p style="font-size: 16px;"><strong>Order Created:</strong> ${new Date(order.createdAt).toLocaleString("en-IN")}</p>
            ${order.rejectionReason ? `<p style="font-size: 16px; color: #dc2626;"><strong>Reason:</strong> ${escapeHtml(order.rejectionReason)}</p>` : ""}
            <p style="font-size: 16px;">If you have any concerns or questions, feel free to contact our support team at <strong>support@samridhienterprises.com</strong>.</p>
            <p style="font-size: 16px; text-align: center;">
              <a href="https://samridhienterprises.com" style="color: #fff; background-color: #2563eb; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Visit Samridhi Enterprises</a>
            </p>
            <p style="font-size: 16px; text-align: center;">Best regards,<br>Samridhi Enterprises</p>
          </div>
        </body>
      </html>
    `;
  };

  export default generateOrderCancellationEmail;
