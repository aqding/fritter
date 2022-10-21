import type { Types, PopulatedDoc, Document } from "mongoose";
import { Schema, model } from "mongoose";
import type { User } from "user/model";

/**
 * Type definition for a Follow on the backend
 */

export type Follow = {
  _id: Types.ObjectId;
  follower: User;
  followee: User;
  dateCreated: Date;
};

/**
 * Mongoose schema definition for  a Follow
 */

const FollowSchema = new Schema<Follow>({
  // The user ID of the user doing the following
  follower: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The user ID of the person being followed
  followee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  // The date the following relationship happened
  dateCreated: {
    type: Date,
    required: true,
  },
});

const FollowModel = model<Follow>("Follow", FollowSchema);
export default FollowModel;
