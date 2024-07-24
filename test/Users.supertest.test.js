import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");
const testUser = {
  email: "dan@mail.com",
  password: "123456",
};
const testUser1 = {
  first_name: "Dan",
  last_name: "Fran",
  email: "dan@mail.com",
  password: "1234",
};
const testUser2 = {
  first_name: "Max",
  last_name: "Dan",
  age: 25,
  email: "maxdan29@mail.com", // change this email to a new one for testing
  password: "12345",
};
const testUser3 = {
  first_name: "Rox",
  last_name: "Dan",
  email: "roxdanfran4@mail.com",
  password: "123",
};
let cookie; // to store the cookie for the session

describe("Integration ", () => {
  describe("test user", function () {
    before(function () {});
    beforeEach(async function () {
      // Login the user first
      const loginRes = await requester
        .post("/api/sessions/login")
        .send(testUser1);
      cookie = loginRes.headers["set-cookie"][0]; // Store the cookie
    });
    after(function () {});
    afterEach(function () {});
    it("should register a user", async () => {
      const res = await requester
        .post("/api/sessions/register")
        .send(testUser2);
      expect(res.status).to.equal(302); // Check for redirect
      // check for the cookie
      const cookieData = res.headers["set-cookie"][0];
      cookie = {
        name: cookieData.split("=")[0],
        value: cookieData.split("=")[1],
      };
      expect(cookieData).to.be.ok;
      expect(cookie.name).to.be.ok; // Extract cookie name dynamically
      expect(cookie.value).to.be.ok;
    });
    it("should not register a user with a short password", async () => {
      const res = await requester
        .post("/api/sessions/register")
        .send(testUser3);
      expect(res.status).to.equal(400);
    });
    it("should login a user", async () => {
      const result = await requester
        .post("/api/sessions/login")
        .send(testUser1);
      const cookieData = result.headers["set-cookie"][0];
      cookie = {
        name: cookieData.split("=")[0],
        value: cookieData.split("=")[1],
      };
      expect(cookieData).to.be.ok;
      expect(cookie.name).to.be.ok; // Extract cookie name dynamically
      expect(cookie.value).to.be.ok;
    });
    it("should not login a user with invalid credentials", async () => {
      const res = await requester.post("/api/sessions/login").send(testUser3);
      expect(res.status).to.equal(302);
      expect(res.headers.location).to.equal("/login");
      expect(res.body).to.be.empty;
    });
    it("should logout a user", async () => {
      const res = await requester.get("/api/sessions/logout");
      expect(res.status).to.equal(302);
      expect(res.headers.location).to.equal("/login");
    });
  });
});
