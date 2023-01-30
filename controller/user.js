const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const changePassword = async (req, res) => {
    try {
        let { oldPassword, newPassword, retypePassword } = req.body;
        const checkOldPassword = await bcrypt.compare(oldPassword, req.user.password);
        if (!checkOldPassword) {
            throw "Old password is wrong"
        } else if (newPassword !== retypePassword) {
            throw "Retype password is not same as New password"
        } else {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updatePassword = await prisma.user.update({
                where: {
                    id : req.user.id
                },
                data: {
                    password : hashedPassword
                }
            });
            if (!updatePassword) {
                throw "Update password failed";
            } else {
                res.status(200).json({
                    "message": "Update password successfully",
                });
            }
        }
    } catch (error) {
        res.status(400).json({
            "message": error,
        });
    }
}

const getProfile = async (req, res) => {
    try {
        let user = req.user;
        const getUser = await prisma.user.findFirst({
            where: {
                id : user.id
            }
        });
         if (user) {
            res.status(200).json({
                "message": "Data user",
                "user" : getUser
            });
         } else {
             throw "User is not exist"
        }
    } catch (error) {
        res.status(400).json({
            "message": error,
        });
    }
}


const changeProfile = async (req, res) => {
    try {
        let user = req.user;
        let { name } = req.body;
        const updateProfile = await prisma.user.update({
            where: {
                id : user.id
            },
            data : {
                name : name
            }
        });
        if (!updateProfile) {
            throw "Update profile failed"
        } else {
            res.status(200).json({
                "message": "Update profile successfully",
            });
        }
    } catch (error) {
        res.status(400).json({
            "message": error,
        });
    }
}


const deleteUser = async (req, res) => {
    try {
        let user = req.user;
        const list = await prisma.list.findMany({
            where: {
                userId : user.id
            }
        });
        if (list) {
            const deleteList = await prisma.list.deleteMany({
                where: {
                    userId : user.id
                }
            });
        }
        const getUser = await prisma.user.delete({
            where: {
                id : user.id
            }
        });
        if (!getUser) {
            throw "Delete user failed"
        } else {
            res.status(200).json({
                "message": "Delete user successfully",
            });
        }
    } catch (error) {
        res.status(400).json({
            "message": error,
        });
    }
}


module.exports = {changePassword, getProfile, changeProfile, deleteUser}