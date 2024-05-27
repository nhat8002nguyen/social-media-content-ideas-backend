# social-media-content-ideas-backend
- Express.js + typescript
### How to run this:
1. Install packages with `yarn` (preferred) or `npm install`.
2. Get live credentials from https://console.twilio.com/ (go to step 2, at the bottom of the page). Used for step 4.
3. Get the Gemini API key at https://aistudio.google.com/app/apikey, used for step 4.  
4. Change .env.dev to .env, and modify these variables: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, and `GEMINI_API_KEY`.
5. Create a Firebase project, and get a service account key by going to Project settings -> Service accounts tab, then generating a new private key. Save the key under the name `serviceAccountKey.json` into the project root.
6. Run the program using the command `yarn dev`. The terminal should display a `Server is running on port 9000` message.
7. Start set up and run the front end. 
