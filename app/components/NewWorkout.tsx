'use client'

import { useState, useEffect } from 'react'
import WorkoutCanvas from './WorkoutCanvas'

interface Exercise {
  name: string
  sets: number
  weights: number[]
}

interface WorkoutTemplate {
  [key: string]: Exercise[]
}

interface NewWorkoutProps {
  date: Date
  onClose: () => void
  onSave: () => void
}

export default function NewWorkout({ date, onClose, onSave }: NewWorkoutProps) {
  const [templates, setTemplates] = useState<WorkoutTemplate>({})
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      const data = await response.json()
      setTemplates(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching templates:', error)
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName)
  }

  const handleBackToSelection = () => {
    setSelectedTemplate(null)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-900">Loading templates...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedTemplate && (
                <button
                  onClick={handleBackToSelection}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
                >
                  ←
                </button>
              )}
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedTemplate ? selectedTemplate : 'Select Workout'}
                </h2>
                <p className="text-xs text-gray-500">{formatDate(date)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Template Selection */}
          {!selectedTemplate && (
            <div className="space-y-3">
              {Object.keys(templates).map((templateName) => (
                <div
                  key={templateName}
                  className="border border-gray-100 rounded-lg p-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  onClick={() => handleTemplateSelect(templateName)}
                >
                  <h3 className="text-base font-medium text-gray-900 mb-1">{templateName}</h3>
                  <div className="text-sm text-gray-500">
                    <p className="mb-2">{templates[templateName].length} exercises</p>
                    <div className="text-xs space-y-1">
                      {templates[templateName].slice(0, 3).map((exercise, index) => (
                        <div key={index}>• {exercise.name}</div>
                      ))}
                      {templates[templateName].length > 3 && (
                        <div>... and {templates[templateName].length - 3} more</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Workout Canvas */}
          {selectedTemplate && (
            <WorkoutCanvas
              templateName={selectedTemplate}
              exercises={templates[selectedTemplate]}
              date={date}
              onSave={onSave}
            />
          )}
        </div>
      </div>
    </div>
  )
}