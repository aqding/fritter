import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Vote } from "./model";
import { format } from "morgan";

type VoteResponse = {
  _id: string;
  userId: string;
  freetId: string;
  vote: number;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string =>
  moment(date).format("MMMM Do YYYY, h:mm:ss a");

const constructVoteResponse = (vote: HydratedDocument<Vote>): VoteResponse => {
  const voteCopy: Vote = {
    ...vote.toObject({
      versionKey: false,
    }),
  };

  return {
    _id: vote._id.toString(),
    userId: vote.voterId.toString(),
    freetId: vote.freetId.toString(),
    vote: vote.vote,
    dateModified: formatDate(vote.dateModified),
  };
};

export { constructVoteResponse };
