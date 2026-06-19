import { useState } from "react"
import PredictorForm from "./components/PredictorForm"
import ResultCard from "./components/ResultCard"

export default function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async (formData) => {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-violet-400 mb-2">🎮 Game Success Predictor</h1>
          <p className="text-gray-400 text-sm">Enter your game's details to predict its success using ML</p>
        </div>
        <PredictorForm onSubmit={handlePredict} loading={loading} />
        {result && <ResultCard result={result} />}
      </div>
    </div>
  )
}