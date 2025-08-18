import { motion } from 'framer-motion'

const bubbles = Array.from({ length: 8 }).map((_, index) => ({
  id: index,
  size: 120 + Math.random() * 160,
  left: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 8 + Math.random() * 6
}))

const AnimatedBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {bubbles.map(({ id, size, left, delay, duration }) => (
        <motion.div
          key={id}
          initial={{ opacity: 0.15, y: 20 }}
          animate={{ opacity: 0.25, y: -20 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', duration, delay }}
          className="absolute rounded-full blur-3xl"
          style={{ width: size, height: size, left: `${left}%`, top: `${(id % 4) * 25}%`, background: id % 2 ? 'rgba(239,77,50,0.20)' : 'rgba(255,244,232,0.18)' }}
        />
      ))}
    </div>
  )
}

export default AnimatedBackground 