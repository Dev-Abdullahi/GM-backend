// import dotenv from "dotenv";
// dotenv.config()
import path from 'path';
import express from "express";
import * as mongoose from "mongoose";
import chalk from 'chalk';
import socketConnection from './socket.js';  
import { nanoid } from "nanoid";
import { MONGO_DB_URI } from "./utils/constants.js";

const PORT = process.env.PORT || 8000;
const app = express();

// app.use(bodyParser.json());
// console.log(process.env.NODE_ENV)
// console.log(path.resolve('../.env').replace(/\\/g,'/'))
app.use(express.urlencoded({ extended: false }));

app.use( 
  ( 
    req: any, 
    res: {
      [x: string]: any;
      setHeader: (arg0: string, arg1: string) => void;
    },
    next: () => void
  ) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,PATCH,DELETE,POST");
    //THIS IS  ALLOWED TO LET ANY DOMAIN HAVE ACCESS TO OUR API EMDPINTS
    // if(req/)
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  }
);

const init = () => {
  const server = app.listen(PORT, () => {
    console.log("          🛡️ 🛡️ 🛡️ 🛡️ 🛡️ 🛡️");
    console.log(chalk.blueBright(`⚡⚡⚡Client connected on port: http://localhost:${PORT}⚡⚡⚡`));
    console.log("          🛡️ 🛡️ 🛡️ 🛡️ 🛡️ 🛡️");
  });  
  const connectionInstance = new socketConnection(server);
  const io = connectionInstance.getIO();

  // Socket setup

  io.on("connection", (socket: any) => {
    console.log(chalk.bgWhiteBright("omo person don connect"));



    socket.on('create-meet',() => {
      const meetUid = `${nanoid(3)}-${nanoid(4)}-${nanoid(3)}`.toLowerCase();
      console.log(meetUid,'meetUid')
  
      const meetData = {
        meetingLink:meetUid, 
      }
      
      socket.emit("meet-created",meetData);
    });

  }); 
};

// console.log(server)

mongoose
  .connect(MONGO_DB_URI)
  .then(() => { 
    console.log(chalk.bgYellow('         '))
    console.log(chalk.bgCyan("Connected to MONGO-DB"));
    console.log(chalk.bgYellow('         '))
    init();
  })
  .catch((err: Error) => {
    console.log(err);
  });  
