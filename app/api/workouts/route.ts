import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface ExerciseInput {
  name: string
  sets: number
  weights: number[]
  reps: number[][]
}

export async function GET() {
  try {
    const workouts = await prisma.workout.findMany({
      include: {
        exercises: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(workouts)
  } catch (error) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, templateName, exercises } = body

    const existingWorkout = await prisma.workout.findUnique({
      where: { date: new Date(date) }
    })

    if (existingWorkout) {
      return NextResponse.json(
        { error: 'Workout already exists for this date' },
        { status: 400 }
      )
    }

    const workout = await prisma.workout.create({
      data: {
        date: new Date(date),
        templateName,
        exercises: {
          create: exercises.map((exercise: ExerciseInput) => ({
            name: exercise.name,
            sets: exercise.sets,
            weights: JSON.stringify(exercise.weights),
            reps: JSON.stringify(exercise.reps),
          })),
        },
      },
      include: {
        exercises: true,
      },
    })

    return NextResponse.json(workout, { status: 201 })
  } catch (error) {
    console.error('Error creating workout:', error)
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    )
  }
}