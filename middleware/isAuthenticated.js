const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const isAuthenticated = async (req, res, next) => {
    try {
        if (!req.headers["authorization"]) {
            res.status(400).json({
                "message": "Missing authorization headers",
            });
        }


        const authHeaders = req.headers["authorization"];
        const authMethod = authHeaders.split(" ")[0];
        const accessToken = authHeaders.split(" ")[1];

        if (!authMethod || !accessToken) {
            res.status(400).json({
                "message": "Invalid auth headers",
            });
        } else if (authMethod !== "bearer") {
            res.status(400).json({
                "message": "Invalid bearer method",
            });
        }

        let tokenBody = await jwt.verify(accessToken, process.env.TOKEN_SECRET);
        let user = await prisma.user.findUnique({
            where: {
                id:tokenBody.id
            }
        });
        if (!user) {
            res.status(400).json({
                "message": "User not found",
            });
        }
        req.user = user;
    } catch (error) {
         res.status(400).json({
            "message": "Invalid access token",
        });
    }

    next();
}

module.exports = {isAuthenticated}