const router = require('express').Router();

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache');

  return next();
});

router.use('/bloginfo', require('./bloginfo'));
router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/signout', require('./signout'));
router.use('/account', require('./account'));
router.use('/posts', require('./posts'));
router.use('/tags', require('./tags'));
router.use('/images', require('./images'));

module.exports = router;