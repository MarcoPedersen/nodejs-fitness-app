const router = require('express').Router();

router.get('/member', (req, res) => {
  const {groupid} = req.query;
  session = req.session;
  if (session.username) {
    res.render('member', {
      groupid: groupid,
    });
  }
});

module.exports = router;
