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
        } else {
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
        const regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regex.test(email)) {
            res.status(400).json({
                "message": "Email format is wrong, please add @ and domain",
            });
        } else {
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            if (!user) {
                res.status(400).json({
                    "message": "User not found",
                });
            } else {
                const checkPassword = await bcrypt.compare(password, user.password);
                if (!checkPassword) {
                    res.status(400).json({
                        "message": "Password wrong",
                    });
                } else {
                    const token = await jwt.sign({
                        id: user.id,
                        name: user.name,
                        email: user.email
                    },
                        process.env.TOKEN_SECRET,
                    {
                        expiresIn : 900, // 15 minutes
                    }
                    );
                    res.status(200).json({
                        "message": "Login Success",
                        "token" : token
                    });
                }
            }
        }
    } catch (error) {
        res.status(400).json({
            "message": "Login failed",
        });
    }
}

module.exports = {register, login}