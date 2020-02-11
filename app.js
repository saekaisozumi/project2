require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

mongoose
  .connect("mongodb://localhost/project-2", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

app.use(
  session({
    secret: "irongenerator",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

app.use(passport.initialize());
app.use(passport.session());

const flash = require("connect-flash");
app.use(flash());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

const User = require("./models/User");

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(userDocument => {
      done(null, userDocument);
    })
    .catch(err => {
      done(err);
    });
});

const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
      .then(userDocument => {
        if (!userDocument) {
          done(null, false, { message: "Incorrect credentials" });
          return;
        }
        bcrypt.compare(password, userDocument.password).then(match => {
          if (!match) {
            done(null, false, { message: "Incorrect credentials" });
            return;
          }
          console.log(userDocument);
          done(null, userDocument);
        });
      })
      .catch(err => {
        done(err);
      });
  })
);

//Facebook login
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "http://localhost:3000/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ facebookId: profile.id })
        .then(userDocument => {
          if (userDocument) {
            done(null, userDocument);
          } else {
            return User.create({ facebookId: profile.id }).then(createdUser => {
              done(null, createdUser);
            });
          }
        })
        .catch(err => {
          done(err);
        });
    }
  )
);

//google login
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      callbackURL: "https://localhost:3000/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log("Google account details:", profile);

      User.findOne({ googleID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }

          User.create({ googleID: profile.id })
            .then(createdUser => {
              done(null, createdUser);
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  )
);

//FOURSQUARE API
// const request = require("request");

// request(
//   {
//     url: "https://api.foursquare.com/v2/venues/explore",
//     method: "GET",
//     qs: {
//       client_id: process.env.apiClientID,
//       client_secret: process.env.apiClientSecret,
//       ll: "40.7243,-74.0018",
//       query: "coffee",
//       v: "20180323",
//       limit: 1
//     }
//   },
//   function(err, res, body) {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(body);
//     }
//   }
// );

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

module.exports = app;
