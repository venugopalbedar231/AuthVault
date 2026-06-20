import { Router } from "express";  
import * as authController from "../controllers/auth.controller.js"

const authRouter = Router();

// POST api/auth/register
authRouter.post("/register", authController.register)

// POST api/auth/login
authRouter.post("/login", authController.login)

// GET api/auth/get-me
authRouter.get("/get-me", authController.getMe);

// GET api/auth/refresh-token
authRouter.get("/refresh-token", authController.refreshToken)

// GET api/auth/logout
authRouter.get("/logout", authController.logout)

// GET api/auth/logout-all
authRouter.get("/logout-all", authController.logoutAll)


// POST api/auth/create-note
authRouter.post("/create-note", authController.createNote)

// get api/auth/get-notes
authRouter.get("/get-notes", authController.getNotes)
// post api/auth/get-notes
authRouter.post("/update-note/:id", authController.updateNote)
// get api/auth/get-notes
authRouter.get("/delete-note/:id", authController.deleteNote)

export default authRouter;
