import { useState } from "react"

const GENRES = ["Action", "Adventure", "RPG", "Strategy", "Shooter",
    "Simulation", "Sports", "Racing", "Puzzle", "Platformer",
    "Fighting", "Indie", "Casual", "Arcade"]

export default function PredictorForm({ onSubmit, loading }) {
    const [form, setForm] = useState({
        primary_genre: "Action",
        genre_count: 2,
        platform_count: 3,
        publisher: "",
        release_year: 2023,
        playtime: 10,
        ratings_count: 100,
        reviews_count: 20,
        added_status_owned: 50
    })

    const handle = (e) => {
        const { name, value, type } = e.target
        setForm(f => ({ ...f, [name]: type === "number" ? Number(value) : value }))
    }

    const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
    const labelClass = "block text-gray-400 text-xs mb-1"

    return (
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Primary Genre</label>
                    <select name="primary_genre" value={form.primary_genre} onChange={handle} className={inputClass}>
                        {GENRES.map(g => <option key={g}>{g}</option>)}
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Publisher (optional)</label>
                    <input name="publisher" value={form.publisher} onChange={handle} placeholder="e.g. Ubisoft" className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Number of Genres</label>
                    <input type="number" name="genre_count" value={form.genre_count} onChange={handle} min={1} max={8} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Number of Platforms</label>
                    <input type="number" name="platform_count" value={form.platform_count} onChange={handle} min={1} max={15} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Release Year</label>
                    <input type="number" name="release_year" value={form.release_year} onChange={handle} min={1980} max={2030} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Avg Playtime (hours)</label>
                    <input type="number" name="playtime" value={form.playtime} onChange={handle} min={0} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Expected Ratings Count</label>
                    <input type="number" name="ratings_count" value={form.ratings_count} onChange={handle} min={0} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Expected Reviews Count</label>
                    <input type="number" name="reviews_count" value={form.reviews_count} onChange={handle} min={0} className={inputClass} />
                </div>
                <div className="col-span-2">
                    <label className={labelClass}>Expected Owned Count</label>
                    <input type="number" name="added_status_owned" value={form.added_status_owned} onChange={handle} min={0} className={inputClass} />
                </div>
            </div>
            <button
                onClick={() => onSubmit(form)}
                disabled={loading}
                className="mt-6 w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
                {loading ? "Predicting..." : "Predict Success →"}
            </button>
        </div>
    )
}