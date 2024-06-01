import passport from "passport";
import jwt, { ExtractJwt } from "passport-jwt";
import GitHubStrategy from "passport-github2";

import userModel from "../dao/models/userModel.js";

const jwtStrategy = jwt.Strategy;

const CLIENT_ID = "Iv1.35dc8198b4c5ce6f";
const SECRET_ID = "41717b2b005f59abdfadca1347d346123ee67e3f";

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
    )
  passport.serializeUser((user, done) => {
    done(null, user._id);
  })
  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
}

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.auth || req.cookies.jwt ? null : req.cookies.auth || req.cookies.jwt;
  }
  return token;
}


/*
datos sensibles
Owned by: @danfranco73
App ID: 888863
Client ID: Iv1.35dc8198b4c5ce6f
Client Secret: 41717b2b005f59abdfadca1347d346123ee67e3f*/

export default initializatePassport ; SECRET_ID;
