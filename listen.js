const express = require('express');
const app = express();

app.listen(9090, (err) => {
    if (err) console.log(err);
    console.log(`Server is listening on 9090...`);
  });