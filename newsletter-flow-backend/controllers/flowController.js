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

  async simulateFlow(req, res) {
    const { flowId } = req.body;
  
    // Validate flowId
    if (!flowId) {
      return res.status(400).json({ error: 'Flow ID is required' });
    }
  
    if (!mongoose.Types.ObjectId.isValid(flowId)) {
      return res.status(400).json({ 
        error: 'Invalid Flow ID format',
        details: 'The provided Flow ID is not a valid MongoDB ObjectId'
      });
    }
  
    try {
      const flow = await Flow.findById(flowId);
      if (!flow) {
        return res.status(404).json({ 
          error: 'Flow not found', 
          details: `No flow exists with ID: ${flowId}`
        });
      }
  
      if (flow.status !== 'Pending') {
        return res.status(200).json(flow);
      }
  
      const addLog = (message) => {
        flow.logs.push({ message });
      };
  
      // First Reminder
      addLog('Sending first renewal reminder email');
      flow.reminderCount++;
      await flow.save();
  
      await wait(3000); // Simulated wait
  
      const renewedAfterFirst = Math.random() > 0.5;
      if (renewedAfterFirst) {
        flow.status = 'Renewed';
        addLog('Subscription renewed after first reminder');
        addLog('Thank you email sent');
        await flow.save();
        return res.status(200).json(flow);
      }
  
      // Second Reminder
      addLog('Sending second renewal reminder email');
      flow.reminderCount++;
      await flow.save();
  
      await wait(2000); // Simulated wait
  
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

  // Simulate flow progression
  // async simulateFlow(req, res) {
  //   const { flowId } = req.body;

  //   // Validate flowId
  //   if (!flowId) {
  //     return res.status(400).json({ error: 'Flow ID is required' });
  //   }

  //   // Validate flowId format
  //   if (!mongoose.Types.ObjectId.isValid(flowId)) {
  //     return res.status(400).json({ 
  //       error: 'Invalid Flow ID format',
  //       details: 'The provided Flow ID is not a valid MongoDB ObjectId'
  //     });
  //   }

  //   try {
  //     const flow = await Flow.findById(flowId);
  //     if (!flow) {
  //       console.error(`Flow not found for ID: ${flowId}`);
  //       console.error('Existing flows in database:');
  //       const allFlows = await Flow.find({});
  //       console.error(JSON.stringify(allFlows, null, 2));

  //       return res.status(404).json({ 
  //         error: 'Flow not found', 
  //         details: `No flow exists with ID: ${flowId}`,
  //         existingFlowCount: allFlows.length
  //       });
  //     }

  //     if (flow.status !== 'Pending') {
  //       return res.status(400).json({ error: 'Flow already completed' });
  //     }

  //     const addLog = (message) => {
  //       flow.logs.push({ message });
  //     };

  //     // First Reminder
  //     addLog('Sending first renewal reminder email');
  //     flow.reminderCount++;
  //     await flow.save();

  //     await wait(3000); // Simulated wait

  //     const renewedAfterFirst = Math.random() > 0.5;
  //     if (renewedAfterFirst) {
  //       flow.status = 'Renewed';
  //       addLog('Subscription renewed after first reminder');
  //       addLog('Thank you email sent');
  //       await flow.save();
  //       return res.status(200).json(flow);
  //     }

  //     // Second Reminder
  //     addLog('Sending second renewal reminder email');
  //     flow.reminderCount++;
  //     await flow.save();

  //     await wait(2000); // Simulated wait

  //     const renewedAfterSecond = Math.random() > 0.5;
  //     if (renewedAfterSecond) {
  //       flow.status = 'Renewed';
  //       addLog('Subscription renewed after second reminder');
  //       addLog('Thank you email sent');
  //     } else {
  //       flow.status = 'Not Renewed';
  //       addLog('Subscription not renewed');
  //       addLog('No further action taken');
  //     }

  //     await flow.save();
  //     res.status(200).json(flow);
  //   } catch (err) {
  //     console.error('Simulate Flow Error:', err);
  //     res.status(500).json({ 
  //       error: 'Internal server error', 
  //       details: err.message,
  //       stack: err.stack 
  //     });
  //   }
  // }

  // listing all the flows
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
