const router = require('express').Router();
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({
  'extended': true,
}));

router.use(bodyParser.json());

router.get('/', (req, res) => {
  sess = req.session;
  const navigationMenu = [];
  if (sess.username) {
    switch (sess.role_id) {
      case 1:
        return res.render('admin/index');
        break;
      case 2:
        navigationMenu.push({
          url: '/groups',
          name: 'Start Training Session',
        });

        break;
      case 3:
        navigationMenu.push({
          url: '/groups',
          name: 'Join Training Session',
        });
        break;
    }
    return res.render('index', {navigationMenu: navigationMenu});
  } else {
    res.render('frontpage');
  }
});


module.exports = router;
