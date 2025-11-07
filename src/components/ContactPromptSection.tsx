import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ContactPromptSection() {
    return (
      <section className="py-16 bg-gradient-to-b from-[#FAF7F2] to-[#E8DCC8]/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Sparkles className="w-12 h-12 text-[#C17B5C] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2C2416] font-serif">Не нашли то, что искали?</h2>
            <p className="text-lg text-[#6B5D4F] mb-8 font-sans">
              Свяжитесь с нами, и мы поможем подобрать идеальное освещение для вашего интерьера
            </p>
            <Link href="/contact" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#C17B5C] text-[#FAF7F2] rounded-lg font-semibold hover:bg-[#A66A4D] transition-all font-sans"
              >
                Связаться с нами
                <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    )
}