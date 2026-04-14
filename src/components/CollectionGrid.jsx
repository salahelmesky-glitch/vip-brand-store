import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const products = [
  { id: 1, name: 'Obsidian Phantom Hoodie', price: '$289', tag: 'New', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=750&fit=crop' },
  { id: 2, name: 'Neon Edge Cargo Pants', price: '$245', tag: 'Hot', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop' },
  { id: 3, name: 'Cyber Luxe Bomber', price: '$399', tag: 'Limited', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop' },
  { id: 4, name: 'Eclipse Stealth Tee', price: '$149', tag: null, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop' },
  { id: 5, name: 'Midnight Apex Jacket', price: '$459', tag: 'Exclusive', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=750&fit=crop' },
  { id: 6, name: 'Void Runner Sneakers', price: '$329', tag: 'New', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop' },
];

function ProductCard({ product, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl overflow-hidden glass hover:border-cyan/30 transition-all duration-500 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Tag badge */}
        {product.tag && (
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-cyan/15 border border-cyan/30 text-cyan backdrop-blur-sm">
            {product.tag}
          </div>
        )}

        {/* Quick view button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full glass border-cyan/30 text-cyan text-xs font-semibold tracking-widest uppercase hover:bg-cyan/10 transition-all duration-300"
          >
            Quick View
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-sm font-semibold text-white-95 tracking-wider mb-1 group-hover:text-cyan transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-lg font-heading font-bold text-cyan text-glow-cyan">
          {product.price}
        </p>
      </div>
    </motion.div>
  );
}

export default function CollectionGrid() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  return (
    <section id="collection" className="relative py-28 md:py-36 px-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-purple/4 blur-[150px]" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.4em] uppercase text-cyan font-medium mb-3"
          >
            Summer 2026
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-3xl md:text-5xl font-bold tracking-wider text-white-95"
          >
            New Collection
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan to-transparent mx-auto mt-5"
          />
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <a
            href="#"
            className="inline-block px-10 py-4 rounded-full border border-cyan/20 text-cyan text-xs font-semibold tracking-widest uppercase hover:bg-cyan/5 hover:border-cyan/40 hover:glow-cyan transition-all duration-500"
          >
            View All Products
          </a>
        </motion.div>
      </div>
    </section>
  );
}
