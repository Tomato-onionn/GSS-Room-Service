const express = require('express');
const AutoCompletionService = require('../utils/AutoCompletionService');

const router = express.Router();
const autoCompletionService = new AutoCompletionService();

/**
 * @swagger
 * /api/admin/test-auto-completion:
 *   post:
 *     summary: Test auto-completion manually (for testing purposes)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Auto-completion test completed
 */
router.post('/test-auto-completion', async (req, res) => {
  try {
    const completedRooms = await autoCompletionService.runNow();
    
    res.json({
      success: true,
      message: 'Auto-completion test completed',
      data: {
        completedRooms,
        count: completedRooms.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Auto-completion test failed',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/admin/auto-completion-status:
 *   get:
 *     summary: Get auto-completion service status
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Service status retrieved
 */
router.get('/auto-completion-status', (req, res) => {
  const status = autoCompletionService.getStatus();
  
  res.json({
    success: true,
    data: status
  });
});

module.exports = router;