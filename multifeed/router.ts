import type { NextFunction, Request, Response } from "express";
import express from "express";
import MultifeedCollection from "./collection";
import * as util from "./util";
import * as userValidator from "../user/middleware";
import * as freetValidator from "../freet/middleware";
import * as followValidator from "../follow/middleware";
import * as multifeedValidator from "./middleware";
import MultifeedModel from "./model";
import UserModel from "user/model";
import FollowModel from "follow/model";
import { FollowCollection } from "../follow/collection";

const router = express.Router();

/**
 * Get all multifeeds created by a specific user
 *
 * @name GET /api/multifeed/user?author=USER
 *
 * @return {Array<MultifeedResponse>} - array of multifeeds
 * @throws {403} - if the user is not logged in or the owner of the multifeed
 * @throws {404} - if the userID is not valid
 */
router.get(
  "/user",
  [userValidator.isUserLoggedIn],
  async (req: Request, res: Response) => {
    if (req.session.userId !== req.query.author.toString()) {
      res.status(403).json({
        error: "Cannot access multifeeds of other users.",
      });
      return;
    }
    const multifeeds = await MultifeedCollection.getMultifeedByAuthor(
      req.query.author as string
    );
    const response = multifeeds.map(util.constructMultifeedResponse);

    res.status(200).json(response);
  }
);

/**
 * Get a multifeed by ID
 *
 * @name GET /api/multifeed/:multifeedId
 *
 * @return {MultifeedResponse} - the multifeed object
 * @throws {403} - if the user is not logged in or the owner of the multifeed
 * @throws {404} - if the multifeed ID is not valid
 */
router.get(
  "/:multifeedId",
  [userValidator.isUserLoggedIn, multifeedValidator.isValidMultifeedId],
  async (req: Request, res: Response) => {
    const multifeed = await MultifeedCollection.getOneById(
      req.params.multifeedId
    );

    if (multifeed.authorId.toString() !== req.session.userId) {
      res.status(403).json({
        error: "Cannot access multifeed of other users.",
      });
      return;
    }
    res.status(200).json(util.constructMultifeedResponse(multifeed));
  }
);

/**
 *
 * Create a new multifeed
 *
 * @name POST /api/multifeed
 *
 * @return {MultifeedResponse} - The multifeed object that was just created
 * @throws {403} - if the user is not logged in
 * @throws {404} - if any ID provided is not valid or the name is not provided
 * @throws {405} - if a multifeed made by the user has the provided name already
 */
router.post(
  "/",
  [
    userValidator.isUserLoggedIn,
    multifeedValidator.isValidName,
    multifeedValidator.isValidContent,
  ],
  async (req: Request, res: Response) => {
    const existing = await MultifeedModel.find({
      authorId: req.session.userId,
      name: req.body.name,
    });
    if (existing.length !== 0) {
      res.status(405).json({
        error: {
          nameInUse: "this name is already in use.",
        },
      });
      return;
    }
    const multifeed = await MultifeedCollection.addOne(
      req.session.userId,
      req.body.name,
      JSON.parse(req.body.content)
    );

    JSON.parse(req.body.content).map(async (user: string) => {
      const followRelation = await FollowCollection.findOneByUsers(
        req.session.userId,
        user
      );
      if (!followRelation) {
        FollowCollection.addOne(req.session.userId, user);
      }
    });

    res.status(200).json(util.constructMultifeedResponse(multifeed));
  }
);

/**
 *
 * Update an existing multifeed
 *
 * @name PUT /api/multifeed
 *
 * @return {MultifeedResponse} - The multifeed object that was updated
 * @throws {403} - if the user is not logged in or the owner of the multifeed
 * @throws {404} - if the multifeed ID is not valid, if any IDs passed in are not valid,
 * or if the name is not valid
 * @throws {405} - if a multifeed made by the user has the provided name already
 *
 */
router.put(
  "/",
  [
    userValidator.isUserLoggedIn,
    multifeedValidator.isValidName,
    multifeedValidator.isValidContent,
    multifeedValidator.isValidMultifeedId,
    multifeedValidator.isValidOwner,
  ],
  async (req: Request, res: Response) => {
    const existing = await MultifeedModel.find({
      authorId: req.session.userId,
      name: req.body.name,
      _id: { $nin: [req.body.multifeedId] },
    });
    if (existing.length !== 0) {
      res.status(405).json({
        error: {
          nameInUse: "this name is already in use.",
        },
      });
      return;
    }
    const multifeed = await MultifeedCollection.updateOne(
      req.body.multifeedId,
      req.body.name,
      JSON.parse(req.body.content)
    );

    JSON.parse(req.body.content).map(async (user: string) => {
      const followRelation = await FollowCollection.findOneByUsers(
        req.session.userId,
        user
      );
      if (!followRelation) {
        FollowCollection.addOne(req.session.userId, user);
      }
    });

    res.status(200).json(util.constructMultifeedResponse(multifeed));
  }
);

/**
 *
 * Delete an existing multifeed
 *
 * @name DELETE /api/multifeed/:multifeedId
 *
 * @return {string} - A success message
 * @throws {403} - if the user is not logged in or the owner of the multifeed
 * @throws {404} - if the multifeed ID is not valid or does not exists
 */
router.delete(
  "/:multifeedId",
  [
    userValidator.isUserLoggedIn,
    multifeedValidator.isValidMultifeedId,
    multifeedValidator.isValidOwner,
  ],
  async (req: Request, res: Response) => {
    await MultifeedCollection.deleteOne(req.params.multifeedId);
    res.status(200).json({
      message: "Your multifeed was deleted successfully",
    });
  }
);

export { router as multifeedRouter };
