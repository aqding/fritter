import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import VoteCollection from "./collection";
import UserCollection from "../user/collection";
import FreetCollection from "../freet/collection";

/**
 * Checks if a PUT request for a vote is valid by
 * checking if the userIds and freetIds are valid and exists;
 * also checks that a vote takes on values {-1, 0, 1}
 */
const isValidVotePut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validUserFormat = Types.ObjectId.isValid(req.body.userId);
  const validFreetFormat = Types.ObjectId.isValid(req.body.freetId);
  const user = validUserFormat
    ? await UserCollection.findOneByUserId(req.body.userId)
    : "";

  const freet = validFreetFormat
    ? await FreetCollection.findOne(req.body.freetId)
    : "";

  if (!user || !freet || !new Set([-1, 0, 1]).has(req.body.vote)) {
    res.status(404).json({
      error: {
        invalidBody: "one or more body values are not valid.",
      },
    });
    return;
  }
  next();
};

/**
 * Checks if the session user is the same user as the one modifying
 * the vote.
 */
const isValidVoteModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.userId !== req.body.userId.toString()) {
    res.status(403).json({
      error: "Cannot change votes for other users.",
    });
    return;
  }
  next();
};
export { isValidVotePut, isValidVoteModifier };
