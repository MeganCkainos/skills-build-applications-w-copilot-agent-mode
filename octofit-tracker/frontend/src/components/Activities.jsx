import { useEffect, useState } from 'react'
import { toArray } from '../config/api.js'

// Requires VITE_CODESPACE_NAME to be defined (for example in .env.local); falls
// back to localhost to avoid a broken https://undefined-8000... URL.
const codespaceName = import.meta.env.VITE_CODESPACE_NAME
const ACTIVITIES_API_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/'

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch(ACTIVITIES_API_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setActivities(toArray(data))
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
      <h1>Activities</h1>
      {loading && <p>Loading activities…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Duration (min)</th>
              <th>Distance (km)</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.userId?.displayName ?? activity.userId?.username ?? '—'}</td>
                <td>{activity.activityType ?? activity.type ?? '—'}</td>
                <td>{activity.durationMinutes ?? '—'}</td>
                <td>{activity.distanceKm ?? '—'}</td>
                <td>{activity.points ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default Activities
