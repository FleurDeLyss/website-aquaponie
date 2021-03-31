const jwt = require('jsonwebtoken');
const publicKey = require('fs').readFileSync(process.env.DATA_DIR + '/public.pem');

module.exports = function (options) {
    return function (req, res, next) {
        if (!req.headers.authorization) return res.status(401).json({ message: "No token" });

        let authorization = req.headers.authorization.split(' ');

        if (authorization[0] == "User") {
            let decoded;
            try {
                decoded = jwt.verify(authorization[1], publicKey);
            } catch (err) {
                return res.status(401).json({ message: "Invalid token" });
            }

            if (decoded.type !== 'access') {
                return res.status(401).json({ message: "Unauthorize token type" });
            }

            if (options) {
                if (options.min && decoded.permissions < options.min) {
                    return res.status(401).json({ message: "Perm to low" });
                }
            }

            req.user = { id: decoded.id };
            req.tokenType = "user";
        } else {
            return res.status(401).json({ message: "Invalid token type" });
        }


        next();
    }
}