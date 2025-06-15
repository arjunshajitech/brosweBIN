import { MongoClient, ServerApiVersion } from "mongodb";

import {
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_APP_NAME,
} from "../config/env.js";

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_APP_NAME}.2qbwmpn.mongodb.net/?retryWrites=true&w=majority&appName=${MONGODB_APP_NAME}`;
export const dbName = "browsebin";
export const collectionUsers = "users";
export const collectionFolders = "folders";
export const collectionLinks = "links";
export const collectionLogs = "logs";

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// export async function listDatabases() {
//   try {
//     let databasesList = await client.db().admin().listDatabases();
//     console.log("Databases:");
//     databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
//   } catch (error) {
//     console.error("Error listing databases:", error);
//   }
// }
