import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

const testProduct = {
  title: "Test de Productos",
  description: "Yerba de Prueba",
  Code: "12dd34",
  price: 1400,
  stock: 250,
  thumbnails: "https://example.com/image.jpg",
  category: "Almacen",
};

describe("Products API", () => {
  let cookie; // To store the cookie for the session
  let token; // To store the authentication token

  // Before each test, login a user and get a token
  beforeEach(async () => {
    const loginRes = await requester
      .post("/api/sessions/login")
      .send({ email: "dan@mail.com", password: "1234" });
    cookie = loginRes.headers["set-cookie"][0];
    token = loginRes.body.token; // Assuming your login endpoint returns a token
  });

  it("should create a new product", async () => {
    const res = await requester
      .post("/api/products")
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`) // Add Authorization header
      .send(testProduct);
    expect(res.status).to.equal(201);
    expect(res.body.title).to.equal(testProduct.title); // Use correct property
  });

  it("should get all products", async () => {
    const res = await requester
      .get("/api/products")
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.products).to.be.an("array"); // Assuming your API returns an object with a 'products' array
  });

  it("should get a specific product by ID", async () => {
    const createRes = await requester
      .post("/api/products")
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`)
      .send(testProduct);
    const productId = createRes.body._id;

    const res = await requester
      .get(`/api/products/${productId}`)
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal(testProduct.title);
  });

  it("should update a product", async () => {
    const createRes = await requester
      .post("/api/products")
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`)
      .send(testProduct);
    const productId = createRes.body.id;

    const updatedProduct = { ...testProduct, title: "Updated Product" };

    const res = await requester
      .put(`/api/products/${productId}`)
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedProduct);
    expect(res.status).to.equal(200);
    expect(res.body.title).to.equal(updatedProduct.title);
  });

  it("should delete a product", async () => {
    const createRes = await requester
      .post("/api/products")
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`)
      .send(testProduct);
    const productId = createRes.body._id;

    const res = await requester
      .delete(`/api/products/${productId}`)
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(204);
  });
});
