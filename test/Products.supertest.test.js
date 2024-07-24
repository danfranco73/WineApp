import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");


const testUser1 = {
  first_name: "Dan",
  last_name: "Fran",
  email: "dan@mail.com",
  password: "1234",
};


describe("Products API", () => {
  let token;
  // Product Tests
  beforeEach(async function () {
    // Login the user first
    const loginRes = await requester
      .post("/api/sessions/login")
      .send(testUser1);
  });

  
  it("should get all products", async () => {
    const res = await requester
      .get("/api/products")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).to.equal(200);
  });

});
