import prisma from "@/libs/prismadb";

async function test() {
  const products = await prisma.product.findMany();
  console.log("Products:", products);
}

test().catch(console.error);