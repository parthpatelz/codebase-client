import prisma from "@/libs/prismadb";

export interface IProductParams {
  category?: string | null;
  searchTerm?: string | null;
}

export default async function getProducts(params: IProductParams) {
  try {
    console.log("Fetching products with params:", params);

    const { category, searchTerm } = params;
    const searchString = searchTerm ?? "";

    let query: any = {};
    if (category) query.category = category;

    console.log("Query before Prisma fetch:", JSON.stringify(query, null, 2));

    const products = await prisma.product.findMany({
      where: {
        ...query,
        OR: [
          { name: { contains: searchString, mode: "insensitive" } },
          { description: { contains: searchString, mode: "insensitive" } },
        ],
      },
    });

    console.log("Fetched products:", products);
    return products;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    throw new Error(`Error fetching products: ${error.message}`);
  }
}
