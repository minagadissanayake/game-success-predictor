export default function ResultCard({ result }) {
    const { success_probability, prediction, confidence, top_factors } = result
    const isSuccess = prediction === "Likely Successful"
    const maxImpact = Math.max(...top_factors.map(f => Math.abs(f.impact)))

    const featureLabels = {
        ratings_count: "Ratings Count",
        reviews_count: "Reviews Count",
        genre_encoded: "Genre",
        release_year: "Release Year",
        added_status_owned: "Owned Count",
        playtime: "Avg Playtime",
        platform_count: "Platform Count",
        genre_count: "Genre Count",
        is_major_publisher: "Major Publisher"
    }

    return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="text-center mb-6">
                <div className={`text-6xl font-bold mb-2 ${isSuccess ? "text-green-400" : "text-red-400"}`}>
                    {success_probability.toFixed(1)}%
                </div>
                <div className={`text-lg font-semibold mb-1 ${isSuccess ? "text-green-400" : "text-red-400"}`}>
                    {prediction}
                </div>
                <div className="text-gray-500 text-sm">{confidence} Confidence</div>
            </div>

            <div>
                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-3">Top Factors (SHAP)</h3>
                <div className="space-y-3">
                    {top_factors.map((f, i) => {
                        const isPos = f.impact >= 0
                        const width = `${(Math.abs(f.impact) / maxImpact) * 100}%`
                        return (
                            <div key={i}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300">{featureLabels[f.feature] || f.feature}</span>
                                    <span className={isPos ? "text-green-400" : "text-red-400"}>
                                        {isPos ? "+" : ""}{f.impact.toFixed(3)}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${isPos ? "bg-green-500" : "bg-red-500"}`}
                                        style={{ width }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}