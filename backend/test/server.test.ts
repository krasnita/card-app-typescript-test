import server from "../src/server";
import Prisma from "../src/db";
import request from "supertest";

describe("Server API Tests", () => {
  beforeAll(async () => {
    await server.ready(); //Ensure Fastify is initialized before tests
  });
  afterAll(async () => {
    await server.close(); //Close Fastify after all tests
    await Prisma.$disconnect(); //Prevents database connection leaks
  });



  beforeEach(async () => {
    await Prisma.entry.deleteMany(); // Clears database before each test to maintain a clean state
  });

  // Basic sanity check to confirm Jest is working
  it("should assert 1 + 1 is 2", () => {
    expect(1 + 1).toEqual(2);
  });

  // Ensures an empty database returns an empty list
  it("should return an empty list initially", async () => {
    const response = await request(server.server).get("/get/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
  // Tests creating a new entry and checks if it is correctly stored
  it("should create a new entry", async () => {
    const newEntry = {
      title: "Test Entry",
      description: "This is a test",
      created_at: new Date().toISOString()
    };

    const response = await request(server.server).post("/create/").send(newEntry);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(newEntry.title);
  });
  // Tests API response for an invalid entry (empty request body)
  it("should return an error for invalid entry", async () => {
    const response = await request(server.server).post("/create/").send({});
    expect(response.status).toBe(500);
  });
  // Tests deleting an entry and verifies it no longer exists
  it("should delete an entry", async () => {
    const newEntry = {
      title: "Delete Test",
      description: "This should be deleted",
      created_at: new Date().toISOString()
    };

    const createResponse = await request(server.server).post("/create/").send(newEntry);
    const entryId = createResponse.body.id;
    const deleteResponse = await request(server.server).delete(`/delete/${entryId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.msg).toBe("Deleted successfully");
    const getResponse = await request(server.server).get(`/get/${entryId}`);
    expect(getResponse.status).toBe(500);
  });

  // Optimized test using Fastify's inject() for faster execution (skips network layer)
  it("should return an empty list using inject()", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/get/"
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });
  // Using describe.each() to dynamically test multiple input cases
  describe.each([
    [{ title: "Task 1", description: "Test Task 1" }],
    [{ title: "Task 2", description: "Test Task 2" }],
    [{ title: "Task 3", description: "Test Task 3" }]
  ])("Creating entries", (entryData) => {
    it(`should create an entry: ${entryData.title}`, async () => {
      const response = await request(server.server).post("/create/").send(entryData);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
    });
  });
});