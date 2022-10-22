import type { NextFunction, Request, Response } from "express";
import express from "express";
import VoteCollection from "./collection";
import * as util from "./util";
import * as userValidator from "../user/middleware";
import * as voteValidator from "./middleware";
import * as freetValidator from "../freet/middleware";
import * as followValidator from "../follow/middleware";

const router = express.Router();

/**
 *
 * Upsert a vote that a user gives to a Freet
 *
 * @name PUT /api/vote
 *
 * @return {VoteResponse} - The vote object that was just upserted
 * @throws {403} - if the user is not logged in or not the follower.
 * @throws {404} - if user ID or freet Id is not valid or provided, or if vote is not in {-1, 0, 1}
 *
 */
router.put(
  "/",
  [
    voteValidator.isValidVotePut,
    userValidator.isUserLoggedIn,
    voteValidator.isValidVoteModifier,
  ],
  async (req: Request, res: Response) => {
    const vote = await VoteCollection.voteOne(
      req.body.userId,
      req.body.freetId,
      req.body.vote
    );

    res.status(200).json(util.constructVoteResponse(vote));
  }
);

/**
 *
 * Get all the votes on a certain Freet that are not 0.
 *
 * @name GET /api/vote/freet/:freetId
 *
 * @return {VoteResponse[]} - Array of votes that the Freet has
 * @throws {404}- if the freetId is not valid
 */
router.get(
  "/freet/:freetId",
  [freetValidator.isFreetExists],
  async (req: Request, res: Response) => {
    const votes = await VoteCollection.getVoteForFreet(req.params.freetId);
    const response = votes
      .map(util.constructVoteResponse)
      .filter((vote) => vote.vote !== 0);
    res.status(200).json(response);
  }
);

/**
 *
 * Get all the votes that a user has made that are not 0.
 *
 * @return {VoteResponse[]} - Array of votes that the Freet has
 * @throws {404} - if the userId is not valid
 */
router.get(
  "/user/:userId",
  [followValidator.isUserExist],
  async (req: Request, res: Response) => {
    const votes = await VoteCollection.getVoteForUser(req.params.userId);
    const response = votes
      .map(util.constructVoteResponse)
      .filter((vote) => vote.vote !== 0);
    res.status(200).json(response);
  }
);
export { router as voteRouter };
