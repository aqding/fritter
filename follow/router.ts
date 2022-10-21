import type { NextFunction, Request, Response } from "express";
import express from "express";
import { FollowCollection } from "./collection";
import * as util from "./util";
import * as followValidator from "./middleware";
import * as userValidator from "../user/middleware";

const router = express.Router();

/**
 * Get a Follow relationship between two users
 *
 * @name GET /api/follow
 *
 * @return {boolean} - True if the follow relationship exists, False otherwise
 * @throws {404} - If either ID is provided or valid
 */
router.get(
  "/",
  [followValidator.isUsersExist],
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

/**
 *
 * Get a list of follow objects corresponding to users that a user is following
 *
 * @name GET /api/following/:userId
 *
 * @return {FollowResponse[]} array of following relationships
 * @throws {404} if the userId cannot be found
 */
router.get(
  "/following/:userId",
  [followValidator.isUserExist],
  async (req: Request, res: Response) => {
    const following = await FollowCollection.findAllFollowing(
      req.params.userId
    );
    const response = following.map(util.constructFollowResponse);
    res.status(200).json({
      message: "Successfully found all following",
      following: response,
    });
  }
);

/**
 *
 * Get a list of follow objects corresponding to users that are following a user
 *
 * @name GET /api/followers/:userId
 *
 * @return {FollowResponse[]} - array of following relationships
 * @throws {404} - if the userId cannot be found
 */
router.get(
  "/followers/:userId",
  [followValidator.isUserExist],
  async (req: Request, res: Response) => {
    const followers = await FollowCollection.findAllFollowers(
      req.params.userId
    );

    const response = followers.map(util.constructFollowResponse);

    res.status(200).json({
      message: "Successfully found all followers",
      followers: response,
    });
  }
);

/**
 *
 * Post a follow relationship between a follower and a followee
 *
 * @name POST /api/follow
 *
 * @return {FollowResponse} - the follow object
 * @throws {403} - if the user is not logged in or the follower.
 * @throws {404} - if either user ID is not valid or not provided.
 * @throws {409} - if the IDs are the same.
 * @throws {405} - if the follow relation already exists.
 */
router.post(
  "/",
  [
    followValidator.isUsersExist,
    userValidator.isUserLoggedIn,
    followValidator.isValidFollowModifier,
    followValidator.isFollowExist,
  ],
  async (req: Request, res: Response) => {
    if (req.body.follower === req.body.followee) {
      res.status(409).json({
        error: {
          invalidFollow: "A user cannot follow themself.",
        },
      });
      return;
    }
    const follow = await FollowCollection.addOne(
      req.body.follower,
      req.body.followee
    );

    res.status(201).json({
      message: "Your follow was successfully established",
      follow: util.constructFollowResponse(follow),
    });
  }
);

/**
 *
 * Delete a follow relationship between a follower and a followee
 *
 * @name DELETE /api/follow
 *
 * @return {string} - A success message
 * @throws {403} - if the user is not logged in or the follower.
 * @throws {404} - if either user ID is not valid or not provided.
 * @throws {405} - if the follow relation doesn't exists.
 */
router.delete(
  "/",
  [
    followValidator.isUsersExist,
    userValidator.isUserLoggedIn,
    followValidator.isValidFollowModifier,
    followValidator.isFollowNotExist,
  ],
  async (req: Request, res: Response) => {
    await FollowCollection.deleteOneByUsers(
      req.body.follower,
      req.body.followee
    );

    res.status(200).json({
      message: "Follow successfully deleted",
    });
  }
);

export { router as followRouter };
