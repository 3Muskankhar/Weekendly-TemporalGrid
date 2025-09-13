'use client';

import { motion } from 'framer-motion';
import {
  Coffee,
  Mountain,
  Film,
  BookOpen,
  Utensils,
  Gamepad2,
  Music,
  Camera,
  ShoppingBag,
  Heart,
  Zap,
  Brain,
  Users,
  Palette,
  CheckCircle,
  Clock,
  XCircle,
  PlayCircle,
  Activity,
  ChefHat,
  Sun,
  Bike,
  Building,
  Flower2,
  Car,
  Dumbbell,
  Book
} from 'lucide-react';

const iconMap = {
  // Activities (with multiple name variations)
  coffee: Coffee,
  hiking: Mountain,
  mountain: Mountain,
  movie: Film,
  film: Film,
  reading: BookOpen,
  book: Book,
  bookopen: BookOpen,
  brunch: Utensils,
  utensils: Utensils,
  gaming: Gamepad2,
  gamepad2: Gamepad2,
  gamepad: Gamepad2,
  music: Music,
  photography: Camera,
  camera: Camera,
  shopping: ShoppingBag,
  shoppingbag: ShoppingBag,
  activity: Activity,
  chefhat: ChefHat,
  chef: ChefHat,
  sun: Sun,
  bike: Bike,
  bicycle: Bike,
  building: Building,
  flower: Flower2,
  flower2: Flower2,
  car: Car,
  dumbbell: Dumbbell,
  workout: Dumbbell,
  gym: Dumbbell,

  // Moods
  happy: Heart,
  heart: Heart,
  energetic: Zap,
  zap: Zap,
  focused: Brain,
  brain: Brain,
  social: Users,
  users: Users,
  creative: Palette,
  palette: Palette,

  // Status
  done: CheckCircle,
  checkcircle: CheckCircle,
  completed: CheckCircle,
  pending: Clock,
  clock: Clock,
  waiting: Clock,
  cancelled: XCircle,
  xcircle: XCircle,
  canceled: XCircle,
  inprogress: PlayCircle,
  playcircle: PlayCircle,
  playing: PlayCircle
};

const Icon = ({
  name,
  size = 20,
  className = '',
  color = 'currentColor',
  animate = false,
  ...props
}) => {
  // Normalize the name to lowercase for case-insensitive matching
  const normalizedName = name?.toLowerCase().replace(/[\s-_]/g, '');
  const IconComponent = iconMap[normalizedName];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconMap));
    // Return a default icon instead of null
    return <Activity size={size} className={className} {...props} />;
  }

  const iconProps = {
    size,
    className: `${className}`,
    style: { color },
    ...props
  };

  if (animate) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <IconComponent {...iconProps} />
      </motion.div>
    );
  }

  return <IconComponent {...iconProps} />;
};

export default Icon;