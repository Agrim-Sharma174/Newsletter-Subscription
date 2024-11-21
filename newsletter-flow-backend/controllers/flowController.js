const Flow = require('../models/Flow');
const mongoose = require('mongoose');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class FlowController {
  // Starting a new flow
  async startFlow(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const flow = await Flow.findOrCreateFlow(userId);

      res.status(200).json({
        flowId: flow._id,
        status: flow.status,
        logs: flow.logs
      });
    } catch (err) {
      console.error('Start Flow Error:', err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }

  // Simulating a flow
  async simulateFlow(req, res) {
    const { flowId } = req.body;

    // Validate flowId
    if (!flowId) {
      return res.status(400).json({ error: 'Flow ID is required' });
    }

    // Validate flowId format
    if (!mongoose.Types.ObjectId.isValid(flowId)) {
      return res.status(400).json({
        error: 'Invalid Flow ID format',
        details: 'The provided Flow ID is not a valid MongoDB ObjectId'
      });
    }

    // Simulate flow
    try {
      const flow = await Flow.findById(flowId);

      // Validate flow existence
      if (!flow) {
        return res.status(404).json({
          error: 'Flow not found',
          details: `No flow exists with ID: ${flowId}`
        });
      }

      // Validate flow status, in case it's already completed or not pending- not implemented as of such, but can be added
      // In frontend, I am generating a new user ID for each new flow, so there won't be any duplicate flows
      if (flow.status !== 'Pending') {
        return res.status(200).json(flow);
      }

      // Add log helper heere
      const addLog = (message) => {
        flow.logs.push({ message });
      };

      // First Reminder
      addLog('Sending first renewal reminder email');
      flow.reminderCount++;
      await flow.save();

      await wait(3000); // Simulated wait

      // Randomly decide if subscription is renewed after first reminder- there's 50% chance of renewal & not renewal
      const renewedAfterFirst = Math.random() > 0.5;
      if (renewedAfterFirst) {
        flow.status = 'Renewed';
        addLog('Subscription renewed after first reminder');
        addLog('Thank you email sent');
        await flow.save();
        return res.status(200).json(flow);
      }

      // Second Reminder - if not renewed after first reminder
      addLog('Sending second renewal reminder email');
      flow.reminderCount++;
      await flow.save();

      await wait(2000); // Simulated wait

      // Randomly decide if subscription is renewed after second reminder, again 50% chance of renewal & not renewal
      const renewedAfterSecond = Math.random() > 0.5;
      if (renewedAfterSecond) {
        flow.status = 'Renewed';
        addLog('Subscription renewed after second reminder');
        addLog('Thank you email sent');
      } else {
        flow.status = 'Not Renewed';
        addLog('Subscription not renewed');
        addLog('No further action taken');
      }

      await flow.save();
      res.status(200).json(flow);
    } catch (err) {
      console.error('Simulate Flow Error:', err);
      res.status(500).json({
        error: 'Internal server error',
        details: err.message
      });
    }
  }

  // listing all the flows, only for testing.
  async listFlows(req, res) {
    try {
      const flows = await Flow.find({});
      res.status(200).json({
        totalFlows: flows.length,
        flows: flows.map(flow => ({
          id: flow._id,
          userId: flow.userId,
          status: flow.status,
          createdAt: flow.createdAt
        }))
      });
    } catch (err) {
      console.error('List Flows Error:', err);
      res.status(500).json({ error: 'Unable to list flows', details: err.message });
    }
  }
}

module.exports = new FlowController();
