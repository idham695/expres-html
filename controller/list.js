const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

let getAllList = async (req, res) => {
    try {
        let list = await prisma.list.findMany({
            where: {
                userId : req.user.id
            }
        });
        if (list) {
            res.status(200).json({
                "message": "Data list",
                "list" : list
            });
        }
    } catch (error) {
        res.status(400).json({
            "message": "Data list is not exist",
        });
    }
}

let createList = async (req, res) => {
    try {
        let { title } = req.body;
        let checkList = await prisma.list.findFirst({
            where: {
                title: title,
                userId : req.user.id
            }
        });
        if (checkList) {
            res.status(400).json({
                "message": "Data is exist, please reinput with unique title"
            });
        } else {
            if (/[^a-zA-Z0-9\ \-_]/.test(title)) {
                res.status(400).json({
                    "message": "No special character in title"
                });
            } else {
                const list = await prisma.list.create({
                    data: {
                        title: title,
                        published: false,
                        userId : req.user.id
                    }
                });
                res.status(200).json({
                    "message": "Create data successfully",
                    "list" : list
                });
            }
        }
    } catch (error) {
        res.status(400).json({
            "message": "Create data failed",
        });
    }
}

let getList = async (req, res) => {
    try {
        let { id } = req.params;
        const list = await prisma.list.findFirst({
            where:{
                id: parseInt(id),
                userId : req.user.id
            }
        })
        if (list) {
            res.status(200).json({
                "message": "Data list",
                "list" : list
            });
        } else {
            res.status(400).json({
                "message": "Data list is not exist",
            });
        }
    } catch (error) {
        res.status(400).json({
            "message": "Data list is not exist",
        });
    }
}

let updateList = async (req, res) => {
    try {
        let { id } = req.params;
        let { title } = req.body;
        if (/[^a-zA-Z0-9\ \-_]/.test(title)) {
            res.status(400).json({
                "message": "No special character in title"
            });
        }else{
            const list = await prisma.list.update({
                where: {
                    id: parseInt(id),
                    // userId : tokenBody.id
                },
                data: {
                    title: title
                }
            });
            res.status(200).json({
                "message": "Update data successfully",
                "list" : list
            });
        }
    } catch (error) {
        res.status(400).json({
            "message": "Update data failed"
        });
    }
}

let deleteList = async (req, res) => {
    try {
        let { id } = req.params;
        const list = await prisma.list.delete({
            where: {
                id: parseInt(id),
            }
        });
        if (list) {
            res.status(200).json({
                "message": "Delete data successfully",
            });
        }
    } catch (error) {
        res.status(400).json({
            "message": "Delete data failed",
        });
    }
}


module.exports = { getAllList, createList, getList, updateList, deleteList };