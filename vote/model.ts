import { Types, Schema, model } from "mongoose";
import type { User } from "user/model";
import type { Freet } from "freet/model";

/**
 * The type definition for a vote
 */

export type Vote = {
  _id: Types.ObjectId;
  voterId: Types.ObjectId;
  freetId: Types.ObjectId;
  vote: number;
  dateModified: Date;
};

/**
 * Mongoose schema definition for a Vote.
 */
const VoteSchema = new Schema<Vote>({
  voterId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Freet",
  },
  vote: {
    type: Number,
    required: true,
  },
  dateModified: {
    type: Date,
    required: true,
  },
});

const VoteModel = model<Vote>("Vote", VoteSchema);
export default VoteModel;
