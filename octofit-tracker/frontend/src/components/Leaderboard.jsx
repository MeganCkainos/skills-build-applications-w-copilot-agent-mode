import { useEffect, useState } from 'react'
import { API_BASE_URL, toArray } from '../config/api.js'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch(`${API_BASE_URL}/leaderboard/`)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setEntries(toArray(data))
      })
      .catch((fetchError) => {
        if (!cancelled) setError(fetchError.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section>
      <h1>Leaderboard</h1>
      {loading && <p>Loading leaderboard…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Points</th>
              <th>Activities</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.rank}>
                <td>{entry.rank}</td>
                <td>{entry.user?.displayName ?? entry.user?.username ?? 'Unknown'}</td>
                <td>{entry.points}</td>
                <td>{entry.activities}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default Leaderboard
