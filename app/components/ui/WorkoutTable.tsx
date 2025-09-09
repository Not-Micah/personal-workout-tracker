import { generateArray, WORKOUT_CONFIG, getAlternatingRowClass, formatWeight } from '@/lib/utils'

interface WorkoutTableProps {
  exerciseName: string
  sets: number
  weights: number[]
  reps?: number[][]
  previousReps?: (weightIndex: number, setIndex: number) => number | null
  onRepsChange?: (weightIndex: number, setIndex: number, reps: number) => void
  readOnly?: boolean
}

export default function WorkoutTable({
  sets,
  weights,
  reps = [],
  previousReps,
  onRepsChange,
  readOnly = false
}: WorkoutTableProps) {
  const { SETS_PER_ROW } = WORKOUT_CONFIG
  const needsWrapping = sets > SETS_PER_ROW

  const renderTableSection = (startSet: number, setsInRow: number) => (
    <div className="workout-exercise-container">
      {/* Header Row */}
      <div className="workout-table-header" style={{ gridTemplateColumns: `80px repeat(5, 1fr)` }}>
        <div className="workout-table-header-cell">
          {startSet === 0 ? 'Sets' : ''}
        </div>
        {generateArray(5).map(i => (
          <div key={i} className={`workout-table-header-cell ${i >= setsInRow ? 'opacity-0' : ''}`}>
            {i < setsInRow ? startSet + i + 1 : ''}
          </div>
        ))}
      </div>

      {/* Weight Rows */}
      {weights.map((weight, weightIndex) => (
        <div
          key={weightIndex}
          className={`workout-table-row ${getAlternatingRowClass(weightIndex)}`}
          style={{ gridTemplateColumns: `80px repeat(5, 1fr)` }}
        >
          <div className="workout-weight-label">
            {startSet === 0 ? formatWeight(weight) : ''}
          </div>
          
          {generateArray(5).map(i => {
            if (i < setsInRow) {
              const setIndex = startSet + i
              const currentReps = reps[weightIndex]?.[setIndex] || 0
              const prevReps = previousReps?.(weightIndex, setIndex)
              
              return (
                <div key={setIndex} className="workout-input-cell">
                  {readOnly ? (
                    <div className="workout-display-cell">
                      {currentReps || '0'}
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="0"
                        className="workout-input"
                        value={currentReps || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '')
                          onRepsChange?.(weightIndex, setIndex, parseInt(value) || 0)
                        }}
                      />
                      {prevReps && (
                        <div className="workout-previous-reps">
                          {prevReps}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            } else {
              return <div key={`empty-${i}`} className="workout-input-cell h-12"></div>
            }
          })}
        </div>
      ))}
    </div>
  )

  if (needsWrapping) {
    const sections = []
    let currentSet = 0
    
    while (currentSet < sets) {
      const setsInThisRow = Math.min(SETS_PER_ROW, sets - currentSet)
      sections.push(renderTableSection(currentSet, setsInThisRow))
      currentSet += setsInThisRow
    }
    
    return <div className="space-y-3">{sections.map((section, i) => <div key={i}>{section}</div>)}</div>
  }

  return renderTableSection(0, sets)
}