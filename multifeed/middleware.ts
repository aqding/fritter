import type { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import UserCollection from "../user/collection";
import MultifeedCollection from "./collection";
import MultifeedModel from "./model";
import { multifeedRouter } from "./router";

const isValidMultifeedId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.params.multifeedId) {
    const validMultifeed = Types.ObjectId.isValid(req.params.multifeedId);
    const multifeed = validMultifeed
      ? await MultifeedModel.findById(req.params.multifeedId)
      : "";

    if (!multifeed) {
      res.status(404).json({
        error: {
          invalidId: "the multifeed ID is not valid.",
        },
      });
      return;
    }
  } else {
    const validMultifeed = Types.ObjectId.isValid(req.body.multifeedId);
    const multifeed = validMultifeed
      ? await MultifeedModel.findById(req.body.multifeedId)
      : "";

    if (!multifeed) {
      res.status(404).json({
        error: {
          invalidId: "the multifeed ID is not valid.",
        },
      });
      return;
    }
  }

  next();
};

const isValidName = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.name) {
    res.status(404).json({
      error: {
        invalidRequest: "must include a nonempty name.",
      },
    });
    return;
  }
  next();
};
const isValidContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!Array.isArray(JSON.parse(req.body.content))) {
    res.status(404).json({
      error: {
        invalidRequest: "content should be an array of IDs.",
      },
    });
    return;
  }

  let valid = true;
  await JSON.parse(req.body.content).map(
    async (id: Types.ObjectId | string) => {
      const validUser = Types.ObjectId.isValid(id);
      const user = validUser ? await UserCollection.findOneByUserId(id) : "";
      if (!user) {
        valid = false;
      }
    }
  );
  if (valid && !JSON.parse(req.body.content).includes(req.body.userId)) {
    next();
  } else {
    res.status(404).json({
      error: {
        invalidRequest: "1 or more IDs is not valid.",
      },
    });
    return;
  }
};

const isValidOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const multifeedId = req.body.multifeedId
    ? req.body.multifeedId
    : req.params.multifeedId;

  const multifeed = await MultifeedCollection.getOneById(multifeedId);
  if (req.session.userId.toString() !== multifeed.authorId.toString()) {
    res.status(403).json({
      error: "Cannot change multifeeds of other users.",
    });
    return;
  }
  next();
};

export { isValidMultifeedId, isValidContent, isValidName, isValidOwner };
