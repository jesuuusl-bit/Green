import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, autorización denegada' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};

export const verifyAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user?.role !== 'admin') return res.status(403).json({ msg: 'Acceso denegado' });
  next();
};
