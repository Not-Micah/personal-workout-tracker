// Workout App Utilities and Constants

// Constants
export const WORKOUT_CONFIG = {
  SETS_PER_ROW: 5,
  DAYS_OF_WEEK: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  DAYS_OF_WEEK_FULL: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
} as const

// Type definitions
export interface Exercise {
  id: string
  name: string
  sets: number
  weights: string | number[]
  reps: string | number[][]
}

export interface Workout {
  id: string
  date: string
  templateName: string
  exercises: Exercise[]
}

export interface WorkoutTemplate {
  [key: string]: {
    name: string
    sets: number
    weights: number[]
  }[]
}

// Date utilities
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const formatDateForDisplay = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Calendar utilities
export const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

export const isToday = (day: number, currentDate: Date): boolean => {
  const today = new Date()
  return day === today.getDate() && 
         currentDate.getMonth() === today.getMonth() && 
         currentDate.getFullYear() === today.getFullYear()
}

// Workout utilities
export const parseExerciseData = (exercise: Exercise) => {
  const weights = typeof exercise.weights === 'string' ? JSON.parse(exercise.weights) : exercise.weights
  const reps = typeof exercise.reps === 'string' ? JSON.parse(exercise.reps) : exercise.reps
  return { ...exercise, weights, reps }
}

export const formatWeight = (weight: number): string => {
  return weight === 0 ? 'BW' : `${weight}lbs`
}

export const isWorkoutComplete = (exerciseData: any[]): boolean => {
  return exerciseData.some(exercise => 
    exercise.reps.some((weightReps: number[]) => 
      weightReps.some((reps: number) => reps > 0)
    )
  )
}

// Array generation utilities
export const generateArray = (length: number) => Array.from({ length }, (_, i) => i)

export const generateEmptyRepsArray = (weights: number[], sets: number): number[][] => {
  return weights.map(() => Array(sets).fill(0))
}

// Grid utilities
export const getGridColumns = (count: number): string => {
  return `80px repeat(${count}, 1fr)`
}

export const getAlternatingRowClass = (index: number): string => {
  return index % 2 === 0 ? 'workout-table-row-even' : 'workout-table-row-odd'
}