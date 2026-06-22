import type { Request, Response } from 'express';
import { findUserByIc, findProfileByUserId, registerUser } from '../services/authService';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

interface SignupRequestBody {
  email?: string;
  icNumber?: string;
  password?: string;
}

interface LoginRequestBody {
  icNumber?: string;
  password?: string;
}

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, icNumber, password } = req.body as SignupRequestBody;

  if (typeof email !== 'string' || typeof icNumber !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Email, IC Number, and Password are required' });
    return;
  }

  try {
    const userExists = await findUserByIc(icNumber);
    if (userExists) {
      res.status(400).json({ error: 'IC Number is already registered' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const userRecord = await registerUser(email, icNumber, passwordHash);
    const token = generateToken({ userId: userRecord.id, email, icNumber });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: userRecord.id, email, icNumber, name: userRecord.name },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { icNumber, password } = req.body as LoginRequestBody;

  if (typeof icNumber !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'IC Number and Password are required' });
    return;
  }

  try {
    const user = await findUserByIc(icNumber);
    if (!user) {
      res.status(401).json({ error: 'Invalid IC Number or Password' });
      return;
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid IC Number or Password' });
      return;
    }

    const profile = await findProfileByUserId(user.id);
    const name = profile?.name || 'User';
    const token = generateToken({ userId: user.id, email: user.email, icNumber: user.ic_number });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, icNumber: user.ic_number, name },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
