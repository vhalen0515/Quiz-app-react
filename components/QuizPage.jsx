import React from "react"
import { decode } from "html-entities"

export default function QuizPage() {

    const [quizData, setQuizData] = React.useState({
        questions: [],
        selectedAnswers: [],
        correctAnswers: [],
        results: [],
    })

    const [loading, setLoading] = React.useState(true)
    const [errorMessage, setErrorMessage] = React.useState("")


    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            setErrorMessage("")
            const response = await fetch(
                "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple"
            )
            if (!response.ok) {
                throw new Error(
                    `Hmmm...something went wrong. \nPlease refresh the page.`
                )
            }
            const data = await response.json()
            const correctAnswers = data.results.map((q) => q.correct_answer)
            setQuizData({
                questions: data.results || [],
                selectedAnswers: new Array(data.results.length).fill(null),
                correctAnswers,
                results: []
            })
        } catch (error) {
            console.error("Error fetching data:", error)
            setErrorMessage(`${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const holdAnswer = (questionIndex, answer) => {
        setQuizData((prev) => {
            const updatedSelectedAnswers = [...prev.selectedAnswers]
            updatedSelectedAnswers[questionIndex] = answer
            return { ...prev, selectedAnswers: updatedSelectedAnswers }
        })
    }

    const checkAnswer = () => {
        setQuizData((prev) => {
            const finalResults = prev.selectedAnswers.map((answer, index) => {
                const decodedSelectedAnswer = decode(answer)
                const decodedCorrectAnswer = decode(prev.correctAnswers[index])
                return decodedSelectedAnswer === decodedCorrectAnswer
            })
            return { ...prev, results: finalResults }
        })
    }

    const playAgainAndScrollToTop = () => {
        fetchData()
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const { questions, selectedAnswers, correctAnswers, results } = quizData

    return (
        <main className="quiz--container">
            <img className="quiz--blue-blob" src="/blue-blob.svg" />
            <img className="quiz--yellow-blob" src="/yellow-blob.svg" />

            {errorMessage && (
                <div className="quiz--information-text-container">
                    <p className="quiz--error-message">{errorMessage}</p>
                </div>
            )}

            {loading && !errorMessage && (
                <div className="quiz--information-text-container">
                    <p className="quiz--loading-text">Loading...</p>
                </div>
            )}
            
            {questions.length > 0 && !loading && !errorMessage && (
                questions.map((question, i) => (
                    <div className="question--container" key={i}>
                        <h2 className="quiz--question">{decode(question.question)}</h2>
                        <ul className="answer--container">
                            {[...question.incorrect_answers, question.correct_answer].map(
                                (answer, j) => {
                                    const decodedAnswer = decode(answer)
                                    let answerClass = ""
                                    if (results.length > 0) {
                                        if (decodedAnswer === decode(question.correct_answer)) {
                                            answerClass = "quiz--correct-answer"
                                        } else if (decodedAnswer === decode(selectedAnswers[i])) {
                                            answerClass = "quiz--incorrect-answer"
                                        } else {
                                            answerClass = "quiz--neutral-answer"
                                        }
                                    }
                                    return (
                                        <li 
                                            className={`quiz--answer ${
                                                selectedAnswers[i] === decodedAnswer
                                                ? "quiz--selected-answer"
                                                : ""
                                            } ${answerClass}`}
                                            onClick={() => holdAnswer(i, decodedAnswer)}
                                            key={j}
                                        >
                                            {decodedAnswer}
                                        </li>
                                    )
                                }
                            )}
                        </ul>
                    </div>
                ))
            )}


            {questions.length > 0 && results.length === 0 && (
                <button 
                    className="quiz--check-btn btn"
                    onClick={checkAnswer}
                >
                    Check answers
                </button>
            )}

            {results.length > 0 && !loading && !errorMessage && (
                <div className="quiz--play-again-container">
                    <p className="quiz--play-again-text">
                        You got {results.filter(result => result).length}/
                        {questions.length} correct!
                    </p>
                    <button 
                        className="quiz--play-again-btn btn"
                        onClick={playAgainAndScrollToTop}
                    >
                        Play again
                    </button>
                </div>
            )}

        </main>
    )
}