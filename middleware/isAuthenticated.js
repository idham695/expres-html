const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const isAuthenticated = async (req, res, next) => {
    if (!req.headers["authorization"]) {
        return res.status(400).json({
        success: false,
        error: "missing authorization headers provided.",
        });
    }

    const authHeaders = req.headers["authorization"];
    const authMethod = authHeaders.split(" ")[0];
    const accessToken = authHeaders.split(" ")[1];

    if (!authMethod || !accessToken) {
        return res
        .status(400)
        .json({ success: false, msg: "invalid auth headers" });
    } else if (authMethod !== "bearer") {
        return res
        .status(400)
        .json({ success: false, msg: "invalid bearer method" });
    }
    try {

        let tokenBody = await jwt.verify(accessToken, process.env.TOKEN_SECRET);
        let user = await prisma.user.findUnique({
            where: {
                id:tokenBody.id
            }
        });
        if (!user) {
            throw "User not found"
        }
        req.user = user;
    } catch (error) {
         res.status(400).json({
            "message": error,
        });
    }

    next();
}

module.exports = {isAuthenticated}