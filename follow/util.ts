import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Follow } from "./model";

type FollowResponse = {
  _id: string;
  followerId: string;
  followerName: string;
  followeeId: string;
  followeeName: string;
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string =>
  moment(date).format("MMMM Do YYYY, h:mm:ss a");

/**
 *
 * Tranforms a raw Follow object into an object
 * with all the information the frontend will need
 *
 * @param {HydratedDocument<Follow} follow - A follow
 * @returns {FollowResponse} - A JS Object for a Follow
 */
const constructFollowResponse = (
  follow: HydratedDocument<Follow>
): FollowResponse => {
  const followCopy: Follow = {
    ...follow.toObject({
      versionKey: false,
    }),
  };

  //   delete followCopy.followee.password;
  console.log(followCopy);
  return {
    _id: followCopy._id.toString(),
    followerId: followCopy.follower._id.toString(),
    followerName: followCopy.follower.username.toString(),
    followeeId: followCopy.followee._id.toString(),
    followeeName: followCopy.followee.username.toString(),
    dateCreated: formatDate(follow.dateCreated),
  };
};

export { constructFollowResponse };
