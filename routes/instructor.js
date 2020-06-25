const router = require('express').Router();

router.get('/instructor', (req, res) => {
  const {groupid} = req.query;
  session = req.session;
  if (session.username) {
    res.render('instructor', {
      groupid: groupid,
    });
  }
});

module.exports = router;
