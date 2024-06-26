import React from "react"
import { useNavigate } from "react-router-dom"

export default function HomePage() {

    const navigate = useNavigate()

    const handleStartClick = () => {
        navigate("/quiz")
    }

    return (
        <main className="main--container">
            <img className="main--blue-blob" src="/blue-blob.svg" />
            <img className="main--yellow-blob" src="/yellow-blob.svg" />
            <h1 className="main--title main--items">Quizzical</h1>
            <p className="main--description main--items">It's trivia time!  See how many you can get right!</p>
            <button className="main--btn main--items btn" onClick={handleStartClick}>Start quiz</button>
        </main>
    )
}