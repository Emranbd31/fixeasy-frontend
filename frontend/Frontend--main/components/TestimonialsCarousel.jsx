'use client'

import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-fade'

export function TestimonialsCarousel({ testimonials }) {
  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      effect="fade"
      loop
      className="rounded-2xl bg-slate-900 p-10 text-white shadow-brand-card dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
    >
      {testimonials.map((testimonial) => (
        <SwiperSlide key={testimonial.name}>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-xl leading-relaxed">“{testimonial.quote}”</p>
            <footer className="text-sm text-slate-200">
              <p className="font-semibold text-white">{testimonial.name}</p>
              <p>{testimonial.role}</p>
            </footer>
          </motion.blockquote>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
