import winston from "winston";
import { Config } from ".";
const logger = winston.createLogger({
   level: "info",
   defaultMeta: { service: "auth-service" },
   silent:Config.NODE_ENV==="test",
   transports: [
      new winston.transports.Console({
         level: "info",
         format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
         ),
         silent: Config.NODE_ENV === "test",
      }),
      new winston.transports.File({
         filename: "logs",
         level: "info",
         silent: Config.NODE_ENV === "test",
      }),
   ],
});

export default logger;
