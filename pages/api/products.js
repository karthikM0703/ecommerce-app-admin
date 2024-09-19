import { mongooseConnect } from "@/lib/mongoose.js";
import { Product } from "@/models/Product.js";

export default async function handle(req, res) {
  const { method } = req;

  await mongooseConnect();

  if (method === "POST") {
    const { title, description, price,images} = req.body;

    const ProductDoc = await Product.create({
      title,
      description,
      price,
      images
    })
    res.json(ProductDoc);
  }
  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({_id:req.query?.id});
      res.json(true)
    }
  }
}
