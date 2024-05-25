import express from "express"
import {
  createNewAccessCode,
  validateAccessCode,
  generatePostCaptions,
  getPostIdeas,
  createCaptionsFromIdeas,
  saveGeneratedContent,
  getUserGeneratedContents,
  unsaveContent,
} from "./services"
const router = express.Router()

router.post("/create-new-access-code", createNewAccessCode)
router.post("/validate-access-code", validateAccessCode)
router.post("/generate-post-captions", generatePostCaptions)
router.post("/get-post-ideas", getPostIdeas)
router.post("/create-captions-from-ideas", createCaptionsFromIdeas)
router.post("/save-generated-content", saveGeneratedContent)
router.get("/get-user-generated-contents/:phoneNumber", getUserGeneratedContents)
router.post("/unsave-content", unsaveContent)

export default router
