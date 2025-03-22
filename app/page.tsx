import Container from "@/app/components/Container";
import Link from "next/link";
import getAllProducts from "@/actions/getAllProducts";
import NullData from "@/app/components/NullData";

const Home = async ({ searchParams }: { searchParams: { category?: string } }) => {
  const products = await getAllProducts();

  // Get the category from URL
  const selectedCategory = searchParams.category;

  // Filter products if category exists
  const filteredProducts = selectedCategory
  ? products.filter((product) => 
      product.category.toLowerCase() === selectedCategory.toLowerCase()
    )
  : products;


  if (!filteredProducts || filteredProducts.length === 0) {
    return <NullData title="No products available in this category." />;
  }

  return (
    <div className="p-8">
      <Container>
        <h1 className="text-3xl font-bold mb-6">Welcome to Our Store</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const productImage = product.images.length > 0 ? product.images[0].image : "/placeholder.jpg";

            return (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="border rounded-lg p-4 shadow-lg cursor-pointer hover:shadow-xl transition">
                  <img
                    src={productImage}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                  <p className="text-gray-600">${product.price}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default Home;
