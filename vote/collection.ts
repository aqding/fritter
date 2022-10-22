import type { HydratedDocument, Types } from "mongoose";
import type { Vote } from "./model";
import VoteModel from "./model";
import UserCollection from "user/collection";
import FreetCollection from "freet/collection";

class VoteCollection {
  static async voteOne(
    userId: Types.ObjectId | string,
    freetId: Types.ObjectId | string,
    vote: number
  ): Promise<HydratedDocument<Vote>> {
    const dateModified = new Date();
    const query = { voterId: userId, freetId: freetId };
    const newVote = await VoteModel.findOneAndUpdate(
      query,
      {
        voterId: userId,
        freetId: freetId,
        vote: vote,
        dateModified: dateModified,
      },
      { upsert: true, new: true }
    );

    return newVote;
  }

  static async getVoteForFreet(
    freetId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Vote>>> {
    const votes = VoteModel.find({ freetId: freetId });
    return votes;
  }

  static async getVoteForUser(
    userId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Vote>>> {
    const votes = VoteModel.find({ voterId: userId });
    return votes;
  }
}

export default VoteCollection;
