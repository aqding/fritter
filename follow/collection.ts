import type { HydratedDocument, Types } from "mongoose";
import type { User } from "user/model";
import type { Follow } from "./model";
import FollowModel from "./model";
import { followRouter } from "./router";

class FollowCollection {
  /**
   * Add a follow relation to the collection
   * @param {string} follower - The id of the follower user
   * @param {string} followee - The id of the followee user
   * @returns {Promise<HydratedDocument<Follow>} - The newly created follow relation
   */

  static async addOne(
    follower: Types.ObjectId | string,
    followee: Types.ObjectId | string
  ): Promise<HydratedDocument<Follow>> {
    const date = new Date();

    const follow = new FollowModel({ follower, followee, dateCreated: date });
    await follow.save();
    return follow;
  }

  static async findOneByUsers(
    follower: Types.ObjectId | string,
    followee: Types.ObjectId | string
  ): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({
      follower: follower,
      followee: followee,
    });
  }

  static async findAllFollowing(
    user: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Follow>>> {
    const following = await FollowModel.find({ follower: user }).populate([
      "follower",
      "followee",
    ]);
    return following;
  }

  static async findAllFollowers(
    user: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Follow>>> {
    const followers = await FollowModel.find({ followee: user }).populate([
      "follower",
      "followee",
    ]);
    return followers;
  }

  static async deleteOneByUsers(
    follower: Types.ObjectId | string,
    followee: Types.ObjectId | string
  ): Promise<Boolean> {
    const follow = await FollowModel.deleteOne({
      follower: follower,
      followee: followee,
    });
    return follow === null;
  }
}

export { FollowCollection };
