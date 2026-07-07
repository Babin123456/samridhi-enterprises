const generateReceiptHTML = (order) => {
  const { user, items, orderStatus, _id, createdAt } = order;

  const formattedDate = new Date(createdAt).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const productList = (items || [])
    .map((item) => {
      const productImage =
        item.images && item.images.length > 0
          ? item.images[0].url
          : "https://via.placeholder.com/50";

      return `
      <tr>
        <td class="product-image">
          <img src="${productImage}" alt="${item.name}" width="60" height="60" />
        </td>
        <td class="product-name">${item.name}</td>
        <td class="product-quantity">${item.quantity}</td>
        <td class="product-price">Rs. ${Number(item.price * item.quantity).toLocaleString("en-IN")}</td>
      </tr>
    `;
    })
    .join("");

  const totalItems = (items || []).reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = (items || []).reduce((sum, item) => sum + item.price * item.quantity, 0);

  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Samridhi Enterprises - Order Confirmation</title>
        <style>
          :root {
            --primary-color: #2563eb;
            --primary-color-dark: #1d4ed8;
            --primary-color-light: #60a5fa;
            --background-light: linear-gradient(135deg, #eff6ff 0%, #f9fafb 50%, #eff6ff 100%);
            --background-dark: linear-gradient(135deg, #1a1a2e 0%, #1e293b 50%, #0f172a 100%);
            --text-light: #1e3a8a;
            --text-dark: #93c5fd;
            --border-light: #bfdbfe;
            --border-dark: #1e3a5f;
            --shadow-light: 0 8px 30px rgba(37, 99, 235, 0.1);
            --shadow-dark: 0 8px 30px rgba(0, 0, 0, 0.5);
          }

          @media (prefers-color-scheme: dark) {
            body { background: var(--background-dark); color: var(--text-dark); }
            .container { background: #121212; box-shadow: var(--shadow-dark); border: 1px solid var(--border-dark); }
            h2, h3 { color: var(--primary-color-light); }
            table th { background-color: #1e293b; color: var(--text-dark); border-bottom: 1px solid var(--border-dark); }
            table td { border-bottom: 1px solid var(--border-dark); }
            .order-status { color: var(--primary-color-light); }
            tr:nth-child(even) { background-color: #1a1a2e; }
            .footer, .contact { color: #a6a6a6; }
            .btn { background-color: var(--primary-color); color: #fff; }
            a { color: var(--primary-color-light); }
            .divider { background: linear-gradient(90deg, transparent, var(--primary-color-light), transparent); }
            .product-image img { border: 1px solid var(--border-dark); }
          }

          @media (prefers-color-scheme: light) {
            body { background: var(--background-light); color: var(--text-light); }
            .container { background: #ffffff; box-shadow: var(--shadow-light); border: 1px solid var(--border-light); }
            h2, h3 { color: var(--primary-color); }
            table th { background-color: #eff6ff; color: var(--text-light); border-bottom: 1px solid var(--border-light); }
            table td { border-bottom: 1px solid var(--border-light); }
            .order-status { color: var(--primary-color); }
            tr:nth-child(even) { background-color: #f8fafc; }
            .footer, .contact { color: #666; }
            .btn { background-color: var(--primary-color); color: #fff; }
            a { color: var(--primary-color); }
            .divider { background: linear-gradient(90deg, transparent, var(--primary-color), transparent); }
            .product-image img { border: 1px solid var(--border-light); }
          }

          body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
          .container { max-width: 700px; margin: 20px auto; padding: 40px; border-radius: 12px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; letter-spacing: 1px; margin-bottom: 5px; }
          h2 { font-size: 24px; font-weight: 600; text-align: center; margin-bottom: 20px; letter-spacing: 0.5px; }
          h3 { font-size: 18px; font-weight: 600; margin-top: 30px; margin-bottom: 15px; letter-spacing: 0.5px; }
          p { font-size: 16px; line-height: 1.6; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; border-radius: 8px; overflow: hidden; }
          th, td { padding: 15px; text-align: left; }
          th { font-weight: 600; }
          .order-status { font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
          .footer { margin-top: 40px; text-align: center; font-size: 15px; }
          .btn { display: inline-block; padding: 12px 28px; text-decoration: none; border-radius: 50px; font-size: 16px; font-weight: 600; margin-top: 20px; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 0.5px; }
          .contact { margin-top: 30px; text-align: center; font-size: 15px; }
          .contact a { text-decoration: none; font-weight: 600; }
          .divider { height: 1px; width: 80%; margin: 30px auto; }
          .product-image { width: 70px; text-align: center; padding: 10px; }
          .product-image img { border-radius: 8px; object-fit: cover; }
          .product-name { font-weight: 500; }
          .product-quantity, .product-price { text-align: center; font-weight: 600; }
          .order-summary { background-color: rgba(37, 99, 235, 0.05); border-radius: 8px; padding: 20px; margin: 30px 0; }
          .order-summary p { display: flex; justify-content: space-between; margin: 10px 0; }
          @media (max-width: 600px) { .container { padding: 20px; } table th, table td { padding: 10px; } .product-image { width: 50px; } .product-image img { width: 50px; height: 50px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Samridhi Enterprises</div>
            <p>Your Trusted Auto Parts Partner</p>
          </div>

          <h2>Order Confirmation</h2>

          <p>Dear <strong>${user?.name || "Customer"}</strong>,</p>
          <p>Thank you for choosing Samridhi Enterprises. Your order has been confirmed. Here are the details:</p>

          <div class="order-summary">
            <h3>Order Summary</h3>
            <p><span>Order ID:</span> <strong>#${_id}</strong></p>
            <p><span>Order Date:</span> <strong>${formattedDate}</strong></p>
            <p><span>Status:</span> <strong class="order-status">${orderStatus}</strong></p>
            <p><span>Total Items:</span> <strong>${totalItems}</strong></p>
            <p><span>Grand Total:</span> <strong>Rs. ${grandTotal.toLocaleString("en-IN")}</strong></p>
          </div>

          <h3>Items Ordered</h3>
          <table>
            <thead>
              <tr>
                <th style="text-align: center;">Image</th>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: center;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${productList}
            </tbody>
          </table>

          <div class="divider"></div>

          <div class="footer">
            <p>Your order will be processed and shipped soon. You will receive updates via email.</p>
            <p>Thank you for trusting <strong>Samridhi Enterprises</strong> with your auto parts needs!</p>
          </div>

          <div class="contact">
            <p><strong>Questions?</strong> Contact our support team at <a href="mailto:support@samridhienterprises.com">support@samridhienterprises.com</a></p>
            <p>Visit our <a href="https://samridhienterprises.com">website</a> to track your order.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export default generateReceiptHTML;
