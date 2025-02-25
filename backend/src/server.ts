import fastify from "fastify";
import cors from "@fastify/cors";
import { Entry } from "@prisma/client";
import Prisma from "./db";


export const server = fastify();

server.register(cors, {});

// Route: Retrieve all entries from the database
server.get<{ Reply: Entry[] }>("/get/", async (req, reply) => {
  const dbAllEntries = await Prisma.entry.findMany({});
  reply.send(dbAllEntries);
});

// Route: Retrieve a single entry by ID
server.get<{ Body: Entry; Params: { id: string } }>("/get/:id", async (req, reply) => {
  const dbEntry = await Prisma.entry.findUnique({
    where: { id: req.params.id },
  });
  if (!dbEntry) {
    reply.status(500).send({ msg: `Error finding entry with id ${req.params.id}` });
  }
  reply.send(dbEntry);
});

// Route: Create a new entry
server.post<{ Body: Entry }>("/create/", async (req, reply) => {
  let newEntryBody = req.body;
  // Set created_at date; default to current date if not provided
  newEntryBody.created_at = newEntryBody.created_at ? new Date(req.body.created_at) : new Date();
  // Set scheduled_date if provided; otherwise, store as null
  newEntryBody.scheduled_date = req.body.scheduled_date ? new Date(req.body.scheduled_date) : null;

  try {
    const createdEntryData = await Prisma.entry.create({ data: newEntryBody });
    reply.send(createdEntryData);
  } catch {
    reply.status(500).send({ msg: "Error creating entry" });
  }
});

// Route: Delete an entry by ID
server.delete<{ Params: { id: string } }>("/delete/:id", async (req, reply) => {
  try {
    await Prisma.entry.delete({ where: { id: req.params.id } });
    reply.send({ msg: "Deleted successfully" });
  } catch {
    reply.status(500).send({ msg: "Error deleting entry" });
  }
});

// Route: Update an existing entry by ID
server.put<{ Params: { id: string }; Body: Entry }>("/update/:id", async (req, reply) => {
  let updatedEntryBody = req.body;
  updatedEntryBody.created_at = updatedEntryBody.created_at ? new Date(req.body.created_at) : new Date();
  updatedEntryBody.scheduled_date = req.body.scheduled_date ? new Date(req.body.scheduled_date) : null;

  try {
    await Prisma.entry.update({
      data: updatedEntryBody,
      where: { id: req.params.id },
    });
    reply.send({ msg: "Updated successfully" });
  } catch {
    reply.status(500).send({ msg: "Error updating" });
  }
});

export default server;
