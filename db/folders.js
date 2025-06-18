import { client, dbName, collectionFolders } from "./client.js";
import { ObjectId } from "mongodb";

export async function listAllFolders() {
  try {
    const db = client.db(dbName);
    const folders = await db.collection(collectionFolders).find().toArray();
    return folders;
  } catch (error) {
    console.error("Error fetching folders:", error);
    throw error;
  }
}

export async function getFolderById(id) {
  try {
    const db = client.db(dbName);
    const folder = await db
      .collection(collectionFolders)
      .findOne({ _id: ObjectId.createFromHexString(id) });
    return folder;
  } catch (error) {
    console.error("Error fetching folder by ID:", error);
    throw error;
  }
}

export async function getFolderByName(name) {
  try {
    const db = client.db(dbName);
    const folder = await db
      .collection(collectionFolders)
      .findOne({ name: name });
    return folder;
  } catch (error) {
    console.error("Error fetching folder by name:", error);
    throw error;
  }
}

export async function updateFolder(folderId, updateData) {
  try {
    const db = client.db(dbName);
    const result = await db
      .collection(collectionFolders)
      .updateOne(
        { _id: ObjectId.createFromHexString(folderId) },
        { $set: updateData }
      );
    return result;
  } catch (error) {
    console.error("Error updating folder:", error);
    throw error;
  }
}

export async function indexFolder(folder) {
  try {
    const db = client.db(dbName);
    const result = await db.collection(collectionFolders).insertOne(folder);
    return result;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
}

export async function deleteFolder(folderId) {
  try {
    const db = client.db(dbName);
    const result = await db
      .collection(collectionFolders)
      .deleteOne({ _id: ObjectId.createFromHexString(folderId) });
    return result;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
}
