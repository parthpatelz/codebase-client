import prisma from "@/libs/prismadb"; // If using Prisma

const getAllProducts = async () => {
  try {
    return await prisma.product.findMany(); // Fetch all products
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getAllProducts;