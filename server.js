require('dotenv').config()

const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require('bcrypt')
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const User = db.user;
db.mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

async function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
  
  User.findOne({
    username: 'Mugammad'
  }).exec(async (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!user) {
        const salt = await bcrypt.genSalt()
        const user = new User({
        username: 'Mugammad',
        email: 'mobread@gmail.com',
        password: bcrypt.hashSync(process.env.PASSWORD, salt)
        });
        user.save((err, user) => {
          
          if (err) {
            console.log({ message: err });
            return;
          }
          Role.findOne({ name: "admin" }, (err, role) => {
              if (err) {
                console.log({ message: err });
                return;
              }
              user.roles = [role._id];
              user.save(err => {
                if (err) {
                  console.log({ message: err });
                  return;
                }
                console.log({ message: "User was registered successfully!" });
              });
            });
        })
    }
  })
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/product.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});