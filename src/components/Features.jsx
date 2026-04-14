import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: 'Premium Craft / حرفية فاخرة',
    desc: 'Each piece is meticulously crafted with premium materials.',
    descAr: 'كل قطعة مصنوعة بعناية من أجود الخامات.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Exclusive Access / وصول حصري',
    desc: 'Limited drops and members-only releases.',
    descAr: 'إصدارات محدودة وحصرية للأعضاء فقط.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'Global Shipping / شحن عالمي',
    desc: 'Seamless worldwide delivery with real-time tracking.',
    descAr: 'توصيل سلس لجميع أنحاء العالم مع تتبع مباشر.',
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className="relative py-20 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={ref} className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-purple font-medium mb-1 text-glow-purple"
          >
            Why VIP
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-[10px] md:text-xs text-white-60 ar mb-3"
          >
            لماذا VIP
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold tracking-wider text-white-95"
          >
            The VIP Standard
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg ar text-white-60 mt-1"
          >
            معيار VIP
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-16 md:w-20 h-[1px] bg-gradient-to-r from-transparent via-purple to-transparent mx-auto mt-4"
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group glass rounded-2xl p-6 md:p-8 text-center hover:border-purple/30 transition-all duration-500 cursor-default"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 md:mb-5 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple group-hover:bg-purple/20 group-hover:border-purple/40 group-hover:shadow-[0_0_30px_rgba(123,47,255,0.2)] transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="font-heading text-xs md:text-sm font-bold tracking-wider text-white-95 mb-2 md:mb-3 group-hover:text-purple transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-white-60 leading-relaxed mb-1">
                {feature.desc}
              </p>
              <p className="text-[11px] md:text-xs text-white-60/70 ar leading-relaxed">
                {feature.descAr}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
