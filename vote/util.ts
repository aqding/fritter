import type { HydratedDocument } from "mongoose";
import moment from "moment";
import type { Vote } from "./model";
import { format } from "morgan";

type VoteResponse = {
  _id: string;
  userId: string;
  username: string;
  freetId: string;
  freetContent: string;
  freetDate: string;
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
    userId: vote.voterId._id.toString(),
    username: vote.voterId.username.toString(),
    freetId: vote.freetId._id.toString(),
    freetContent: vote.freetId.content.toString(),
    freetDate: formatDate(vote.freetId.dateCreated),
    vote: vote.vote,
    dateModified: formatDate(vote.dateModified),
  };
};

export { constructVoteResponse };
