'use client'

import WorkoutTable from './ui/WorkoutTable'
import { parseExerciseData, formatDateForDisplay, Exercise, Workout } from '@/lib/utils'

interface WorkoutDetailProps {
  workout: Workout
  onClose: () => void
}

export default function WorkoutDetail({ workout, onClose }: WorkoutDetailProps) {

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="workout-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">{workout.templateName}</h2>
              <p className="text-xs text-gray-500">{formatDateForDisplay(workout.date)}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Exercises */}
          {workout.exercises.map((exercise, exerciseIndex) => {
            const parsedExercise = parseExerciseData(exercise)
            return (
              <div key={exercise.id} className="workout-exercise-container">
                <div className="workout-exercise-title">
                  <h3 className="text-base font-medium text-white">{exercise.name}</h3>
                </div>
                
                <div className="p-4">
                  <WorkoutTable
                    exerciseName={exercise.name}
                    sets={exercise.sets}
                    weights={parsedExercise.weights}
                    reps={parsedExercise.reps}
                    readOnly={true}
                  />
                </div>
              </div>
            )
          })}

          {/* Summary Stats */}
          <div className="border border-gray-100 rounded-lg p-4 mt-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Exercises</p>
                <p className="text-lg font-medium text-gray-900">{workout.exercises.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Sets</p>
                <p className="text-lg font-medium text-gray-900">
                  {workout.exercises.reduce((total, exercise) => {
                    const parsedExercise = parseExerciseData(exercise)
                    return total + parsedExercise.weights.reduce((exerciseTotal, _, weightIndex) => {
                      return exerciseTotal + (parsedExercise.reps[weightIndex]?.filter(rep => rep > 0).length || 0)
                    }, 0)
                  }, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}