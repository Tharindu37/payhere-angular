const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const port = 3000;
const merchantId = ""; // Replace with your Merchant ID
const merchantSecret = "";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Generate the hash value
app.post("/hash", (req, res) => {
  console.log(req.body);
  const orderId = req.body.orderId;
  const amount = req.body.amount;
  const currency = req.body.currency;

  hash = generateHash(merchantId, orderId, amount, currency, merchantSecret);
  console.log(hash);
  res.json({ hash });
});

function generateHash(merchantId, orderId, amount, currency, merchantSecret) {
  // Format the amount to 2 decimal places
  const formattedAmount = parseFloat(amount).toFixed(2);
  console.log(formattedAmount);
  // Create the hash string
  const hash = crypto
    .createHash("md5")
    .update(
      merchantId +
        orderId +
        formattedAmount +
        currency +
        crypto
          .createHash("md5")
          .update(merchantSecret)
          .digest("hex")
          .toUpperCase()
    )
    .digest("hex")
    .toUpperCase();
  return hash;
}

// Payment notification endpoint
app.post("/notify", (req, res) => {
  console.log("Payment notification received");

  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = req.body;

  const local_md5sig = crypto
    .createHash("md5")
    .update(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        crypto
          .createHash("md5")
          .update(merchant_secret)
          .digest("hex")
          .toUpperCase()
    )
    .digest("hex")
    .toUpperCase();

  console.log("Payment notification for order:", order_id);

  if (local_md5sig === md5sig && status_code == "2") {
    // Payment success - update the database
    console.log("Payment successful for order:", order_id);
    res.sendStatus(200);
  } else {
    // Payment verification failed
    console.log("Payment verification failed for order:", order_id);
    res.sendStatus(400);
  }
});

app.listen(port, () => {
  return console.log(`Express is listening at port ${port}`);
});
