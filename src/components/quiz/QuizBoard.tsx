import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Question } from '../../db/db'
import {
  type QuizTile,
  buildTiles,
  isCorrectAnswer,
  scoreAnswers,
} from '../../quiz/quizEngine'
import { playWordAudio } from '../../quiz/audio'
import { ProgressBar } from './ProgressBar'
import { ResultSheet } from './ResultSheet'
import { WordTile, WordTilePlaceholder } from './WordTile'

type Phase = 'answering' | 'result' | 'complete'

export function QuizBoard({
  questions,
  language,
  backTo,
  onComplete,
}: {
  questions: Question[]
  language: string
  backTo: string
  onComplete: (correct: number, total: number) => void
}) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [tiles, setTiles] = useState<QuizTile[]>([])
  const [chosenIds, setChosenIds] = useState<string[]>([])
  const [phase, setPhase] = useState<Phase>('answering')
  const [lastCorrect, setLastCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [round, setRound] = useState(0)
  const reportedRef = useRef(false)

  const question = questions[questionIndex]

  useEffect(() => {
    const current = questions[questionIndex]
    setTiles(current ? buildTiles(current, questions) : [])
    setChosenIds([])
    setLastCorrect(false)
    setPhase('answering')
  }, [questions, questionIndex, round])

  if (!question) {
    return null
  }

  const chosenTiles = chosenIds
    .map((id) => tiles.find((tile) => tile.id === id))
    .filter((tile): tile is QuizTile => tile !== undefined)

  const percent =
    phase === 'complete'
      ? 100
      : Math.round(
          ((questionIndex + (phase === 'result' ? 1 : 0)) / questions.length) * 100,
        )

  function chooseTile(tile: QuizTile) {
    if (phase !== 'answering') return
    setChosenIds((ids) => [...ids, tile.id])
    playWordAudio(tile.word, language)
  }

  function removeTile(tileId: string) {
    if (phase !== 'answering') return
    setChosenIds((ids) => ids.filter((id) => id !== tileId))
  }

  function checkAnswer() {
    if (phase !== 'answering' || chosenTiles.length === 0) return

    const correct = isCorrectAnswer(
      chosenTiles.map((tile) => tile.word),
      question,
    )
    setLastCorrect(correct)
    setPhase('result')
    if (correct) setCorrectCount((count) => count + 1)
  }

  function continueQuiz() {
    if (phase !== 'result') return

    if (questionIndex + 1 >= questions.length) {
      setPhase('complete')
      if (!reportedRef.current) {
        reportedRef.current = true
        onComplete(correctCount, questions.length)
      }
      return
    }

    setQuestionIndex((index) => index + 1)
  }

  function restart() {
    reportedRef.current = false
    setCorrectCount(0)
    setQuestionIndex(0)
    setRound((value) => value + 1)
  }

  if (phase === 'complete') {
    const score = scoreAnswers(correctCount, questions.length)

    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 text-center">
          <div className="display-4 mb-2" aria-hidden="true">
            {score >= 80 ? '🎉' : score >= 50 ? '👍' : '💪'}
          </div>
          <h2 className="h3">Lesson complete</h2>
          <p className="text-secondary">
            You got {correctCount} of {questions.length} correct — {score}%.
          </p>
          <div className="mx-auto mb-4" style={{ maxWidth: 420 }}>
            <ProgressBar percent={100} label="Lesson complete" />
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <button type="button" className="btn btn-kuku" onClick={restart}>
              Practice again
            </button>
            <Link to={backTo} className="btn btn-outline-secondary">
              Back to lessons
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-5">
      <div className="d-flex align-items-center gap-2 mb-3">
        <Link to={backTo} className="btn btn-link px-0 text-dark" aria-label="Exit lesson">
          <i className="bi bi-x-lg" aria-hidden="true" />
        </Link>
        <div className="flex-grow-1">
          <ProgressBar percent={percent} />
        </div>
        <span className="small text-secondary text-nowrap">
          {questionIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="card border-2 border-secondary-subtle rounded-4 mb-3">
        <div className="card-body p-4">
          <div className="small text-secondary mb-1">Translate into the target language</div>
          <p className="fs-5 mb-0">{question.nativePhrase}</p>
        </div>
      </div>

      <div className="answer-tray border-bottom mb-3" aria-label="Your answer">
        {chosenTiles.length === 0 ? (
          <span className="text-secondary small">Tap the word tiles to build your answer.</span>
        ) : (
          chosenTiles.map((tile) => (
            <WordTile
              key={tile.id}
              word={tile.word}
              tone="chosen"
              onClick={() => removeTile(tile.id)}
              title="Remove word"
            />
          ))
        )}
      </div>

      <div className="d-flex flex-wrap justify-content-center mb-4" aria-label="Word choices">
        {tiles.map((tile) =>
          chosenIds.includes(tile.id) ? (
            <WordTilePlaceholder key={tile.id} word={tile.word} />
          ) : (
            <WordTile
              key={tile.id}
              word={tile.word}
              onClick={() => chooseTile(tile)}
              title={`Play ${tile.word}`}
            />
          ),
        )}
      </div>

      <div className="d-grid">
        <button
          type="button"
          className="btn btn-kuku btn-lg rounded-4"
          disabled={chosenTiles.length === 0}
          onClick={checkAnswer}
        >
          Check
        </button>
      </div>

      {phase === 'result' ? (
        <ResultSheet
          correct={lastCorrect}
          answer={question.foreignPhrase}
          isLast={questionIndex + 1 >= questions.length}
          onContinue={continueQuiz}
        />
      ) : null}
    </div>
  )
}
