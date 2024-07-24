import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

const testUser1 = {
  first_name: "Dan",
  last_name: "Fran",
  email: "dan@mail.com",
  password: "1234",
};

const testProduct = {
  description: "Alma Mora",
  code: "4521155",
  price: 1800,
  stock: 10,
  category: "Vinos",
  owner: "admin",
};

describe("Carts API", () => {
  let cookie;
  let token;
  let cartId;
  let productId;

  // Login before each test
  beforeEach(async () => {
    const loginRes = await requester
      .post("/api/sessions/login")
      .send(testUser1);
    cookie = loginRes.headers["set-cookie"][0];
    token = loginRes.body.token;
  });

  // Create a test product before each test
  beforeEach(async () => {
    const productRes = await requester
      .post("/api/products")
      .send(testProduct)
      .set("jwt", cookie)
      .set("Authorization", `Bearer ${token}`);
    productId = productRes.body._id;
  });

  // Create a test cart before each test
  beforeEach(async () => {
    const cartRes = await requester
      .post("/api/carts")
      .set("jwt", cookie)
      .set("Authorization", `Bearer ${token}`);
    cartId = cartRes.body._id;
  });

  it("should get all carts", async () => {
    const res = await requester
      .get("/api/carts")
      .set("jwt", cookie)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.payload).to.be.an("array");
  });

  it("should delete a cart", async () => {
    const res = await requester
      .delete(`/api/carts/${cartId}`)
      .set("jwt", cookie)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal("Cart deleted");
  });

  // Clean up after each test
  afterEach(async () => {
    await requester
      .delete(`/api/carts/${cartId}`)
      .set("jwt", cookie)
      .set("Authorization", `Bearer ${token}`);
    await requester
      .delete(`/api/products/${productId}`)
      .set("jwt", cookie)
      .set("Authorization", `Bearer ${token}`);
  });
});
