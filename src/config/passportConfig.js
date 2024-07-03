import passport from "passport";
import jwt, { ExtractJwt } from "passport-jwt";
import GitHubStrategy from "passport-github2";
import config from "./config.js";
import userModel from "../dao/models/userModel.js";

const jwtStrategy = jwt.Strategy;

const CLIENT_ID = config.CLIENT_ID;
const SECRET_ID = config.SECRET_ID;

const initializatePassport = () => {
  passport
    // using jwt strategy
    .use(
      "jwt",
      new jwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
          secretOrKey: SECRET_ID,
        },
        async (payload, done) => {
          try {
            let user = await userModel.findById(payload.sub);
            if (!user) {
              return done(null, false);
            }
            done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    )
    // using github strategy
    .use(
      "github",
      new GitHubStrategy(
        {
          clientID: CLIENT_ID,
          clientSecret: SECRET_ID,
          callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
              user = new userModel({
                name: profile._json.name,
                email: profile._json.email,
                password: profile._json.node_id,
              });
              await user.save();
            } else {
              user.password = profile._json.node_id;
              await user.save();
            }
            done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token =
      req.cookies.auth || req.cookies.jwt
        ? null
        : req.cookies.auth || req.cookies.jwt;
  }
  return token;
};

export default initializatePassport;
SECRET_ID;
