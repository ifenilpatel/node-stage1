const ctrlInit = async (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() });
};

module.exports = { ctrlInit };
