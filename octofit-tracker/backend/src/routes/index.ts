import { Router, type NextFunction, type Request, type Response } from 'express'
import { Activity, Team, User, Workout } from '../models/index.js'
import type { WorkoutDocument } from '../models/Workout.js'

const router = Router()

router.get('/users', async (_request, response) => {
  response.json(await User.find().populate('teamId').sort({ createdAt: -1 }))
})

router.post('/users', async (request, response) => {
  const user = await User.create(request.body)
  response.status(201).json(user)
})

router.get('/teams', async (_request, response) => {
  response.json(await Team.find().populate('memberIds').sort({ name: 1 }))
})

router.post('/teams', async (request, response) => {
  const team = await Team.create(request.body)
  response.status(201).json(team)
})

router.patch('/teams/:id', async (request, response) => {
  const team = await Team.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
  if (!team) {
    response.status(404).json({ error: 'Team not found' })
    return
  }
  response.json(team)
})

router.get('/activities', async (request, response) => {
  const filter = typeof request.query.userId === 'string' ? { userId: request.query.userId } : {}
  response.json(await Activity.find(filter).populate('userId').sort({ performedAt: -1 }))
})

router.post('/activities', async (request, response) => {
  const { durationMinutes = 0, distanceKm = 0, ...activityData } = request.body
  const points = Math.round(Number(durationMinutes) + Number(distanceKm) * 5)
  const activity = await Activity.create({ ...activityData, durationMinutes, distanceKm, points })
  response.status(201).json(activity)
})

router.get('/leaderboard', async (_request, response) => {
  const totals = await Activity.aggregate([
    { $group: { _id: '$userId', points: { $sum: '$points' }, activities: { $sum: 1 } } },
    { $sort: { points: -1 } },
  ])
  const users = await User.find({ _id: { $in: totals.map((entry) => entry._id) } }).lean()
  const usersById = new Map(users.map((user) => [String(user._id), user]))
  response.json(totals.map((entry, index) => ({
    rank: index + 1,
    user: usersById.get(String(entry._id)) ?? null,
    points: entry.points,
    activities: entry.activities,
  })))
})

router.get('/workouts', async (request, response) => {
  const filter: { level?: WorkoutDocument['level'] } = {}
  if (typeof request.query.level === 'string') {
    if (['beginner', 'intermediate', 'advanced'].includes(request.query.level)) {
      filter.level = request.query.level as WorkoutDocument['level']
    }
  }
  response.json(await Workout.find(filter).sort({ level: 1, title: 1 }))
})

router.post('/workouts', async (request, response) => {
  const workout = await Workout.create(request.body)
  response.status(201).json(workout)
})

router.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const message = error instanceof Error ? error.message : 'Request failed'
  response.status(400).json({ error: message })
})

export default router
