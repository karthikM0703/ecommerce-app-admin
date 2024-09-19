import Product from "@/components/Product";



export default function NewProduct() {
  return (
    <>
      <div className="sm-flex sm:items-center sm:justify-between">
        <div className="text-center sm:text-left">
          <p className="mt-1.5 text-sm text-gray-500">
            Let's create new products!
          </p>
        </div>
      </div>
      <hr class="h-px border-0 bg-gray-300" />
      <div className="my-10">
        <Product />
      </div>
    </>
  );
}
