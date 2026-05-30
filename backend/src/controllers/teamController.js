import Team from '../models/Team.js';
import Worker from '../models/Worker.js';
import Notification from '../models/Notification.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createTeam = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile not found', 404);

  const existing = await Team.findOne({ leader: worker._id });
  if (existing) throw new AppError('You already lead a team', 400);

  const team = await Team.create({
    leader: worker._id,
    members: [{ worker: worker._id, role: 'leader' }],
    ...req.body,
  });

  res.status(201).json({ success: true, team });
});

export const getMyTeam = catchAsync(async (req, res) => {
  const worker = await Worker.findOne({ user: req.user._id });
  if (!worker) throw new AppError('Worker profile not found', 404);

  const team = await Team.findOne({
    $or: [
      { leader: worker._id },
      { 'members.worker': worker._id },
    ],
  }).populate('members.worker', 'name avatar skills experienceYears');

  if (!team) throw new AppError('You are not part of any team', 404);
  res.json({ success: true, team });
});

export const getTeams = catchAsync(async (req, res) => {
  const { city, skill } = req.query;
  const filter = { isPublic: true, isAvailable: true };
  if (city) filter['location.city'] = new RegExp(city, 'i');
  if (skill) filter.skills = { $in: [new RegExp(skill, 'i')] };

  const teams = await Team.find(filter)
    .populate('leader', 'name avatar')
    .sort({ rating: -1 })
    .limit(50);

  res.json({ success: true, teams });
});

export const addMember = catchAsync(async (req, res) => {
  const { teamId, workerId, role = 'member' } = req.body;
  const team = await Team.findById(teamId);
  if (!team) throw new AppError('Team not found', 404);

  const leader = await Worker.findOne({ user: req.user._id });
  if (String(team.leader) !== String(leader?._id)) throw new AppError('Only team leader can add members', 403);

  const alreadyMember = team.members.some((m) => String(m.worker) === workerId);
  if (alreadyMember) throw new AppError('Already a member', 400);

  team.members.push({ worker: workerId, role });
  await team.save();

  const addedWorker = await Worker.findById(workerId).select('user');
  if (addedWorker) {
    const io = req.app.get('io');
    await Notification.create({
      user: addedWorker.user,
      title: 'Team Invitation',
      message: `You were added to team "${team.name}"`,
      type: 'team',
      link: '/provider/team',
    });
    io?.to(`user:${addedWorker.user}`).emit('notification', {
      title: 'Team Invitation',
      message: `You were added to team "${team.name}"`,
    });
  }

  res.json({ success: true, team });
});

export const removeMember = catchAsync(async (req, res) => {
  const { teamId, workerId } = req.body;
  const team = await Team.findById(teamId);
  if (!team) throw new AppError('Team not found', 404);

  const leader = await Worker.findOne({ user: req.user._id });
  if (String(team.leader) !== String(leader?._id)) throw new AppError('Only team leader can remove members', 403);

  team.members = team.members.filter((m) => String(m.worker) !== workerId);
  await team.save();

  res.json({ success: true, team });
});

export const updateTeam = catchAsync(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) throw new AppError('Team not found', 404);

  const leader = await Worker.findOne({ user: req.user._id });
  if (String(team.leader) !== String(leader?._id)) throw new AppError('Not authorized', 403);

  const allowed = ['name', 'description', 'skills', 'location', 'workingRadiusKm', 'isAvailable', 'isPublic'];
  const updates = {};
  allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

  const updated = await Team.findByIdAndUpdate(req.params.id, updates, { new: true });
  res.json({ success: true, team: updated });
});
