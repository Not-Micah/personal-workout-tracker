'use client'

import { useState, useEffect } from 'react'
import WorkoutDetail from './WorkoutDetail'
import NewWorkout from './NewWorkout'
import { Workout } from '@/lib/utils'
import { 
  formatDate, 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  isToday,
  generateArray,
  WORKOUT_CONFIG 
} from '@/lib/utils'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [showNewWorkout, setShowNewWorkout] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts')
      const data = await response.json()
      setWorkouts(data)
    } catch (error) {
      console.error('Error fetching workouts:', error)
    }
  }


  const isWorkoutDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateString = formatDate(date)
    return workouts.some(workout => workout.date.split('T')[0] === dateString)
  }

  const getWorkoutForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateString = formatDate(date)
    return workouts.find(workout => workout.date.split('T')[0] === dateString)
  }

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const workout = getWorkoutForDay(day)
    
    if (workout) {
      setSelectedWorkout(workout)
    } else {
      // Check if there's already a workout on this day (extra safety)
      const dateString = formatDate(clickedDate)
      const existingWorkout = workouts.find(w => w.date.split('T')[0] === dateString)
      
      if (existingWorkout) {
        setSelectedWorkout(existingWorkout)
      } else {
        setSelectedDate(clickedDate)
        setShowNewWorkout(true)
      }
    }
  }

  const handleNewWorkout = () => {
    const today = new Date()
    const todayString = formatDate(today)
    const existingTodaysWorkout = workouts.find(w => w.date.split('T')[0] === todayString)
    
    if (existingTodaysWorkout) {
      setSelectedWorkout(existingTodaysWorkout)
    } else {
      setSelectedDate(today)
      setShowNewWorkout(true)
    }
  }

  const handleWorkoutSaved = () => {
    setShowNewWorkout(false)
    setSelectedDate(null)
    fetchWorkouts()
  }

  const handleCloseModal = () => {
    setSelectedWorkout(null)
    setShowNewWorkout(false)
    setSelectedDate(null)
  }

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square"></div>
      )
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isWorkout = isWorkoutDay(day)
      const isToday = 
        day === new Date().getDate() && 
        currentDate.getMonth() === new Date().getMonth() && 
        currentDate.getFullYear() === new Date().getFullYear()

      days.push(
        <div
          key={day}
          className={`calendar-day ${
            isWorkout ? 'calendar-day-workout' : 'calendar-day-empty'
          } ${
            isToday ? 'calendar-day-today' : ''
          }`}
          onClick={() => isWorkout && handleDayClick(day)}
        >
          <span className="text-sm font-medium">{day}</span>
        </div>
      )
    }

    return days
  }

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigateMonth(-1)}
          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          ←
        </button>
        <h2 className="text-lg font-medium text-gray-900">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          →
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="aspect-square flex items-center justify-center text-xs font-medium text-gray-500 mb-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-12">
        {renderCalendar()}
      </div>

      {/* New Workout Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleNewWorkout}
          className="w-14 h-14 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Modals */}
      {selectedWorkout && (
        <WorkoutDetail
          workout={selectedWorkout}
          onClose={handleCloseModal}
        />
      )}

      {showNewWorkout && selectedDate && (
        <NewWorkout
          date={selectedDate}
          onClose={handleCloseModal}
          onSave={handleWorkoutSaved}
        />
      )}
    </div>
  )
}