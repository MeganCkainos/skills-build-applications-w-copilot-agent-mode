import { useEffect, useState } from 'react'
import { API_BASE_URL, toArray } from '../config/api.js'

function Teams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch(`${API_BASE_URL}/teams/`)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`)
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setTeams(toArray(data))
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
      <h1>Teams</h1>
      {loading && <p>Loading teams…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team._id}>
                <td>{team.name}</td>
                <td>{team.description || '—'}</td>
                <td>{team.memberIds?.length ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default Teams
