import express from "express";
import dotenv from "dotenv";
import connection from "./shared/db/connection.js";
import router from "./modules/routes/question-route.js";
import cors from "cors";
import loginRouter from "./shared/login/authentication.js";
import signupRouter from "./shared/signup/signup.js";
import cookieParser from "cookie-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
const app = express();

dotenv.config();    

app.use(express.json());
const corsOptions = {
  origin: ["http://localhost:5173", "https://polling-frontend-97zb.onrender.com" ,"http://localhost:5174"],
  optionsSuccessStatus: 200,
  credentials:true
};

app.use(cookieParser())


app.use(cors(corsOptions));

app.use("/login",loginRouter)
app.use("/signup",signupRouter)
app.use("/api/question", router);  


app.post("/ai", async (req,res)=>{
  let {data,json}= req.body
  let model_result = await AI(data,json)
  res.json(model_result)
})


async function AI(data, json = false) {
  try {
    const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_API_KEY}`);
    let jsonkey = json ? { generationConfig: { responseMimeType: "application/json" } } : "";
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", ...jsonkey });
    const prompt = `${data}`;
    const result = await model.generateContent([prompt]);
    const response = result.response;
    const text = response.text();
    if (json) {
      return JSON.parse(text);
    }
    return text;
  } catch (err) {
    if(json){
      return {"question":"Unable to process your request as api key have been exhaused","mcq":["","","",""]}
    }
    return {"error":"Api key have been exhausted. Sorry for the inconvienance!!"}
  }

}


let port = process.env.PORT || 5555;

let promise = connection;
promise()
  .then(() => {
    app.listen(port, () => {
      console.log("Server Is Connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
