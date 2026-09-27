# E-commerce storefront (Next.js + JSX)

Next.js App Router, plain JavaScript (`.jsx`), no UI library. Layout follows the reference screenshots:
home, shop with filters, product details, cart, wishlist, checkout, contact, blog, footer.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where to change things

| What | File |
| --- | --- |
| **Colors (whole site)** | `app/globals.css` → the `:root { ... }` block at the top |
| Brand name, phone, email, address, currency, tax rate | `lib/config.js` |
| Products, categories, blog posts | `lib/data.js` |
| Product photos | put files in `public/products/` and add `image: "/products/name.jpg"` to the product |
| Fonts | `app/layout.jsx` (Outfit for text, Yellowtail for the logo) |

## Pages

`/` home · `/products` shop (filters, `?category=` and `?q=`) · `/products/[id]` details · `/cart` · `/wishlist` · `/checkout` · `/contact` · `/blog` · `/blog/[slug]`

## Before going live

This is the front end only. Cart and wishlist are saved in the visitor's browser (localStorage).

- **Checkout** does not charge a card or save orders. Connect a payment provider (use its hosted card fields, never handle raw card numbers yourself) and store orders on a server or database.
- **Contact form** does not send the message anywhere yet. Connect it to an API route or an email/form service.
- Product data is a local file. For many products, move it to a database or CMS.
- The footer "App Store / Google Play" chips and social icons are placeholders. Link or remove them.
