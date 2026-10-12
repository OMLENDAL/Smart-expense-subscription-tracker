// This controller prepares data for the dashboard page.
const { getDashboardSummary } = require('../services/dashboardService');

async function getSummary(req, res, next) {
  try {
    const summary = await getDashboardSummary(req.user.id);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSummary,
};
