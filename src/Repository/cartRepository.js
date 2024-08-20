import cartModel from "../dao/models/cartModel.js";
import productModel from "../dao/models/productModel.js";
import CartDTO from "../dao/dto/cartDTO.js";

export default class CartRepository {
  async getAllCarts() {
    try {
      return await cartModel.find().lean();
    } catch (error) {
      throw new Error("Error al obtener los carritos");
    }
  }

  async getCartById(cid) {
    try {
      const cart = await cartModel
        .findById(cid)
        .populate({
          path: "products._id",
          model: productModel,
        })
        .lean();       
      return cart;
    } catch (error) {
      if (error.name === "CastError") {
        throw new Error(`Invalid cart ID: ${cid}`);
      } else {
        throw new Error(`Error getting cart: ${error.message}`);
      }
    }
  }

  async createCart(uid) {
    try {
      const newCart = new cartModel();
      newCart.user = uid;
      return await newCart.save();
    } catch (error) {
      throw new Error("Error al crear el carrito");
    }
  }

  async addProductByID(cid, pid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const existingProductIndex = cart.products.findIndex(
        (product) => product._id.toString() === pid
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity++;
      } else {
        cart.products.push({ _id: pid, quantity: 1 });
      }
      await cart.save();
      return new CartDTO(cart);
    } catch (error) {
      throw new Error("Error al añadir un producto al carrito");
    }
  }

  async reduceStock(pid, quantity) {
    try {
      const product = await productModel.findById(pid);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      product.stock -= quantity;
      await product.save();
    } catch (error) {
      throw new Error("Error al reducir el stock del producto");
    }
  }

  async deleteProductInCart(cid, pid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      const product = await productModel.findOne({ _id: pid });
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      const filter = cart.products.filter(
        (item) => item._id.toString() !== product._id.toString()
      );
      cart.products = filter;
      await cart.save();
      return new CartDTO(cart);
    } catch (error) {
      throw new Error("Error al eliminar un producto del carrito");
    }
  }

  async updateCart(cid, products) {
    try {
      const cart = await cartModel
        .findOneAndUpdate({ _id: cid }, { products }, { new: true })
        .populate("products._id");
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return new CartDTO(cart);
    } catch (error) {
      throw new Error("Error al actualizar el carrito");
    }
  }

  async getProductsFromCartById(cid) {
    try {
      const cart = await cartModel
        .findById(cid)
        .populate("products._id")
        .lean();
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return new CartDTO(cart);
    } catch (error) {
      throw new Error("Error al obtener los productos del carrito");
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      const cart = await cartModel.findOneAndUpdate(
        { _id: cid, "products._id": pid },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      );
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      return new CartDTO(cart);
    } catch (error) {
      throw new Error(
        "Error al actualizar la cantidad de un producto en el carrito"
      );
    }
  }

  async insertArray(cid, products) {
    try {
      const arr = [];
      for (const item of products) {
        const object = await productModel.findById(item._id);
        arr.push({
          _id: object._id,
          quantity: item.quantity,
        });
      }
      const filter = { _id: cid };
      const update = { $set: { products: arr } };
      const updateCart = await cartModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      return updateCart;
    } catch (error) {
      throw new Error("Error al insertar un array de productos en el carrito");
    }
  }

  async clearCart(cid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      cart.products = [];
      await cart.save();

      return new CartDTO(cart);
    } catch (error) {
      throw new Error("Error al limpiar el carrito");
    }
  }

  async amountEachProductInCart(cid) {
    try {
      const cart = await cartModel.findOne({ _id: cid }).lean();
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      let totalAmount = 0;
      for (const product of cart.products) {
        const productData = await productModel
          .findOne({ _id: product._id })
          .lean();
        totalAmount += productData.price * product.quantity;
      }

      return totalAmount;
    } catch (error) {
      throw new Error(
        "Error al obtener la cantidad total de productos en el carrito"
      );
    }
  }

  async getTotalQuantityInCart(cid) {
    try {
      const cart = await cartModel.findOne({ _id: cid }).lean();
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      let totalQuantity = 0;
      for (const product of cart.products) {
        totalQuantity += product.quantity;
      }

      return totalQuantity;
    } catch (error) {
      throw new Error(
        "Error al obtener la cantidad total de productos en el carrito"
      );
    }
  }
}
