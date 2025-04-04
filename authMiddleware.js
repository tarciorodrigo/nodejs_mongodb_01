const auth = require("./auth");
const db = require("./db");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.findUser(id);
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    })

    passport.use(new LocalStrategy({
        usernameField: "nome",
        passwordField: "senha"
    },
        async (username, password, done) => {
            try {
                console.log(username);
                const user = await auth.findUserByNome(username);
                if (!user) return done(null, false);

                if (!bcrypt.compareSync(password, user.senha))
                    return done(null, false);
                else
                    return done(null, user);
            }
            catch (err) {
                return done(err, false);
            }
        }
    ))
}