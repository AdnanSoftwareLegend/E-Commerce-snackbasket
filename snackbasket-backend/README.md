# SnackBasket Backend API

Frontend থেকে API call করার জন্য base URL:

```js
const API_URL = 'http://localhost:5000/api/v1';
```

`🔒` endpoint ব্যবহার করতে login/register থেকে পাওয়া token পাঠাতে হবে:

```js
headers: { Authorization: `Bearer ${token}` }
```

## Public endpoints

| Method | Path | ব্যবহার |
| --- | --- | --- |
| `POST` | `/auth/register` | নতুন user register |
| `POST` | `/auth/login` | login করে token নেওয়া |
| `GET` | `/products` | সব product; optional query: `keyword`, `category`, `maxPrice` |
| `GET` | `/products/:id` | একটি product-এর বিস্তারিত |
| `GET` | `/categories` | সব category |
| `POST` | `/orders/create` | নতুন order তৈরি (guest checkout-ও করা যায়) |
| `GET` | `/blogs` | সব blog |
| `GET` | `/blogs/:slug` | slug দিয়ে একটি blog |
| `GET` | `/uploads/:filename` | uploaded image দেখানো |
| `GET` | `/payments/:gateway/success?orderId=:id&status=success` | demo payment success callback |
| `GET` | `/payments/:gateway/cancel?orderId=:id` | payment cancel callback |
| `GET` | `/payments/:gateway/fail?orderId=:id` | payment failure callback |

Product filter উদাহরণ:

```text
GET /products?keyword=chips&category=snacks&maxPrice=500
```

## Login required endpoints

| Method | Path | ব্যবহার | Body |
| --- | --- | --- | --- |
| `GET` | `/auth/profile` | নিজের profile | — |
| `GET` | `/cart` | নিজের cart | — |
| `POST` | `/cart/add` | cart-এ product যোগ করা | `{ "productId": "...", "quantity": 1 }` |
| `PUT` | `/cart/update/:productId` | product quantity পরিবর্তন | `{ "quantity": 2 }` |
| `DELETE` | `/cart/remove/:productId` | cart থেকে product বাদ দেওয়া | — |
| `DELETE` | `/cart` | সম্পূর্ণ cart খালি করা | — |
| `GET` | `/orders/my-orders` | নিজের order history | — |
| `POST` | `/payments/stripe/payment-intent` | Stripe payment intent তৈরি | `{ "amount": 100, "currency": "usd", "orderId": "...", "customerDetails": { "email": "user@example.com" } }` |
| `POST` | `/payments/:gateway/init` | demo gateway payment শুরু করা | `{ "orderId": "...", "amount": 100 }` |

`gateway` হিসেবে `sslcommerz`, `bkash`, অথবা `nagad` ব্যবহার করা যাবে।

## Admin-only endpoints

Admin token (`role: "admin"`) লাগবে। ছবি upload-এর endpoint-গুলোতে JSON নয়, `multipart/form-data` পাঠাতে হবে এবং file field-এর নাম হবে `image`।

| Method | Path | ব্যবহার |
| --- | --- | --- |
| `POST` | `/products` | product তৈরি |
| `POST` | `/categories` | category তৈরি |
| `POST` | `/blogs` | blog তৈরি |

### Request body examples

```json
// POST /auth/register
{
  "name": "Rahim",
  "email": "rahim@example.com",
  "password": "secret123",
  "phone": "01700000000",
  "address": "Dhaka"
}
```

```json
// POST /orders/create
{
  "customerDetails": {
    "fullName": "Rahim",
    "email": "rahim@example.com",
    "phone": "01700000000",
    "address": "Dhaka"
  },
  "items": [
    { "product": "PRODUCT_ID", "title": "Product name", "quantity": 2, "price": 120 }
  ],
  "totalAmount": 240
}
```

## Frontend notes

- Image path API response-এ `/uploads/...` হলে full URL বানান: `http://localhost:5000${image}`।
- Protected request-এ `Authorization: Bearer <token>` অবশ্যই পাঠাবেন।
- Frontend origin আলাদা হলে backend-এর `.env`-এ সেটি যোগ করুন: `CLIENT_URL=http://localhost:3000,http://localhost:5173`।
