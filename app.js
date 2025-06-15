import express from "express";
import { engine } from "express-handlebars";
import * as path from "path";
import { title } from "process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

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

const data = [
  { id: 1, title: "OpenID Connect", userID: 1, createdAT: new Date() },
  {
    id: 2,
    title: "Optional: If you want to pass only part of the context",
    userID: 1,
    createdAT: new Date(),
  },
  {
    id: 3,
    title: "How to build web server from scratch",
    userID: 1,
    createdAT: new Date(),
  },
  { id: 4, title: "Introduction to OAuth2", userID: 1, createdAT: new Date() },
  {
    id: 5,
    title: "Understanding Docker and Containers",
    userID: 1,
    createdAT: new Date(),
  },
  {
    id: 6,
    title: "JavaScript Asynchronous Programming",
    userID: 1,
    createdAT: new Date(),
  },
  {
    id: 7,
    title: "Deploying Apps with Kubernetes",
    userID: 1,
    createdAT: new Date(),
  },
  { id: 8, title: "REST vs GraphQL", userID: 1, createdAT: new Date() },
  {
    id: 9,
    title: "Node.js Event Loop Explained",
    userID: 1,
    createdAT: new Date(),
  },
  {
    id: 10,
    title: "React vs Vue: A Practical Comparison",
    userID: 1,
    createdAT: new Date(),
  },
  {
    id: 11,
    title: "Mastering Git and GitHub",
    userID: 1,
    createdAT: new Date(),
  },
  {
    id: 12,
    title: "Microservices with Spring Boot",
    userID: 1,
    createdAT: new Date(),
  },
  { id: 13, title: "Understanding JWTs", userID: 1, createdAT: new Date() },
  {
    id: 14,
    title: "Building Scalable Web APIs",
    userID: 1,
    createdAT: new Date(),
  },
  {
    id: 15,
    title: "Authentication and Authorization",
    userID: 1,
    createdAT: new Date(),
  },
  { id: 16, title: "Intro to WebSockets", userID: 1, createdAT: new Date() },
  {
    id: 17,
    title: "Using Redis for Caching",
    userID: 1,
    createdAT: new Date(),
  },
  {
    id: 18,
    title: "CI/CD with GitHub Actions",
    userID: 1,
    createdAT: new Date(),
  },
  { id: 19, title: "Load Balancing Basics", userID: 1, createdAT: new Date() },
  {
    id: 20,
    title: "Writing Unit Tests in JavaScript",
    userID: 1,
    createdAT: new Date(),
  },
];

app.get("/", (req, res) => {
  const query = req.query.q;
  if (query && query === "create-folder") {
    res.render("index", {
      data: data,
      title: true,
      createFolder: true,
    });
  } else {
    res.render("index", {
      data: data,
      title: true,
    });
  }
});

app.get("/links", (req, res) => {
  const query = req.query.q;
  if (query && query === "add-link") {
    res.render("index", {
      data: data,
      title: false,
      addLink: true,
    });
  } else {
    res.render("index", {
      data: data,
      title: false,
    });
  }
});

console.log("Server is running on http://localhost:3000");
app.listen(3000);
