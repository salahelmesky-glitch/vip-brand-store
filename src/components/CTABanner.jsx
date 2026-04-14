import { motion } from 'framer-motion';

export default function CTABanner() {
  return (
    <section className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan/5 via-purple/5 to-cyan/5" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[300px] md:h-[400px] rounded-full bg-cyan/4 blur-[160px] md:blur-[200px]" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-cyan font-medium mb-2 md:mb-4 text-glow-cyan"
        >
          Members Only / للأعضاء فقط
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider text-white-95 mb-2"
        >
          Join the Inner Circle
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-lg md:text-2xl ar text-white-60 mb-6 md:mb-8"
        >
          انضم للدائرة الحصرية
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base text-white-60 max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed px-2"
        >
          Unlock early access to exclusive drops and limited-edition pieces.
          <br />
          <span className="ar text-xs md:text-sm">احصل على وصول مبكر للإصدارات الحصرية والقطع المحدودة.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4 sm:px-0"
        >
          <input
            type="email"
            placeholder="Enter your email / أدخل بريدك"
            className="w-full sm:w-80 px-5 py-3.5 md:py-4 rounded-full glass border-white-60/10 text-white-95 text-sm placeholder:text-white-60/50 focus:outline-none focus:border-cyan/40 transition-all duration-300"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 rounded-full bg-gradient-to-r from-cyan to-purple text-obsidian text-xs font-bold tracking-widest uppercase hover:shadow-[0_0_40px_rgba(0,242,255,0.35)] transition-all duration-500"
          >
            Get Access / سجّل الآن
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
