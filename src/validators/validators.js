import { body, validationResult } from 'express-validator';
import { deleteFile } from '../utils/fileHandling.utils.js';

export const registerValidator = () => [
    body('firstName').notEmpty().withMessage('First name is required').isLength({min:3}).withMessage('First name must be at least 3 characters'),
    body('lastName').notEmpty().withMessage('Last name is required').isLength({min:3}).withMessage('Last name must be at least 3 characters'),
    body('username').notEmpty().withMessage('Username is required').isLength({min: 3}).withMessage('Username must be at least 3 characters'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required').isLength({min: 8}).withMessage('Password must be at least 8 characters'),
]

export const updateProfileValidator = () => [
    body('firstName').optional().notEmpty().withMessage('First name is required').isLength({min:3}).withMessage('First name must be at least 3 characters'),
    body('lastName').optional().notEmpty().withMessage('Last name is required').isLength({min:3}).withMessage('Last name must be at least 3 characters'),
    body('username').optional().notEmpty().withMessage('Username is required').isLength({min: 3}).withMessage('Username must be at least 3 characters'),
    body('email').optional().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').optional().notEmpty().withMessage('Password is required').isLength({min: 8}).withMessage('Password must be at least 8 characters'),
]

export const validation = async (req, res, next) => {
    const errors = validationResult(req).array();
    if(errors.length == 0)  return next();

    const errorMessage = errors.map(err => err.msg).join(", ");
    if(req?.file?.path) await deleteFile([req.file.path])
    return res.status(400).json({
        success : false,
        message : errorMessage
    })
}