import type { HydratedDocument, Types } from "mongoose";
import type { Multifeed } from "./model";
import MultifeedModel from "./model";

class MultifeedCollection {
  /**
   * Add a multifeed object.
   *
   * @param {Types.ObjectId | string} authorId - the ID of the author
   * @param {string} name - the name of the multifeed
   * @param {Array<Types.ObjectId | string>} content - array of users to see content
   * from in the multifeed.
   * @returns {Promise<HydratedDocument<Multifeed>>} - the newly created multifeed object
   */
  static async addOne(
    authorId: Types.ObjectId | string,
    name: string,
    content: Array<Types.ObjectId | string>
  ): Promise<HydratedDocument<Multifeed>> {
    const newMultifeed = new MultifeedModel({
      authorId,
      name,
      content,
    });

    await newMultifeed.save();
    return newMultifeed.populate("content");
  }

  /**
   * Update a multifeed object.
   *
   * @param {Types.ObjectId | string} multifeedId - the ID of the multifeed
   * @param {string} name - the name of the multifeed
   * @param {Array<Types.ObjectId>} content  - the array of users to seen content
   * from in the multifeed.
   * @returns {Promise<HydratedDocument<Multifeed>>} - the updated multifeed object
   */
  static async updateOne(
    multifeedId: Types.ObjectId | string,
    name: string,
    content: Array<Types.ObjectId>
  ): Promise<HydratedDocument<Multifeed>> {
    const multifeed = await MultifeedModel.findOne({ _id: multifeedId });
    multifeed.name = name;
    multifeed.content = content;

    await multifeed.save();
    return multifeed.populate("content");
  }

  /**
   * Delete a multifeed with given multifeedId
   *
   * @param {string} multifeedId - the id of the multifeed to delete
   * @returns {Promise<Boolean>} - true if the multifeed has been deleted, false otherwise
   */
  static async deleteOne(
    multifeedId: Types.ObjectId | string
  ): Promise<boolean> {
    const multifeed = await MultifeedModel.deleteOne({ _id: multifeedId });
    return multifeed !== null;
  }

  /**
   * Get a multifeed with given multifeedId
   *
   * @param {string} multifeedId - the id of the multifeed to delete
   * @returns {Promise<HydratedDocument<Multifeed>>} - the multifeed
   */
  static async getOneById(
    multifeedId: string
  ): Promise<HydratedDocument<Multifeed>> {
    const multifeed = await MultifeedModel.findOne({ _id: multifeedId });
    return multifeed.populate("content");
  }

  /**
   * Get all multifeeds created by a specific author.
   *
   * @param {string} authorId - the Id of the author
   * @returns {Promise<Array<HydratedDocument<Multifeed>>>} - array of multifeeds
   * created by the author with authorId.
   */
  static async getMultifeedByAuthor(
    authorId: string
  ): Promise<Array<HydratedDocument<Multifeed>>> {
    const multifeeds = await MultifeedModel.find({
      authorId: authorId,
    }).populate("content");
    return multifeeds;
  }
}

export default MultifeedCollection;
