import express from "express";
import { engine } from "express-handlebars";
import * as path from "path";
import { fileURLToPath } from "url";
import { client } from "./db/client.js";
import { initDefaultUser } from "./db/users.js";
import {
  listAllFolders,
  indexFolder,
  getFolderByName,
  deleteFolder,
  updateFolder,
  getFolderById,
} from "./db/folders.js";
import { PORT, AUTH_PIN } from "./config/env.js";
import { UUID } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const API_V1 = "/api/v1";
let defalutUser = null;

app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    partialsDir: path.join(__dirname, "views", "partials"),
    layoutsDir: path.join(__dirname, "views", "layouts"),
    defaultLayout: "main",
  })
);

app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1", (req, res, next) => {
  const { pin } = req.body;
  if (!pin || pin !== AUTH_PIN) {
    return res.status(403).json({ error: "Invalid authentication pin." });
  }
  next();
});

app.get("/", async (req, res) => {
  let data = await listAllFolders();
  const query = req.query.q;
  if (query && query === "create-folder") {
    res.render("index", {
      data: data,
      title: true,
      createFolder: true,
    });
  } else if (query && query === "delete-folder") {
    res.render("index", {
      data: data,
      title: true,
      deleteFolder: true,
    });
  } else {
    res.render("index", {
      data: data,
      title: true,
    });
  }
});

app.get("/links", async (req, res) => {
  const query = req.query.q;
  let id = req.query.id;
  let data = await getFolderById(id);
  if (query && query === "add-link") {
    res.render("index", {
      data: data,
      title: false,
      addLink: true,
    });
  } else if (query && query === "delete-link") {
    res.render("index", {
      data: data,
      title: false,
      deleteLink: true,
    });
  } else {
    res.render("index", {
      data: data,
      title: false,
    });
  }
});

app.delete(API_V1 + "/folder/remove-link", async (req, res) => {
  const { folderID, linkID } = req.body;
  if (!folderID || !linkID) {
    return res
      .status(400)
      .json({ error: "Folder ID and link ID are required." });
  }

  try {
    const folder = await getFolderById(folderID);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found." });
    }

    const linkIndex = folder.links.findIndex((link) => link.id === linkID);
    if (linkIndex === -1) {
      return res.status(404).json({ error: "Link not found." });
    }

    folder.links.splice(linkIndex, 1);
    await updateFolder(folderID, folder);
    res.status(204).json({ message: "Link removed successfully." });
  } catch (error) {
    console.error("Error removing link:", error);
    res.status(500).json({ error: "Failed to remove link." });
  }
});

app.post(API_V1 + "/folder/add-link", async (req, res) => {
  const { folderID, link } = req.body;
  if (!folderID || !link) {
    return res.status(400).json({ error: "Folder ID and link are required." });
  }

  try {
    const folder = await getFolderById(folderID);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found." });
    }

    folder.links.push({
      id: new UUID().toString(),
      title: link,
      url: link,
      addedAt: new Date(),
      votes: 0,
      pinned: false,
    });
    await updateFolder(folderID, folder);
    res.status(200).json({ message: "Link added successfully." });
  } catch (error) {
    console.error("Error adding link:", error);
    res.status(500).json({ error: "Failed to add link." });
  }
});

app.post(API_V1 + "/folder", async (req, res) => {
  const { folderName } = req.body;
  if (!folderName) {
    return res.status(400).json({ error: "Folder name is required." });
  }

  try {
    const existingFolder = await getFolderByName(folderName);
    if (existingFolder) {
      return res.status(409).json({ error: "Folder already exists." });
    }

    const folder = {
      name: folderName,
      createdAt: new Date(),
      createdBy: defalutUser._id.toString(),
      pinned: false,
      vote: 0,
      links: [],
    };
    const result = await indexFolder(folder);
    res
      .status(201)
      .json({ message: "Folder created successfully.", folder: result });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ error: "Failed to create folder." });
  }
});

app.delete(API_V1 + "/folder", async (req, res) => {
  const { folderID } = req.body;
  if (!folderID) {
    return res.status(400).json({ error: "Folder id is required." });
  }

  try {
    const result = await deleteFolder(folderID);
    res
      .status(204)
      .json({ message: "Folder deleted successfully.", folder: result });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ error: "Failed to delete folder." });
  }
});

try {
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  defalutUser = await initDefaultUser();
} catch (e) {
  console.error("Error connecting to MongoDB:");
  console.error(e);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
