import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// 1. Import Admin Modules
import { adminTypeDefs } from "./admin/typeDefs";
import { adminResolvers } from "./admin/resolvers";

// 2. Import User Modules
import { userTypeDefs } from "./user/typeDefs";
import { userResolvers } from "./user/resolvers";

// 3. Import University Modules
import { universityTypeDefs } from "./university/typeDefs";
import { universityResolvers } from "./university/resolvers";

// 4. Import Job Modules
import { jobTypeDefs } from "./job/typeDefs";
import { jobResolvers } from "./job/resolvers";

// 5. Import Contact Modules
import { contactTypeDefs } from "./contact/typeDefs";
import { contactResolvers } from "./contact/resolvers";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8483;

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/veda-scholars";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });

// 6. Merge ALL TypeDefs and Resolvers here
const server = new ApolloServer({
  typeDefs: [adminTypeDefs, userTypeDefs, universityTypeDefs, jobTypeDefs, contactTypeDefs],
  resolvers: [adminResolvers, userResolvers, universityResolvers, jobResolvers, contactResolvers],
});

async function startServer() {
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  );

  app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error("❌ Error starting server:", error);
});