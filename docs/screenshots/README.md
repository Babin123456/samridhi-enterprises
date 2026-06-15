# Screenshots

Place all app screenshots in this folder. They are referenced from the main
[`README.md`](../../README.md) and render automatically once the files are added
with the exact filenames listed below.

## How to capture

Run the app locally first (two terminals):

```bash
# Terminal 1 - backend
cd server
npm run dev

# Terminal 2 - frontend
cd client
npm run dev
```

Then open http://localhost:5173 and capture each page below.
Use **1280x800** for desktop shots and **390x844** for mobile shots.

## Desktop screenshots (1280x800)

| Filename | Page | Route | Notes |
|---|---|---|---|
| `home-page.png` | Home | `/` | Hero banner + featured products |
| `product-listing.png` | Product Listing | `/products` | Capture with a brand/model filter applied |
| `product-details.png` | Product Details | `/products/:id` | Any single product page |
| `cart.png` | Cart | `/cart` | A few items in the cart |
| `checkout.png` | Checkout | `/checkout` | Checkout / address step |
| `admin-dashboard.png` | Admin Dashboard | `/admin/dashboard` | Overview cards |
| `admin-analytics.png` | Sales Analytics | `/admin/analytics` | Charts / analytics view |
| `admin-products.png` | Product Management | `/admin/parts` | Parts management table |
| `admin-orders.png` | Order Management | `/admin/orders` | Orders table |

> Admin pages require logging in with an admin account.

## Mobile screenshots (390x844)

| Filename | Page | Route |
|---|---|---|
| `mobile-home.png` | Home | `/` |
| `mobile-products.png` | Product Listing | `/products` |
| `mobile-cart.png` | Cart | `/cart` |
| `mobile-checkout.png` | Checkout | `/checkout` |

## Tools

- **Windows:** `Win + Shift + S` (Snipping Tool), or your browser's DevTools.
- **Browser DevTools:** press `F12`, toggle the device toolbar (`Ctrl + Shift + M`),
  set a responsive width of `1280` for desktop or `390` for mobile, then capture.
- Save each file with the **exact filename** above so it appears in the README
  automatically with no further edits.
