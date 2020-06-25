const router = require('express').Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const header = fs.readFileSync('./public/pages/fragments/header.html', 'utf8');
const footer = fs.readFileSync('./public/pages/fragments/footer.html', 'utf8');
const errorPage = fs.readFileSync('./public/pages/403.html', 'utf8');
const adminPage = fs.readFileSync('./public/pages/admin/index.html', 'utf8');
const frontPage = fs.readFileSync('./public/pages/frontpage.html', 'utf8');

router.use(bodyParser.urlencoded({
  'extended': true,
}));

router.use(bodyParser.json());

router.get('/', (req, res) => {
  sess = req.session;
  let indexPage = '';
  if (sess.username) {
    switch (sess.role_id) {
      case 1:
        indexPage = fs.readFileSync('./public/pages/admin/index.html', 'utf8');
        break;
      case 2:
        indexPage = fs.readFileSync('./public/pages/instructor/index.html', 'utf8');
        break;
      case 3:
        indexPage = fs.readFileSync('./public/pages/member/index.html', 'utf8');
        break;
    }
    return res.send(header + indexPage + footer);
  } else {
    return res.send(header + frontPage + footer);
  }
});

router.get('/admin', (req, res) => {
  session = req.session;
  if (session.username) {
    return res.send(header + adminPage + footer);
  } else {
    return res.send(header + errorPage + footer);
  }
});

module.exports = router;
