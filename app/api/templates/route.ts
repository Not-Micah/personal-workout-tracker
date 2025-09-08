import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'workout.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const templates = JSON.parse(fileContents)

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error reading workout templates:', error)
    return NextResponse.json(
      { error: 'Failed to load workout templates' },
      { status: 500 }
    )
  }
}