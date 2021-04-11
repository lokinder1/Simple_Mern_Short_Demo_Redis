const express = require("express");
const axios = require("axios");
var cors = require("cors");

const redis = require("redis");

const app = express();

const port = 4000;

app.use(cors());
app.use(express.json());

// make a connection to the local instance of redis
const client = redis.createClient(6379);

client.on("error", (error) => {
  console.error(error);
});

app.post("/apiLink", (req, res) => {
  try {
    const apiLink = req.body.apiLink;

    // Check the redis store for the data first
    client.get(apiLink, async (err, result) => {
      if (result) {
        return res.status(200).send({
          error: false,
          message: `result for ${apiLink} from the cache`,
          data: JSON.parse(result),
        });
      } else {
        // When the data is not found in the cache then we can make request to the server

        const result = await axios.get( apiLink );

        // save the record in the cache for subsequent request
        client.setex(apiLink, 1440, JSON.stringify(result.data.results));

        // return the result to the client
        return res.status(200).send({
          error: false,
          message: `result for ${apiLink} from the server`,
          data: result.data.results,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
