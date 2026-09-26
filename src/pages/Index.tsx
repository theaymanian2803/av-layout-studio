import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bird, Bone, Cat, ChevronRight, Dog, Fish, Headphones, Heart, PackageCheck, PawPrint, Quote, ShieldCheck, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts, DbProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";

const heroImage = "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1800&q=85";
const catPromo = "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1000&q=85";
const dogPromo = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=85";
const collectionBanner = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=85";

const categories = [
  { name: "Dog Food", icon: Dog, tone: "bg-pet-yellow/25" },
  { name: "Cat Food", icon: Cat, tone: "bg-pet-coral/20" },
  { name: "Fish Food", icon: Fish, tone: "bg-primary/15" },
  { name: "Bird Food", icon: Bird, tone: "bg-pet-mint/35" },
  { name: "Treats", icon: Bone, tone: "bg-pet-yellow/25" },
  { name: "Pet Supplies", icon: PawPrint, tone: "bg-pet-coral/20" },
];

const ProductCard = ({ product, index = 0 }: { product: DbProduct; index?: number }) => {
  const { addItem } = useCart();
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.article initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} className="group min-w-[210px] border-r border-border bg-card px-4 py-3 last:border-r-0">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted/40">
          <img src={product.image} alt={product.name} loading="lazy" width={1024} height={1024} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {discount > 0 && <span className="absolute left-2 top-2 rounded bg-pet-yellow px-2 py-1 text-[10px] font-extrabold text-pet-ink">-{discount}%</span>}
          <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border bg-card/90 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"><Heart className="h-4 w-4" /></span>
        </div>
        <p className="mt-3 text-[11px] font-semibold text-muted-foreground">{product.brand}</p>
        <h3 className="mt-1 min-h-10 text-sm font-bold leading-5 text-foreground">{product.name}</h3>
        <div className="mt-2 flex items-center gap-1 text-pet-yellow">
          {[0,1,2,3,4].map((star) => <Star key={star} className="h-3 w-3 fill-current" />)}
          <span className="ml-1 text-[10px] text-muted-foreground">({product.review_count})</span>
        </div>
      </Link>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div><span className="font-extrabold text-primary">${product.price.toFixed(2)}</span>{product.original_price && <span className="ml-2 text-xs text-muted-foreground line-through">${product.original_price.toFixed(2)}</span>}</div>
        <Button size="icon" className="h-8 w-8 rounded-full" onClick={() => addItem(product)} disabled={!product.in_stock} aria-label={`Add ${product.name} to cart`}><PawPrint className="h-4 w-4" /></Button>
      </div>
    </motion.article>
  );
};

const ProductShelf = ({ title, subtitle, products }: { title: string; subtitle: string; products: DbProduct[] }) => (
  <section className="container mx-auto px-4 py-10">
    <div className="mb-6 text-center"><h2 className="text-2xl font-extrabold text-primary md:text-3xl">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div>
    <div className="flex overflow-x-auto rounded-md border bg-card scrollbar-hide">{products.slice(0, 6).map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
  </section>
);

const Index = () => {
  const { data: products = [], isLoading } = useProducts();
  const highlights = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const deals = products.filter((p) => p.original_price).concat(products.filter((p) => !p.original_price));

  return <main className="overflow-hidden bg-background">
    <section className="container mx-auto grid gap-4 px-4 py-4 lg:grid-cols-[1.75fr_1fr]">
      <div className="relative min-h-[390px] overflow-hidden rounded-md bg-primary">
        <img src={heroImage} alt="Happy golden retriever with premium dog food" width={1536} height={960} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/55 to-transparent" />
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 flex min-h-[390px] max-w-md flex-col justify-center p-8 text-primary-foreground md:p-12">
          <span className="mb-3 text-xs font-bold uppercase">Nutrition made with care</span>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">Better bowls.<br />Happier pets.</h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/90">Wholesome food and everyday essentials picked for dogs, cats, fish, birds, and the people who love them.</p>
          <div className="mt-6 flex items-center gap-4"><Button variant="secondary" asChild className="font-bold"><Link to="/catalog">Shop all pets</Link></Button><span className="text-sm"><strong className="text-2xl">20%</strong> off first orders</span></div>
        </motion.div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Link to="/catalog?category=Cat%20Food" className="group relative min-h-[187px] overflow-hidden rounded-md">
          <img src={catPromo} alt="Cat food offer" loading="lazy" width={992} height={672} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-pet-yellow/90 via-pet-yellow/45 to-transparent" /><div className="relative z-10 max-w-[52%] p-6 text-pet-ink"><p className="text-lg font-extrabold">Cat favorites</p><p className="mt-1 text-sm">Up to 25% off</p><p className="mt-4 text-2xl font-extrabold">From $12</p></div>
        </Link>
        <Link to="/catalog?category=Treats" className="group relative min-h-[187px] overflow-hidden rounded-md">
          <img src={dogPromo} alt="Natural dog treats" loading="lazy" width={992} height={672} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-pet-coral/90 via-pet-coral/45 to-transparent" /><div className="relative z-10 max-w-[52%] p-6 text-pet-ink"><p className="text-lg font-extrabold">Treat time</p><p className="mt-1 text-sm">Natural bites they love</p><p className="mt-4 text-2xl font-extrabold">Buy 2, save 15%</p></div>
        </Link>
      </div>
    </section>

    <section className="container mx-auto px-4 py-8"><div className="grid grid-cols-3 gap-4 md:grid-cols-6">{categories.map(({ name, icon: Icon, tone }, index) => <motion.div key={name} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * .06 }}><Link to={`/catalog?category=${encodeURIComponent(name)}`} className="group flex flex-col items-center gap-3 text-center"><span className={`flex aspect-square w-full max-w-28 items-center justify-center rounded-full ${tone} transition-transform group-hover:-translate-y-1`}><Icon className="h-10 w-10 text-primary md:h-12 md:w-12" /></span><span className="text-xs font-bold md:text-sm">{name}</span></Link></motion.div>)}</div></section>

    {isLoading ? <div className="py-20 text-center text-muted-foreground">Preparing the pantry…</div> : <><ProductShelf title="This Week’s Highlights" subtitle="Wholesome favorites chosen for happy, healthy pets." products={highlights} /><ProductShelf title="Best Selling Items" subtitle="The treats, meals, and essentials pet parents return for." products={deals} /></>}

    <section className="container mx-auto grid gap-4 px-4 py-8 md:grid-cols-2">
      <Link to="/catalog?category=Dog%20Food" className="relative min-h-[270px] overflow-hidden rounded-md bg-pet-mint/40"><img src={collectionBanner} alt="Pet food collection" loading="lazy" width={1536} height={720} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-pet-mint via-pet-mint/80 to-transparent" /><div className="relative z-10 max-w-[50%] p-8"><p className="text-2xl font-extrabold">Everyday nutrition, thoughtfully made</p><p className="mt-2 text-sm">Save up to 30%</p><Button size="sm" className="mt-5">Shop food</Button></div></Link>
      <Link to="/catalog?category=Treats" className="relative min-h-[270px] overflow-hidden rounded-md bg-pet-coral/30"><img src={dogPromo} alt="Dog treat collection" loading="lazy" width={992} height={672} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-pet-coral via-pet-coral/80 to-transparent" /><div className="relative z-10 max-w-[50%] p-8"><p className="text-2xl font-extrabold">Buy one, get one on treats</p><p className="mt-2 text-sm">Weekend offer</p><Button size="sm" className="mt-5">Shop treats</Button></div></Link>
    </section>

    <section className="container mx-auto px-4 py-10"><div className="mb-6 text-center"><h2 className="text-2xl font-extrabold text-primary">Shop By Departments</h2></div><div className="grid gap-4 md:grid-cols-4">{["Newest", "Featured", "On Sale", "Best Selling"].map((label, col) => <div key={label} className="rounded-md border bg-card p-4"><h3 className="mb-4 border-b pb-3 text-center text-sm font-extrabold">{label}</h3>{products.slice(col * 2, col * 2 + 3).map((p) => <Link key={p.id} to={`/product/${p.id}`} className="flex gap-3 border-b py-3 last:border-0"><img src={p.image} alt="" loading="lazy" width={64} height={64} className="h-16 w-16 object-cover" /><span className="min-w-0"><span className="line-clamp-2 text-xs font-bold">{p.name}</span><span className="mt-1 block text-sm font-extrabold text-primary">${p.price.toFixed(2)}</span></span></Link>)}</div>)}</div></section>

    <section className="border-y bg-card"><div className="container mx-auto grid grid-cols-2 gap-6 px-4 py-7 md:grid-cols-4">{[[Truck,"Free Shipping","On orders over $75"],[PackageCheck,"Easy Returns","30-day returns"],[Headphones,"Pet Expert Help","Seven days a week"],[ShieldCheck,"Secure Payment","PayPal protected"]].map(([Icon,title,text]) => { const FeatureIcon = Icon as typeof Truck; return <div key={title as string} className="flex items-center gap-3"><FeatureIcon className="h-8 w-8 text-primary" /><div><p className="text-sm font-extrabold">{title as string}</p><p className="text-xs text-muted-foreground">{text as string}</p></div></div>})}</div></section>

    <section className="container mx-auto px-4 py-12"><div className="mb-7 text-center"><h2 className="text-2xl font-extrabold text-primary">What Our Customers Say</h2></div><div className="grid gap-5 md:grid-cols-3">{[["Jamie Doe","My senior dog is excited for mealtime again. The ingredient notes made choosing simple."],["David Miller","Fast delivery, thoughtful packaging, and the treats were an immediate favorite."],["Rachel Kim","Everything for my cat and fish in one place, with prices that make sense."]].map(([name,text]) => <article key={name} className="relative rounded-md border bg-card p-6"><Quote className="absolute right-5 top-5 h-8 w-8 text-primary/20" /><div className="mb-4 flex text-pet-yellow">{[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}</div><p className="text-sm leading-6 text-muted-foreground">“{text}”</p><p className="mt-5 text-sm font-extrabold">{name}</p><p className="text-xs text-muted-foreground">Verified pet parent</p></article>)}</div></section>

    <section className="bg-primary text-primary-foreground"><div className="container mx-auto flex flex-col items-center justify-between gap-5 px-4 py-8 md:flex-row"><div><p className="text-xl font-extrabold">Join the PetPaw pack</p><p className="text-sm text-primary-foreground/80">Get $20 off your first order and practical pet-care notes.</p></div><form className="flex w-full max-w-lg"><input type="email" aria-label="Email address" placeholder="Your email address" className="h-11 flex-1 rounded-l-md border-0 bg-card px-4 text-sm text-foreground outline-none" /><Button type="submit" variant="secondary" className="h-11 rounded-l-none bg-pet-yellow text-pet-ink hover:bg-pet-yellow/90">Subscribe</Button></form></div></section>
  </main>;
};

export default Index;