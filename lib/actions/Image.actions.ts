"use server";

import { revalidatePath } from "next/cache";
import { connectToMongodb } from "../database/Mongoose";
import { handleError } from "../utils";
import User from "../database/models/User.model";
import Image from "../database/models/Image.model";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";

const populateUser = (query: any) =>
  query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName clerkId",
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

// get all Images
export const getAllImages = async ({
  limit = 9,
  page = 1,
  searchQuery = "",
}: {
  limit?: number;
  page: number;
  searchQuery?: string;
}) => {
  try {
    await connectToMongodb();

    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let expression = "folder=aesthetixai";

    if (searchQuery) {
      expression += ` AND ${searchQuery}`;
    }

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resourceIds = resources.map((resource: any) => resource.public_id);

    let query = {};

    if (searchQuery) {
      query = {
        publicId: {
          $in: resourceIds,
        },
      };
    }

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find(query))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find(query).countDocuments();
    const savedImages = await Image.find().countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    };
  } catch (error) {
    handleError(error);
  }
};

// GET IMAGES BY USER
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    await connectToMongodb();

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find({ author: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find({ author: userId }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
