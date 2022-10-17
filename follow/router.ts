import type { NextFunction, Request, Response } from "express";
import express from "express";
import { FollowCollection } from "./collection";
import * as util from "./util";

const router = express.Router();

router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.follower !== undefined && req.query.followee !== undefined) {
      next();
      return;
    }

    res.status(400).json({
      error: {
        users: "follower or followee not provided",
      },
    });
  },
  async (req: Request, res: Response) => {
    const followingExists = await FollowCollection.findOneByUsers(
      req.query.follower as string,
      req.query.followee as string
    );

    const found = followingExists ? true : false;
    res.status(200).json({
      message: "Successfully returned following relationship",
      follow: found,
    });
  }
);

router.get("/following/:userId", async (req: Request, res: Response) => {
  const following = await FollowCollection.findAllFollowing(req.params.userId);

  res.status(200).json({
    message: "Successfully found all following",
    following: following,
  });
});

router.get("/followers/:userId", async (req: Request, res: Response) => {
  const followers = await FollowCollection.findAllFollowers(req.params.userId);

  res.status(200).json({
    message: "Successfully found all followers",
    followers: followers,
  });
});

router.post("/", async (req: Request, res: Response) => {
  if (req.body.follower === undefined || req.body.followee === undefined) {
    res.status(400).json({
      error: {
        message: "request not formatted properly",
      },
    });
  }

  const follow = await FollowCollection.addOne(
    req.body.follower,
    req.body.followee
  );

  res.status(201).json({
    message: "Your follow was successfully established",
    follow: util.constructFollowResponse(follow),
  });
});

router.delete("/", async (req: Request, res: Response) => {
  await FollowCollection.deleteOneByUsers(req.body.follower, req.body.followee);

  res.status(200).json({
    message: "Follow successfully deleted",
  });
});
export { router as followRouter };
