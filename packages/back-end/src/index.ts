import express from "express";
import graphqlHTTP from "express-graphql";
import schema from "swapi-graphql-schema";
import cors from "cors";

const app = express();

app.use(cors());

app.use(
  "/",
  graphqlHTTP({
    schema,
  })
);

console.info("Listening on port", SERVER_PORT);

// `SERVER_PORT` is substituted by a real value at build time by webpack:
app.listen(SERVER_PORT);
