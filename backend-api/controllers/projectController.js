import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = new Project({
      title, description, createdBy: req.user.id
    });
    const saved = await project.save();

    // Emitir evento via socket: obtenemos io desde app
    const io = req.app.get('io');
    io.emit('projectCreated', saved);

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

export const listProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name email');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
