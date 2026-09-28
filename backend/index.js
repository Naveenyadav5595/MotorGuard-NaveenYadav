import connectDB from "./src/db/connectDb.js";   
import {server} from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    console.log("server is starting");

    server.listen(PORT, () => {
      console.log(`server is listening at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("server can't be started", err);
  });
