import { expect } from "chai";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import config from "../src/config/config.js";

dotenv.config();

const requester = supertest("http://localhost:8080");

const testProduct = {
  title: "Test Product",
  description: "This is a test product",
  code: "TEST123",
  price: 10.99,
  stock: 100,
  thumbnails: "https://example.com/image.jpg",
  category: "Electronics",
};

describe("Products API", () => {
  let cookie;
  let token;

  beforeEach(async () => {
    // Login a user and get a token (replace with your actual login logic)
    const loginRes = await requester
      .post("/api/sessions/login")
      .send({ email: "your_test_email", password: "your_test_password" });
    cookie = loginRes.headers["set-cookie"][0];
    token = loginRes.body.token;
  });

  it("should create a new product", async () => {
    const res = await requester
      .post("/api/products")
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`)
      .send(testProduct);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("title", testProduct.title);
    expect(res.body).to.have.property("description", testProduct.description);
    expect(res.body).to.have.property("code", testProduct.code);
    expect(res.body).to.have.property("price", testProduct.price);
    expect(res.body).to.have.property("stock", testProduct.stock);
    expect(res.body).to.have.property("thumbnails", testProduct.thumbnails);
    expect(res.body).to.have.property("category", testProduct.category);
  });

  it("should get all products", async () => {
    const res = await requester
      .get("/api/products")
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array"); // Assuming your API returns an array of products
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
    expect(res.body.payload).to.have.property("title", testProduct.title);
  });

  it("should update a product", async () => {
    const createRes = await requester
      .post("/api/products")
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`)
      .send(testProduct);
    const productId = createRes.body._id;

    const updatedProduct = { ...testProduct, title: "Updated Test Product" };

    const res = await requester
      .put(`/api/products/${productId}`)
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedProduct);
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.have.property("title", updatedProduct.title);
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
    expect(res.status).to.equal(200);
  });
});


