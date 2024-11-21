const express = require('express');
const FlowController = require('../controllers/flowController');

const router = express.Router();

router.post('/start', (req, res) => FlowController.startFlow(req, res));
router.post('/simulate', (req, res) => FlowController.simulateFlow(req, res));
// router.get('/list', (req, res) => FlowController.listFlows(req, res));

module.exports = router;
