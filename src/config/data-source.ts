import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";

export const AppDataSource = new DataSource({
   type: "postgres",
   host: Config.DB_HOST,
   port: Number(Config.DB_PORT),
   username: Config.DB_USERNAME ,
   password: Config.DB_PASSWORD,
   database: Config.DB_DATABASENAME,
//    don't use it in production
   synchronize: false,
   logging: false,
   entities: ["src/entity/*.ts"],  //[User,RefreshToken]
   migrations: ["src/migration/*.ts"],
   subscribers: [],
});
