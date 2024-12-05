import { Router } from "express";
import Models from "../db";
import { randomHash } from "../utils";
import isLoggedIn from "../middleware";
const brainRouter = Router();

brainRouter.post("/share",isLoggedIn, async (req,res) => {
    const userId = req.id;
    const {share} = req.body;
    if(share){
        const existingLink = await Models.LinkModel.findOne({userId});
        if(existingLink){
            res.json({
                hash : existingLink.hash,
            })
            return;
        }
        const hash = randomHash(9);
        await Models.LinkModel.create({
            hash,
            userId
        });
        res.status(200).json({
            message : " hash created successfully",
            "hash" : hash
        })
    }else {
        await Models.LinkModel.deleteOne({
            userId
        });
        res.send({message : "Link Removed"})
    }
});
brainRouter.get("/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await Models.LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    // userId
    const content = await Models.ContentModel.find({
        userId: link.userId
    })
    const user = await Models.UserModel.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })

})

export default brainRouter;