import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import UserCollection from "../user/collection";
import { FollowCollection } from "./collection";

/**
 * Checks if the user IDs in the request
 * actually exist.
 */
const isUsersExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // GET Request case

  if (req.query.follower && req.query.followee) {
    const validFollower = Types.ObjectId.isValid(req.query.follower as string);
    const validFollowee = Types.ObjectId.isValid(req.query.followee as string);

    const follower = validFollower
      ? UserCollection.findOneByUserId(req.query.follower as string)
      : "";
    const followee = validFollowee
      ? UserCollection.findOneByUserId(req.query.followee as string)
      : "";
    if (!(await follower) || !(await followee)) {
      res.status(404).json({
        error: {
          userNotFound: "one or more IDs passed in was not recognized.",
        },
      });
      return;
    }
  }
  // POST/DELETE Request case
  else {
    const validFollower = Types.ObjectId.isValid(req.body.follower as string);
    const validFollowee = Types.ObjectId.isValid(req.body.followee as string);

    const follower = validFollower
      ? UserCollection.findOneByUserId(req.body.follower)
      : "";
    const followee = validFollowee
      ? UserCollection.findOneByUserId(req.body.followee)
      : "";

    if (!(await follower) || !(await followee)) {
      res.status(404).json({
        error: {
          userNotFound: "one or more IDs passed in was not recognized.",
        },
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the user ID in the
 * req.param.userId field exists.
 */
const isUserExist = async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserCollection.findOneByUserId(req.params.userId);

  if (!user) {
    res.status(404).json({
      error: {
        userNotFound: "the user ID could not be found.",
      },
    });
  } else {
    next();
  }
};

/**
 * Checks if there already exists a follow relationship between 2 users.
 * Does not check if IDs are valid, and isUsersExists should be called first
 */
const isFollowExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const follow = await FollowCollection.findOneByUsers(
    req.body.follower,
    req.body.followee
  );

  if (follow) {
    res.status(405).json({
      error: {
        existingFollow: "this following relationship already exists.",
      },
    });
    return;
  }

  next();
};

/**
 * Checks if there is no following relationship between 2 users.
 */
const isFollowNotExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const follow = await FollowCollection.findOneByUsers(
    req.body.follower,
    req.body.followee
  );

  if (!follow) {
    res.status(405).json({
      error: {
        nonexistantFollow: "This following relationship doesn't exist.",
      },
    });
    return;
  }
  next();
};

const isValidFollowModifier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await UserCollection.findOneByUserId(req.body.follower);
  const userId = user._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: {
        invalidModified:
          "Current session user cannot modify this follow relationship.",
      },
    });
    return;
  }
  next();
};
export {
  isUsersExist,
  isUserExist,
  isFollowExist,
  isFollowNotExist,
  isValidFollowModifier,
};
