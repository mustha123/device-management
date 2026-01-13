const cartModel = require("../Model/cartmodel");
const jwt=require('jsonwebtoken')
const SECRET_KEY='mernstack'
// Add product to cart
const addToCart = async (req, res) => {
  try {
    console.log("Decoded user in req:", req.userId);
    const userId = req.userId.id;  // FIXED LINE

    const { productId, price } = req.body;

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        userId,
        items: [{ productId, quantity: 1, price }],
        totalPrice: price
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1, price });
      }

      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.quantity * item.price,
        0
      );
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Get cart items for logged-in user
const getCart = async (req, res) => {
    try {
         console.log("Req User while getting cart:", req.userId); // Debug here 👈

    const userId = req.userId.id;
        const cart = await cartModel.findOne({ userId }).populate("items.productId");
        res.status(200).json({ message: "Cart data fetched", cart });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update item quantity
const updateCart = async (req, res) => {
    try {
        const userId = req.userId.id;
        const { productId, quantity } = req.body;

        const cart = await cartModel.findOne({ userId });
        const index = cart.items.findIndex(item =>
            item.productId.toString() === productId
        );

        if (index > -1) {
            cart.items[index].quantity = quantity;

            if (quantity == 0) {
                cart.items.splice(index, 1);
            }
        }

        cart.totalPrice = cart.items.reduce((total, item) =>
            total + item.quantity * item.price, 0);

        await cart.save();
        res.status(200).json({ message: "Cart Updated", cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Remove product from cart
const deleteFromCart = async (req, res) => {
    try {
        const userId = req.userId.id;
        const { productId } = req.params;

        const cart = await cartModel.findOne({ userId });
        cart.items = cart.items.filter(item =>
            item.productId.toString() !== productId
        );

        cart.totalPrice = cart.items.reduce((total, item) =>
            total + item.quantity * item.price, 0);

        await cart.save();
        res.status(200).json({ message: "Product removed", cart });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { addToCart, getCart, updateCart, deleteFromCart };
