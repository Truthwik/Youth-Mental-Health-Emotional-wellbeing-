import express from 'express';
import { getBookings, createBooking, getAvailability } from '../controllers/bookingsController.js';

const router = express.Router();

router.get('/', getBookings);
router.get('/availability', getAvailability);
router.post('/', createBooking);

export default router;
