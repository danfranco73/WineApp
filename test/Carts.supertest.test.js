import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

const testProduct = {
  _id: {
    $oid: "6668d7bae8cd4fea1855dffb",
  },
  description: "Alma Mora",
  code: "4521155",
  price: 1800,
  status: true,
  category: "Vinos",
  thumbnails: [],
  owner: "admin",
};

describe("Carts API", () => {
  let cookie;
  let token;
  let cartId;
  let productId;

  // Login a user and get a token before each test
  beforeEach(async () => {
    const loginRes = await requester
      .post("/api/sessions/login")
      .send({ email: "marce@mail.com", password: "1234" });
    cookie = loginRes.headers["set-cookie"][0]; // Extract the cookie
    token = loginRes.body.token; // Extract the token

    // Create a test product
    const productRes = await requester
      .post("/api/products")
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`)
      .send(testProduct);
    productId = productRes.body._id;
  });

  it("should create a new cart", async () => {
    const res = await requester
      .post("/api/carts")
      .set("Cookie", cookie)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
  });

  it("should add a product to an existing cart", async () => {
    const res = await requester.put(
      `/api/carts/${cartId}/product/${productId}/quantity/1`
    );
    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
  });

  //   it("should get a cart by ID", async () => {
  //     const res = await requester
  //       .get(`/api/carts/${cartId}`)
  //       .set("Cookie", cookie)
  //       .set("Authorization", `Bearer ${token}`);
  //     expect(res.status).to.equal(200);
  //     expect(res.body.status).to.equal("success");
  //     expect(res.body.payload).to.have.property("_id");
  //     expect(res.body.payload._id).to.equal(cartId);
  //   });

  //   it("should purchase a cart", async () => {
  //     const res = await requester
  //       .patch(`/api/carts/${cartId}/purchase`)
  //       .set("Cookie", cookie)
  //       .set("Authorization", `Bearer ${token}`);
  //     expect(res.status).to.equal(200);
  //     expect(res.body.status).to.equal("success");
  //     expect(res.body.payload).to.have.property("purchased");
  //     expect(res.body.payload.purchased).to.be.true;
  //   });

  //   it("should delete a cart", async () => {
  //     const res = await requester
  //       .delete(`/api/carts/${cartId}`)
  //       .set("Cookie", cookie)
  //       .set("Authorization", `Bearer ${token}`);
  //     expect(res.status).to.equal(200);
  //     expect(res.body.status).to.equal("success");
  //     expect(res.body.message).to.equal("Cart deleted");
  //   });

  //   it("should delete a product from a cart", async () => {
  //     const res = await requester
  //       .delete(`/api/carts/${cartId}/product/${productId}`)
  //       .set("Cookie", cookie)
  //       .set("Authorization", `Bearer ${token}`);
  //     expect(res.status).to.equal(200);
  //     expect(res.body.status).to.equal("success");
  //     expect(res.body.payload.products).to.be.an("array");
  //     expect(res.body.payload.products).to.have.lengthOf(0);
  //   });

  //   it("should clear a cart", async () => {
  //     const res = await requester
  //       .delete(`/api/carts/${cartId}/clear`)
  //       .set("Cookie", cookie)
  //       .set("Authorization", `Bearer ${token}`);
  //     expect(res.status).to.equal(200);
  //     expect(res.body.status).to.equal("success");
  //     expect(res.body.payload.products).to.be.an("array");
  //     expect(res.body.payload.products).to.have.lengthOf(0);
  //   });
});
