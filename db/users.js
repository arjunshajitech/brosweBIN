import { client, dbName, collectionUsers } from "./client.js";

export const initDefaultUser = async () => {
    try {
      const existingAdmin = await client
        .db(dbName)
        .collection(collectionUsers)
        .findOne({ role: "admin" });
  
      if (existingAdmin) {
        console.log("Default admin user already exists.");
        return existingAdmin;
      }
  
      const result = await client
        .db(dbName)
        .collection(collectionUsers)
        .insertOne({
          name: "admin admin",
          role: "admin",
        });
  
      console.log("Default admin user created.");
      return result;
    } catch (error) {
      console.error("Error initializing default user:", error);
      return null;
    }
  };
  
