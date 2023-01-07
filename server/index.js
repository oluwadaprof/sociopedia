import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient, ServerApiVersion } from "mongodb";
// import authRoutes from './routes/auth'
import { register } from "./controllers/auth.js";
// import postRoutes from './routes/posts'
// import {createPost} from './controllers/posts'
// import { verifyToken } from "./middleware/auth";


// CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });


//ROUTES WITH FILE
app.post("/auth/register", upload.single("picture"), register);
app.post('./posts', verifyToken, upload.single("picture"), createPost)

//ROUTES
app.use('./auth', authRoutes);
app.use('/users', UserRoutes)
app.use('/posts', postRoutes)

//MONGOOSE SETUP
const PORT = process.env.PORT || 6001;

const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect(() => {
  const collection = client.db("test").collection("devices");
  app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  // console.log(`Error Message: ${err}`);
  // perform actions on the collection object
  client.close();
})
