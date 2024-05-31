"use server";

import { revalidatePath } from "next/cache";
import { connectToMongodb } from "../database/Mongoose";
import { handleError } from "../utils";
import User from "../database/models/User.model";
import Image from "../database/models/Image.model";
import { redirect } from "next/navigation";

const populateUser = (query: any) =>
  query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName",
  });

//add image
export const addImage = async ({ image, userId, path }: AddImageParams) => {
  try {
    await connectToMongodb();

    const author = await User.findById(userId);

    if (!author) {
      throw new Error("User not found");
    }

    const newImage = await Image.create({
      ...image,
      author: author._id,
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
};

//update image
export const updateImage = async ({
  image,
  userId,
  path,
}: UpdateImageParams) => {
  try {
    await connectToMongodb();

    const imageToUpadte = await Image.findById(image._id);

    if (!imageToUpadte || imageToUpadte.author.toHexString() !== userId) {
      throw new Error("Your image not found");
    }

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpadte._id,
      image,
      { new: true }
    );

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
};

//delete image
export const deleteImagebyId = async (imageId: string) => {
  try {
    await connectToMongodb();

    const imageToDelete = await Image.findById(imageId);
    if (!imageToDelete) {
      throw new Error("Your image not found");
    }

    await Image.findByIdAndDelete(imageToDelete._id);
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
};

//get Image by ID
export const getImageById = async (imageId: string) => {
  try {
    await connectToMongodb();

    const image = await populateUser(Image.findById(imageId));

    if (!image) {
      throw new Error("Your image not found");
    }

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
};
