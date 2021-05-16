const bcrypt = require('bcrypt')


bcrypt.hash("thachdua", 10, (err, rel) => {
    console.log(rel);
})