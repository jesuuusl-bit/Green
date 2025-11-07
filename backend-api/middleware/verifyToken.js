import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  const header = req.header('Authorization') || req.headers['authorization'];
  const token = header?.replace?.('Bearer ', '') ?? null;
  if (!token) return res.status(401).json({ msg: 'No token, autorización denegada' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded should match how backend-auth genera tokens; por ejemplo { id, role }
    req.user = decoded;
    // optionally fetch user
    req.userDoc = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    console.error('verifyToken error', err);
    res.status(401).json({ msg: 'Token inválido' });
  }
};
