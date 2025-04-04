const USER = 1;
const ADMIN = 2;

module.exports = (request, response, next) => {
    if (request.isAuthenticated()) {
        const user = request.user;
        if (user) {
            const profile = parseInt(user.profile);

            const originalUrl = request.originalUrl;
            const method = request.method;

            if (originalUrl.indexOf("/users") !== -1 && profile !== ADMIN) {
                return response.render("login", { title: "Login", message: "Autentique-se para ver esta página!" });
            }

            return next();
        }
    }

    response.render("login", { title: "Login", message: "Autentique-se para ver esta página!" });
}