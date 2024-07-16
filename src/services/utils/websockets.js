import ProductManagerDB from "../../dao/managers/ProductsManagerDB.js";
import ChatManager from "../../dao/managers/chatManager.js";



const productManager = new ProductManagerDB();
const chatManager = new ChatManager();
const messages = [];

// WebSocket
const WebSocket = (serverIO) => {
  // escucho las conexiones entrantes
  serverIO.on("connection", (socket) => {
    // Products List
    socket.on("getProducts", () => {
      const products = productManager.getProducts(products)
      serverIO.emit("productList", products);
    });
    // Connect
    console.log("Client connected");
    // Disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
    // new Product
    socket.on("newProduct", (data) => {
      productManager.addProduct(data);
      serverIO.emit("sendProducts", data);
    });
    // delete Product
    socket.on("deleteProduct", (data) => {
      productManager.deleteProduct(data);
      serverIO.emit("sendProducts", data);
    });
    // Chat
    //Mensaje en tiempo real [Parte 1 del ejercicio]
    socket.on("message", data => {
      serverIO.emit("messageShow", data) //Emito para todos los usuarios lo que se esta escribiendo
    });

    //Mensajes de chat [Parte 2 del ejercicio]
    socket.on("chatMessage", data => {
      chatManager.addMessage(data);
      messages.push({
        socketId: socket.id,
        message: data
      });

      socketServer.emit("allMessages", messages);
    });
  });
};

export default WebSocket;

