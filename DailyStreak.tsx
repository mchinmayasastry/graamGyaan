import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface DailyStreakProps {
  streakCount: number;
  className?: string;
}

export function DailyStreak({ streakCount, className = "" }: DailyStreakProps) {
  // Determine streak milestone and colors
  const getStreakStyle = (count: number) => {
    if (count >= 100) return { color: 'text-purple-600', bgColor: 'bg-purple-50', badgeColor: 'bg-purple-600' };
    if (count >= 50) return { color: 'text-blue-600', bgColor: 'bg-blue-50', badgeColor: 'bg-blue-600' };
    if (count >= 30) return { color: 'text-green-600', bgColor: 'bg-green-50', badgeColor: 'bg-green-600' };
    if (count >= 7) return { color: 'text-orange-600', bgColor: 'bg-orange-50', badgeColor: 'bg-orange-600' };
    return { color: 'text-red-600', bgColor: 'bg-red-50', badgeColor: 'bg-red-600' };
  };

  const getStreakTitle = (count: number) => {
    if (count >= 100) return "Legendary Streak! 🏆";
    if (count >= 50) return "Epic Streak! ⭐";
    if (count >= 30) return "Amazing Streak! 💫";
    if (count >= 7) return "Great Streak! ✨";
    if (count >= 3) return "Building Momentum! 💪";
    return "Getting Started! 🚀";
  };

  const getMotivationalText = (count: number) => {
    if (count >= 100) return "You're absolutely unstoppable!";
    if (count >= 50) return "You're on fire! Keep it burning!";
    if (count >= 30) return "Incredible dedication!";
    if (count >= 7) return "You're building an amazing habit!";
    if (count >= 3) return "Great momentum, keep going!";
    return "Every day counts!";
  };

  const style = getStreakStyle(streakCount);

  return (
    <Card className={`p-6 ${style.bgColor} border-2 ${style.color.replace('text-', 'border-')} transition-all duration-300 hover:shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`${style.color} font-semibold`}>
          {getStreakTitle(streakCount)}
        </h3>
        <Badge className={`${style.badgeColor} text-white`}>
          Day {streakCount}
        </Badge>
      </div>
      
      <div className="flex items-center justify-center mb-4 bg-[rgba(221,37,37,0)] p-[20px] rounded-[109px]">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-6xl mr-4"
        >
          🔥
        </motion.div>
        
        <div className="text-center rounded-[200px]">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`text-4xl font-bold ${style.color}`}
          >
            {streakCount}
          </motion.div>
          <p className={`text-sm ${style.color} opacity-80`}>
            {streakCount === 1 ? 'day' : 'days'} in a row
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className={`text-sm ${style.color} opacity-90 mb-3`}>
          {getMotivationalText(streakCount)}
        </p>
        
        {/* Progress bar for next milestone */}
        <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${(() => {
                if (streakCount >= 100) return 100;
                if (streakCount >= 50) return ((streakCount - 50) / 50) * 100;
                if (streakCount >= 30) return ((streakCount - 30) / 20) * 100;
                if (streakCount >= 7) return ((streakCount - 7) / 23) * 100;
                return (streakCount / 7) * 100;
              })()}%`
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full ${style.badgeColor} rounded-full`}
          />
        </div>
        
        <p className={`text-xs ${style.color} opacity-70 mt-2`}>
          {(() => {
            if (streakCount >= 100) return "You've reached the ultimate milestone!";
            if (streakCount >= 50) return `${100 - streakCount} days to Legendary status`;
            if (streakCount >= 30) return `${50 - streakCount} days to Epic status`;
            if (streakCount >= 7) return `${30 - streakCount} days to Amazing status`;
            return `${7 - streakCount} days to Great status`;
          })()}
        </p>
      </div>

      {/* Celebration particles for milestones */}
      {[7, 30, 50, 100].includes(streakCount) && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0,
                y: 50,
                x: Math.random() * 100 - 50,
                scale: 0
              }}
              animate={{ 
                opacity: [0, 1, 0],
                y: -100,
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute bottom-0 left-1/2 text-yellow-400"
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}