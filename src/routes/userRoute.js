import express from 'express'
import { validateSchema } from '../middleware/inputValidator.js';
import { generateAgeWiseDisributionReport } from '../controller/csvToJsonController.js';

const router = express.Router();

router.get("/read-csv-and-add-to-database" , generateAgeWiseDisributionReport)

export default router