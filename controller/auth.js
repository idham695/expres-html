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
            throw "User is exist, please input another email";
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            if (!hashedPassword) {
                throw "Register failed"
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
            } else {
                throw "Register failed"
            }
        }
    } catch (error) {
        res.status(400).json({
            "message": error,
        });
    }
}

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        const regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!regex.test(email)) {
            throw "Email format is wrong, please add @ and domain"
        } else {
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            if (!user) {
                throw "User not found"
            } else {
                const checkPassword = await bcrypt.compare(password, user.password);
                if (!checkPassword) {
                    throw "Password wrong"
                } else {
                    const token = await jwt.sign({
                        id: user.id,
                        name: user.name,
                        email: user.email
                    },
                        process.env.TOKEN_SECRET,
                    {
                        expiresIn : 86400, // 1 days
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
            "message": error,
        });
    }
}

module.exports = {register, login}