import { useParams, Link } from "react-router-dom";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ShoppingCart, ChevronLeft, Star, Check, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || "");
  const { data: allProducts = [] } = useProducts();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button asChild><Link to="/catalog">Back to Catalog</Link></Button>
      </div>
    );
  }

  const compatible = allProducts.filter(p => product.compatible_ids.includes(p.id));
  const specs = typeof product.specs === "object" && product.specs !== null ? product.specs as Record<string, string> : {};

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Link to="/catalog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Catalog
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-3">
              <img src={product.images[selectedImage] || product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-16 h-16 rounded-md overflow-hidden border-2 ${i === selectedImage ? "border-primary" : "border-transparent"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <p className="text-sm text-muted-foreground">{product.brand} · {product.category}</p>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "text-accent fill-accent" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.review_count})</span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-accent">${product.price.toLocaleString()}</span>
              {product.original_price && <span className="text-lg text-muted-foreground line-through">${product.original_price.toLocaleString()}</span>}
            </div>

            <div className="flex items-center gap-2 mt-3">
              {product.in_stock ? (
                <Badge variant="outline" className="border-green-500/30 text-green-500"><Check className="h-3 w-3 mr-1" /> In Stock ({product.stock_count})</Badge>
              ) : (
                <Badge variant="destructive"><X className="h-3 w-3 mr-1" /> Out of Stock</Badge>
              )}
            </div>

            <p className="text-muted-foreground mt-4">{product.description}</p>

            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQty(Math.max(1, qty - 1))}>-</Button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQty(qty + 1)}>+</Button>
              </div>
              <Button size="lg" className="flex-1" onClick={() => addItem(product as any, qty)} disabled={!product.in_stock}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
              </Button>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-3">Technical Specifications</h3>
              <Table>
                <TableBody>
                  {Object.entries(specs).map(([key, val]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium text-muted-foreground w-1/3">{key}</TableCell>
                      <TableCell>{val}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </div>

        {compatible.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Compatible Accessories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {compatible.map(cp => (
                <Link key={cp.id} to={`/product/${cp.id}`} className="group block rounded-lg border bg-card overflow-hidden hover:border-primary/30 transition-colors">
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img src={cp.image} alt={cp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground">{cp.brand}</p>
                    <p className="text-sm font-medium truncate">{cp.name}</p>
                    <span className="text-accent font-bold text-sm">${cp.price.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
