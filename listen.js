const app = require("./app");
const { PORT = 9090 } = process.env;

app.listen(PORT, () => {
  if (err) console.log(err);
  console.log(`Server is listening on ${PORT}...`);
});
