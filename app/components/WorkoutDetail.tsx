'use client'

import WorkoutTable from './ui/WorkoutTable'
import { parseExerciseData, formatDateForDisplay, Workout } from '@/lib/utils'

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
              <h2 className="subheading">{workout.templateName}</h2>
              <p className="body-text text-xs">{formatDateForDisplay(workout.date)}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200 ease-out hover:bg-gray-50 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Exercises */}
          {workout.exercises.map((exercise) => {
            const parsedExercise = parseExerciseData(exercise)
            return (
              <div key={exercise.id} className="workout-exercise-container">
                <div className="workout-exercise-title">
                  <h3 className="subheading text-white">{exercise.name}</h3>
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

        </div>
      </div>
    </div>
  )
}