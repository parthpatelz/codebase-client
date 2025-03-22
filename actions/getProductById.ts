import prisma from "@/libs/prismadb";
import { Prisma } from "@prisma/client";
import { ObjectId } from "mongodb";

interface IParams {
  productId?: string;
}

export default async function getProductById(params: IParams) {
  try {
    const { productId } = params;

    if (!productId || typeof productId !== "string") {
      console.log("Invalid productId provided:", productId);
      return null;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        reviews: {
          include: { user: true },
          orderBy: { createdAt: Prisma.SortOrder.desc },
        },
      },
    });

    if (!product) {
      console.log("Product not found for ID:", productId);
      return null;
    }

    return product;
  } catch (error: any) {
    console.error("🔴 Error fetching product:", error);
    return null;
  }
}