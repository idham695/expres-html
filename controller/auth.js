const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();


const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        const getUser = await prisma.user.findUnique({
            where: {
                email : email
            }
        });
        if (getUser) {
            res.status(400).json({
                "message": "User is exist, please input another email",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            res.status(400).json({
                "message": "Register failed",
            });
        }
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password : hashedPassword
            }
        })
        if (user) {
            res.status(200).json({
                "message": "Register successfully",
                "user" : user
            });
        }
    } catch (error) {
        res.status(400).json({
            "message": "Register failed",
        });
    }
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            res.status(400).json({
                "message": "User not found",
            });
        }
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            res.status(400).json({
                "message": "Password wrong",
            });
        }
        const token = await jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        },
            process.env.TOKEN_SECRET,
        {
            expiresIn : 86400,
        }
        );
        res.status(200).json({
            "message": "Login Success",
            "token" : token
        });
    } catch (error) {
        res.status(400).json({
            "message": "Login failed",
        });
    }
}

module.exports = {register, login}