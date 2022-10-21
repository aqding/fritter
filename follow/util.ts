import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Follow } from "./model";

type FollowResponse = {
  _id: string;
  follower: string;
  followee: string;
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

  return {
    _id: followCopy._id.toString(),
    follower: followCopy.follower.toString(),
    followee: followCopy.followee.toString(),
    dateCreated: formatDate(follow.dateCreated),
  };
};

export { constructFollowResponse };
