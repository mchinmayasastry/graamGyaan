import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Heart, 
  Zap, 
  Target, 
  Clock, 
  Trophy, 
  RotateCcw, 
  Star, 
  Flame, 
  Shield,
  Sparkles,
  GamepadIcon
} from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface PowerUp {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  uses: number;
}

interface GameQuizProps {
  questions: Question[];
  title: string;
}

export function GameQuiz({ questions, title }: GameQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([
    {
      id: 'fifty-fifty',
      name: '50/50',
      icon: <Target className="h-4 w-4" />,
      description: 'Remove 2 wrong answers',
      uses: 2
    },
    {
      id: 'extra-time',
      name: '+10s',
      icon: <Clock className="h-4 w-4" />,
      description: 'Add 10 seconds',
      uses: 1
    },
    {
      id: 'shield',
      name: 'Shield',
      icon: <Shield className="h-4 w-4" />,
      description: 'Protect from losing a life',
      uses: 1
    }
  ]);
  const [removedOptions, setRemovedOptions] = useState<number[]>([]);
  const [shieldActive, setShieldActive] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const multiplier = currentQuestion?.difficulty === 'hard' ? 3 : currentQuestion?.difficulty === 'medium' ? 2 : 1;

  // Safety check
  if (!currentQuestion && gameStarted && !gameOver && !gameWon) {
    setGameWon(true);
    return null;
  }

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameOver || showFeedback) {
      return;
    }

    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, gameOver, showFeedback, gameWon]);

  const handleTimeUp = () => {
    if (showFeedback || gameOver || gameWon) return;
    
    setShowFeedback(true);
    setIsCorrect(false);
    setSelectedAnswer(null);
    
    if (shieldActive) {
      setShieldActive(false);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      
      if (newLives <= 0) {
        setTimeout(() => setGameOver(true), 1500);
        return;
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(20);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (showFeedback || removedOptions.includes(optionIndex) || gameOver || gameWon) return;
    
    setSelectedAnswer(optionIndex);
    const correct = optionIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const points = (100 * multiplier) + (streak * 10);
      setScore(prev => prev + points);
      const newStreak = streak + 1;
      setStreak(newStreak);
      checkAchievements(newStreak, score + points);
    } else {
      if (shieldActive) {
        setShieldActive(false);
      } else {
        const newLives = lives - 1;
        setLives(newLives);
        setStreak(0);
        
        if (newLives <= 0) {
          setTimeout(() => setGameOver(true), 1500);
          return;
        }
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(20);
      setRemovedOptions([]);
    } else {
      setGameWon(true);
    }
  };

  const handleNextQuestion = () => {
    if (lives <= 0) {
      setGameOver(true);
    } else {
      nextQuestion();
    }
  };

  const checkAchievements = (currentStreak: number, currentScore: number) => {
    const newAchievements = [];
    
    if (currentStreak === 3 && !achievements.includes('streak-3')) {
      newAchievements.push('streak-3');
      setShowAchievement('🔥 Hot Streak! 3 in a row!');
    }
    if (currentStreak === 5 && !achievements.includes('streak-5')) {
      newAchievements.push('streak-5');
      setShowAchievement('🚀 On Fire! 5 in a row!');
    }
    if (currentScore >= 500 && !achievements.includes('score-500')) {
      newAchievements.push('score-500');
      setShowAchievement('💎 High Scorer! 500+ points!');
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  const usePowerUp = (powerUpId: string) => {
    if (showFeedback || gameOver || gameWon) return;
    
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (!powerUp || powerUp.uses <= 0) return;

    switch (powerUpId) {
      case 'fifty-fifty':
        if (!currentQuestion) return;
        const wrongAnswers = currentQuestion.options
          .map((_, index) => index)
          .filter(index => index !== currentQuestion.correctAnswer);
        const toRemove = wrongAnswers.slice(0, 2);
        setRemovedOptions(toRemove);
        break;
      case 'extra-time':
        setTimeLeft(prev => Math.min(prev + 10, 99));
        break;
      case 'shield':
        setShieldActive(true);
        break;
    }

    setPowerUps(prev => prev.map(p => 
      p.id === powerUpId ? { ...p, uses: p.uses - 1 } : p
    ));
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setLives(3);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setGameStarted(false);
    setGameOver(false);
    setGameWon(false);
    setTimeLeft(20);
    setAchievements([]);
    setRemovedOptions([]);
    setShieldActive(false);
    setPowerUps([
      {
        id: 'fifty-fifty',
        name: '50/50',
        icon: <Target className="h-4 w-4" />,
        description: 'Remove 2 wrong answers',
        uses: 2
      },
      {
        id: 'extra-time',
        name: '+10s',
        icon: <Clock className="h-4 w-4" />,
        description: 'Add 10 seconds',
        uses: 1
      },
      {
        id: 'shield',
        name: 'Shield',
        icon: <Shield className="h-4 w-4" />,
        description: 'Protect from losing a life',
        uses: 1
      }
    ]);
  };

  // Start Screen
  if (!gameStarted) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6"
          >
            <GamepadIcon className="h-20 w-20 mx-auto text-purple-600" />
          </motion.div>
          
          <h1 className="mb-4 text-purple-700">{title}</h1>
          <p className="text-purple-600 mb-6">
            Test your knowledge in this exciting quiz game! You have 3 lives and 20 seconds per question.
            Use power-ups wisely and build up your streak for bonus points!
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg border">
              <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm text-gray-600">3 Lives</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-sm text-gray-600">Power-ups</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-sm text-gray-600">Achievements</p>
            </div>
          </div>
          
          <Button onClick={startGame} size="lg" className="px-12 bg-purple-600 hover:bg-purple-700">
            <GamepadIcon className="h-5 w-5 mr-2" />
            Start Game
          </Button>
        </Card>
      </motion.div>
    );
  }

  // Game Over Screen
  if (gameOver || gameWon) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <Card className={`p-8 ${gameWon ? 'bg-gradient-to-br from-green-50 to-yellow-50 border-green-200' : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200'}`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-6"
          >
            {gameWon ? (
              <Trophy className="h-20 w-20 mx-auto text-yellow-500" />
            ) : (
              <Heart className="h-20 w-20 mx-auto text-red-500" />
            )}
          </motion.div>
          
          <h2 className={`mb-4 ${gameWon ? 'text-green-700' : 'text-red-700'}`}>
            {gameWon ? 'Congratulations! 🎉' : 'Game Over 💔'}
          </h2>
          
          <div className="mb-6">
            <div className="text-4xl mb-2 font-bold">{score}</div>
            <p className="text-gray-600">Final Score</p>
            {streak > 0 && (
              <Badge className="mt-2 bg-orange-500">
                <Flame className="h-4 w-4 mr-1" />
                {streak} Streak
              </Badge>
            )}
          </div>
          
          {achievements.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-gray-700">Achievements Unlocked</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {achievements.map(achievement => (
                  <Badge key={achievement} variant="outline" className="bg-yellow-50">
                    <Star className="h-3 w-3 mr-1" />
                    {achievement.includes('streak') ? 'Streak Master' : 'High Scorer'}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <Button onClick={resetGame} size="lg" className="px-8">
            <RotateCcw className="h-5 w-5 mr-2" />
            Play Again
          </Button>
        </Card>
      </motion.div>
    );
  }

  // Game Screen
  return (
    <div className="max-w-4xl mx-auto">
      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>{showAchievement}</span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Header */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Lives */}
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={lives <= i ? { scale: [1, 0.5, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Heart 
                    className={`h-6 w-6 ${lives > i ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
                  />
                </motion.div>
              ))}
              {shieldActive && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Shield className="h-6 w-6 text-blue-500 fill-blue-500" />
                </motion.div>
              )}
            </div>
            
            {/* Score */}
            <Badge variant="outline" className="text-lg px-3 py-1">
              <Trophy className="h-4 w-4 mr-1" />
              {score}
            </Badge>
            
            {/* Streak */}
            {streak > 0 && (
              <Badge className="bg-orange-500 text-lg px-3 py-1">
                <Flame className="h-4 w-4 mr-1" />
                {streak}
              </Badge>
            )}
          </div>
          
          {/* Timer */}
          <div className="flex items-center gap-2">
            <Clock className={`h-5 w-5 ${timeLeft <= 5 ? 'text-red-500' : 'text-blue-500'}`} />
            <span className={`text-lg font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-blue-500'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mb-3" />
        
        {/* Power-ups */}
        <div className="flex gap-2">
          {powerUps.map(powerUp => (
            <motion.button
              key={powerUp.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => usePowerUp(powerUp.id)}
              disabled={powerUp.uses <= 0 || showFeedback}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                powerUp.uses > 0 && !showFeedback
                  ? 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {powerUp.icon}
              <span className="text-sm">{powerUp.name}</span>
              <Badge variant="outline" className="text-xs">
                {powerUp.uses}
              </Badge>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-700">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h3>
              <Badge 
                variant={currentQuestion.difficulty === 'hard' ? 'destructive' : 
                        currentQuestion.difficulty === 'medium' ? 'secondary' : 'outline'}
              >
                {currentQuestion.difficulty.toUpperCase()} (×{multiplier})
              </Badge>
            </div>
            
            <h2 className="mb-8 text-slate-700">{currentQuestion.question}</h2>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => {
                const isRemoved = removedOptions.includes(index);
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentQuestion.correctAnswer;
                
                return (
                  <motion.button
                    key={index}
                    whileHover={!showFeedback && !isRemoved ? { scale: 1.02 } : {}}
                    whileTap={!showFeedback && !isRemoved ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showFeedback || isRemoved}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      isRemoved 
                        ? 'opacity-30 border-gray-200 bg-gray-100 cursor-not-allowed' 
                        : showFeedback
                        ? isCorrectAnswer
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : isSelected
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-gray-50'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        showFeedback && isCorrectAnswer
                          ? 'border-green-500 bg-green-500'
                          : showFeedback && isSelected && !isCorrectAnswer
                          ? 'border-red-500 bg-red-500'
                          : isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {showFeedback && isCorrectAnswer && <span className="text-white text-sm">✓</span>}
                        {showFeedback && isSelected && !isCorrectAnswer && <span className="text-white text-sm">✗</span>}
                        {!showFeedback && isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-6 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {isCorrect ? (
                      <div className="flex items-center gap-2 text-green-700">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          ✅
                        </motion.div>
                        <span className="text-lg">Correct! +{100 * multiplier + (streak * 10)} points</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-700">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          ❌
                        </motion.div>
                        <span className="text-lg">
                          {selectedAnswer === null ? 'Time\'s up!' : shieldActive ? 'Shield protected you!' : 'Wrong answer!'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Correct answer highlight */}
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm mb-1">
                      <strong>Correct Answer:</strong>
                    </p>
                    <p className="text-blue-700">{currentQuestion.options[currentQuestion.correctAnswer]}</p>
                  </div>
                  
                  {/* Explanation */}
                  {currentQuestion.explanation && (
                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-800 text-sm mb-1">
                        <strong>Explanation:</strong>
                      </p>
                      <p className="text-gray-700 text-sm">{currentQuestion.explanation}</p>
                    </div>
                  )}
                  
                  {/* Next Button */}
                  <div className="flex justify-center pt-2">
                    <Button 
                      onClick={handleNextQuestion}
                      className="px-8 py-2"
                    >
                      {currentQuestionIndex >= questions.length - 1 ? 'Finish Game' : 'Next Question'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}