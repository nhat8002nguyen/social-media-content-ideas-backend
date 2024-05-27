import { GoogleGenerativeAI } from "@google/generative-ai"
import { Request, Response } from "express"
import twilio from "twilio"
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message"
import db from "./firebase"
require("dotenv").config()

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })

const createNewAccessCode = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body
  const accessCode = Math.floor(100000 + Math.random() * 900000).toString()

  await db.collection("users").doc(phoneNumber).set({ accessCode, phoneNumber })

  client.messages
    .create({
      body: `Your access code is ${accessCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })
    .then((message: MessageInstance) => console.log(message.sid))
    .catch((error) => console.error(error))

  res.status(200).send({ message: "Sucessfully created an access code." })
}

const validateAccessCode = async (req: Request, res: Response) => {
  const { accessCode, phoneNumber } = req.body
  const doc = await db.collection("users").doc(phoneNumber).get()

  if (!doc.exists || doc.data()?.accessCode !== accessCode) {
    return res.status(400).send({ success: false, message: "Failed to verify access code." })
  }

  await db.collection("users").doc(phoneNumber).update({ accessCode: "" })

  res.status(200).send({ success: true, message: "Successfully verified access code" })
}

const generatePostCaptions = async (req: Request, res: Response) => {
  const { socialNetwork, subject, tone } = req.body
  // Use Gemini AI API
  try {
    const prompt = `Generate 5 social media captions for ${socialNetwork} about ${subject} with a ${tone} tone. Each caption includes some hashtags. Each caption is wrapped in ''' pairs.`
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()
    const captions = extractStrings(text)
      .filter((caption) => caption)
      .map((cap) => cap.trim())

    res.status(200).send(captions)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: "Error generating captions" })
  }
}

const getPostIdeas = async (req: Request, res: Response) => {
  const { topic } = req.body
  // Use Gemini AI API
  try {
    const prompt = `Generate 10 social post ideas about ${topic}. Each idea is wrapped in ''' pairs.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const postIdeas = extractStrings(text)
      .filter((idea: string) => idea)
      .map((idea: string) => idea.trim())

    res.status(200).send(postIdeas)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: "Error generating post ideas" })
  }
}

const createCaptionsFromIdeas = async (req: Request, res: Response) => {
  const { idea } = req.body
  // Use Gemini AI API
  try {
    const prompt = `Generate 5 captions for the post idea: ${idea}. Each caption includes some hashtags. Each caption is wrapped in ''' pairs. .`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const captions = extractStrings(text)
      .filter((caption: string) => caption)
      .map((cap) => cap.trim())

    res.status(200).send(captions)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: "Error generating captions from idea" })
  }
}

const saveGeneratedContent = async (req: Request, res: Response) => {
  const { phoneNumber, topic, data } = req.body
  try {
    const doc = await db.collection("contents").add({ phoneNumber, topic, data, timestamp: new Date() })
    res.status(200).send({ success: true, captionId: doc.id })
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: "Error saving content" })
  }
}

const getUserGeneratedContents = async (req: Request, res: Response) => {
  const { phoneNumber } = req.params
  try {
    const snapshot = await db.collection("contents").where("phoneNumber", "==", phoneNumber).get()
    if (snapshot.empty) {
      return res.status(200).send([])
    }

    const contents: Array<object> = []
    snapshot.forEach((doc) => {
      contents.push({ id: doc.id, ...doc.data() })
    })

    res.status(200).send(contents)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: "Error retrieving contents" })
  }
}

const unsaveContent = async (req: Request, res: Response) => {
  const { captionId } = req.body
  try {
    await db.collection("contents").doc(captionId).delete()
    res.status(200).send({ success: true })
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: "Error unsaving content" })
  }
}

const extractStrings = (text: string): string[] => {
  const regex = /'''(.*?)'''/g
  const matches: string[] = []
  let match

  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1])
  }

  return matches
}

export {
  createCaptionsFromIdeas,
  createNewAccessCode,
  generatePostCaptions,
  getPostIdeas,
  getUserGeneratedContents,
  saveGeneratedContent,
  unsaveContent,
  validateAccessCode,
}
