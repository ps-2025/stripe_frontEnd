import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

export default function ProductForm() {
  const [data, setData] = useState({
    currency: "usd",
    price: null,
    name: "",
    description: "",
    quantity: null,
    subscription: false,
  });

  const handlePayment = async () => {
    try {
      const stripe = await loadStripe(
        "pk_test_51QeAdP2cs0SOjcekjYuypUs3KRcjJOu3Bl9QYZMYNJSI2pRwjuZ8ei3yaSXLmo0Q9RfjWK6iVG6u2qMUzLM8BrE000lwNEhXjJ"
      );
      const body = {
        products: data,
      };
      const headers = {
        "Content-Type": "application/json",
      };
      const response = await fetch(
        "http://localhost:8001/api/payments/create-checkout-session",
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        }
      );

      const session = await response.json();
      const result = stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubscriptionChange = () => {
    setData({ ...data, subscription: !data.subscription });
  };
  const { price, quantity, name, description, subscription } = data;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="product-box">
        <h1>Enter Product Details</h1>
        <label>Product Name</label>
        <input
          value={name}
          name="name"
          onChange={handleChange}
          type="text"
          placeholder="Enter Product Name"
        />
        <label>Product Description</label>
        <input
          value={description}
          name="description"
          onChange={handleChange}
          type="text"
          placeholder="Enter Product Description"
        />
        <label>Price</label>
        <input
          value={price}
          name="price"
          onChange={handleChange}
          type="number"
          placeholder="Enter amount"
        />
        <label>Quantity</label>
        <input
          value={quantity}
          name="quantity"
          onChange={handleChange}
          type="number"
          placeholder="Enter Quantity"
        />

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <input
            type="checkbox"
            checked={subscription}
            onChange={handleSubscriptionChange}
          />
          <label>Subscribe (Recurring Payment)</label>
        </div>

        <button
          type="button"
          onClick={() => {
            handlePayment();
          }}
        >
          Pay now
        </button>
      </div>
    </div>
  );
}
