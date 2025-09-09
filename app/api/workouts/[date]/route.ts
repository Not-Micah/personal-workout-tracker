import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params
    const workout = await prisma.workout.findUnique({
      where: {
        date: new Date(date),
      },
      include: {
        exercises: true,
      },
    })

    if (!workout) {
      return NextResponse.json(
        { error: 'Workout not found' },
        { status: 404 }
      )
    }

    const formattedWorkout = {
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        weights: JSON.parse(exercise.weights),
        reps: JSON.parse(exercise.reps),
      })),
    }

    return NextResponse.json(formattedWorkout)
  } catch (error) {
    console.error('Error fetching workout:', error)
    
    // Handle database connection issues gracefully
    if (error instanceof Error && error.message.includes('database')) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch workout' },
      { status: 500 }
    )
  }
}