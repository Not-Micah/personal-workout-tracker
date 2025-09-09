'use client'

import { useState, useEffect } from 'react'
import WorkoutTable from './ui/WorkoutTable'
import { generateEmptyRepsArray, isWorkoutComplete } from '@/lib/utils'

interface Exercise {
  name: string
  sets: number
  weights: number[]
}

interface WorkoutCanvasProps {
  templateName: string
  exercises: Exercise[]
  date: Date
  onSave: () => void
}

interface ExerciseData {
  name: string
  sets: number
  weights: number[]
  reps: number[][]
}

export default function WorkoutCanvas({ templateName, exercises, date, onSave }: WorkoutCanvasProps) {
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([])
  const [previousWorkout, setPreviousWorkout] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    initializeExerciseData()
    fetchPreviousWorkout()
  }, [exercises])

  const initializeExerciseData = () => {
    const initialData = exercises.map(exercise => ({
      name: exercise.name,
      sets: exercise.sets,
      weights: exercise.weights,
      reps: generateEmptyRepsArray(exercise.weights, exercise.sets)
    }))
    setExerciseData(initialData)
  }

  const fetchPreviousWorkout = async () => {
    try {
      const response = await fetch('/api/workouts')
      const workouts = await response.json()
      
      const lastWorkout = workouts.find((workout: any) => 
        workout.templateName === templateName && workout.date !== date.toISOString()
      )

      if (lastWorkout) {
        const formattedWorkout = {
          ...lastWorkout,
          exercises: lastWorkout.exercises.map((exercise: any) => ({
            ...exercise,
            weights: JSON.parse(exercise.weights),
            reps: JSON.parse(exercise.reps),
          })),
        }
        setPreviousWorkout(formattedWorkout)
      }
    } catch (error) {
      console.error('Error fetching previous workout:', error)
    }
  }

  const getPreviousReps = (exerciseName: string, weightIndex: number, setIndex: number) => {
    if (!previousWorkout) return null
    
    const prevExercise = previousWorkout.exercises.find((ex: any) => ex.name === exerciseName)
    if (!prevExercise || !prevExercise.reps[weightIndex] || !prevExercise.reps[weightIndex][setIndex]) {
      return null
    }
    
    return prevExercise.reps[weightIndex][setIndex]
  }

  const updateReps = (exerciseIndex: number, weightIndex: number, setIndex: number, reps: number) => {
    setExerciseData(prev => {
      const newData = [...prev]
      newData[exerciseIndex].reps[weightIndex][setIndex] = reps
      return newData
    })
  }

  const handleSave = async () => {
    setSaving(true)
    
    try {
      const workoutData = {
        date: date.toISOString().split('T')[0],
        templateName,
        exercises: exerciseData.map(exercise => ({
          name: exercise.name,
          sets: exercise.sets,
          weights: exercise.weights,
          reps: exercise.reps,
        }))
      }

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
      })

      if (!response.ok) {
        const error = await response.json()
        if (response.status === 400 && error.error.includes('already exists')) {
          alert('You have already worked out today! Only one workout per day is allowed.')
        } else {
          throw new Error(error.error || 'Failed to save workout')
        }
        return
      }

      onSave()
    } catch (error) {
      console.error('Error saving workout:', error)
      alert(error instanceof Error ? error.message : 'Failed to save workout')
    } finally {
      setSaving(false)
    }
  }

  const isWorkoutCompleteFlag = () => {
    return isWorkoutComplete(exerciseData)
  }


  return (
    <div className="space-y-6 pb-20">
      {exerciseData.map((exercise, exerciseIndex) => (
        <div key={exercise.name} className="workout-exercise-container">
          <div className="workout-exercise-title">
            <h3 className="subheading text-white">{exercise.name}</h3>
          </div>
          
          <div className="p-4">
            <WorkoutTable
              exerciseName={exercise.name}
              sets={exercise.sets}
              weights={exercise.weights}
              reps={exercise.reps}
              previousReps={(weightIndex: number, setIndex: number) => 
                getPreviousReps(exercise.name, weightIndex, setIndex)
              }
              onRepsChange={(weightIndex: number, setIndex: number, reps: number) => 
                updateReps(exerciseIndex, weightIndex, setIndex, reps)
              }
            />
          </div>
        </div>
      ))}

      {/* Save Button - Fixed @ bottom! */}
      <div className="workout-save-button">
        <button
          onClick={handleSave}
          disabled={!isWorkoutCompleteFlag() || saving}
          className={
            isWorkoutCompleteFlag() && !saving
              ? 'workout-save-button-active'
              : 'workout-save-button-disabled'
          }
        >
          {saving ? 'Saving...' : 'Save Workout'}
        </button>
      </div>

      {/* Previous Workout Legend */}
      {previousWorkout && (
        <div className="body-text text-xs text-center py-4 border-t border-gray-200 mx-4">
          <p>
            Previous reps from{' '}
            <span className="font-medium">
              {new Date(previousWorkout.date).toLocaleDateString()}
            </span>
            {' '}shown in light gray
          </p>
        </div>
      )}
    </div>
  )
}