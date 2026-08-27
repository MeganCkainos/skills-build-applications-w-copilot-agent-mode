import { useEffect, useState } from 'react'
import { toArray } from '../config/api.js'

// Requires VITE_CODESPACE_NAME to be defined (for example in .env.local); falls
// back to localhost to avoid a broken https://undefined-8000... URL.
const codespaceName = import.meta.env.VITE_CODESPACE_NAME
const WORKOUTS_API_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch(WORKOUTS_API_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setWorkouts(toArray(data))
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
      <h1>Workouts</h1>
      {loading && <p>Loading workouts…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Level</th>
              <th>Activity Type</th>
              <th>Duration (min)</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <tr key={workout._id}>
                <td>{workout.title}</td>
                <td>{workout.description}</td>
                <td>{workout.level}</td>
                <td>{workout.activityType}</td>
                <td>{workout.durationMinutes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default Workouts
