import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "@keystone-6/core";
import express from "express";
import path from "node:path";
import { statelessSessions } from "@keystone-6/core/session";
import "dotenv/config";

import { lists } from "./schema";
import { withAuth } from "./auth";

const session = statelessSessions({
  secret: process.env.SESSION_SECRET || "There should be a secret here!",

  maxAge: 60 * 60 * 8,

  secure: process.env.NODE_ENV === "production",
});

export default withAuth(
  config({
    server: {
      extendExpressApp: (app) => {
        app.use(
          "/images",
          express.static(path.resolve(process.cwd(), "public/images")),
        );
      },

      port: 5000,

      cors: {
        origin: process.env.FRONTEND_URL?.split(",") || [
          "http://localhost:3000",
        ],

        credentials: true,
      },
    },

    db: {
      provider: "postgresql",

      prismaClientOptions: () => {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL as string,
        });

        const adapter = new PrismaPg(pool);

        return {
          adapter,
        };
      },
    },

    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },

    lists,

    session,
  }),
);
