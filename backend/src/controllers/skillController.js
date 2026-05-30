import Skill from '../models/Skill.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createSkill = catchAsync(async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json({ success: true, skill });
});

export const listSkills = catchAsync(async (req, res) => {
  const { q } = req.query;
  const filter = q ? { name: { $regex: q, $options: 'i' }, isActive: true } : { isActive: true };
  const skills = await Skill.find(filter).sort({ name: 1 }).limit(500);
  res.json({ success: true, count: skills.length, skills });
});


