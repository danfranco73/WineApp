import UserService from "../services/userServices.js";
import CartService from "../services/cartServices.js";
import ticketService from "../services/ticketServices.js";

// accesories for calls
const paginationLinks = (page, totalPages) => {
  let links = [];
  if (page > 1) {
    links.push({ page: page - 1, text: "Previous" });
  }
  if (page < totalPages) {
    links.push({ page: page + 1, text: "Next" });
  }
  return links;
};



// controller for the views
export const getWelcome = async (req, res) => {
  renderWithLayout(res, "welcome", {
    title: "WineAPP",
    status: "success",
  });
};

export const getLogin = async (req, res) => {
  renderWithLayout(res, "login", {
    title: "Login",
    failLogin: req.session.failLogin ?? false,
    resgisterSuccess: req.session.resgisterSuccess ?? false,
  });
};

export const getRegister = async (req, res) => {
  renderWithLayout(res, "register", {
    title: "Register",
    failRegister: req.session.failRegister ?? false,
  });
};

export const getProfile = async (req, res) => {
  renderWithLayout(res, "userProfile", {
    title: "Profile",
    user: req.session.user,
  });
};

export const getRestore = async (req, res) => {
  renderWithLayout(res, "restore", {
    title: "Restore Password",
    failRestore: req.session.failRestore ?? false,
  });
};

export const getHome = async (req, res) => {
  try {
    res.status.redirect("/home");
  } catch (e) {
    renderError(res);
  }
};

export const getRealTimeProducts = async (req, res) => {
  try {

    renderWithLayout("realTimeProducts", {
      title: "Premium View",
      products: productsData,
      user: req.session.user,
      productRender
    });
  } catch (e) {
    renderError(res);
  }
};

export const getIndex = async (req, res) => {
  try {
    res.render("index", {
      title: "Product List",
      status: "success",
      products: productsData,
      user: req.user,
      productRender
    });
  } catch (e) {
    renderError(res);
  }
};

const totalAmount = (cart) => {
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

const totalQuantity = (cart) => {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};


export const productRender = async (req, res) => {
  try {
    const productsData = await getProducts(); // Await the promise
    const totalA = req.user ? totalAmount(req.user.cart) : 0;
    const totalQ = req.user ? totalQuantity(req.user.cart) : 0;
    res.render("home", {
      title: "Product List",
      status: "success",
      products: productsData,
      user: req.user,
      totalA,
      totalQ,
    });
  } catch (e) {
    console.log(e);
    renderError(res);
  }
};


export const getChat = async (req, res) => {
  try {
    const messages = await chatManager.getMessages();
    renderWithLayout(res, "chat", {
      title: "Chat",
      messages,
    });
  } catch (e) {
    renderError(res);
  }
};

export const getCart = async (req, res) => {
  try {
    const cartService = new CartService();
    const cart = await cartService.getCarts(req.session.user);
    renderWithLayout(res, "cart", {
      title: "Cart",
      cart,
    });
  } catch (e) {
    renderError(res);
  }
};

export const getTicket = async (req, res) => {
  try {
    const ticket = await ticketService.getTickets();
    renderWithLayout(res, "ticket", {
      title: "Ticket",
      ticket,
    });
  } catch (e) {
    renderError(res);
  }
};

export const getAMC = async (req, res) => {
  renderWithLayout(res, "askMailforChange", {
    title: "Ask Mail for Change",
  });
};

export const getUpDoc = async (req, res) => {
  const uid = req.params.uid;
  renderWithLayout(res, "uploadDocuments", {
    title: "Upload Documents",
    uid: req.params.uid,
  });
};

export const getSwitchRole = async (req, res) => {
  renderWithLayout(res, "switchRole", {
    title: "Switch Role",
    uid: req.params.uid,
  });
};
