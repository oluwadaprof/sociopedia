import { express } from "express";
import { login } from "../controllers/auth"


const router = express.Router();

router.post("/login", logins)

export default router;