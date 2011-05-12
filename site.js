/**
 * site resource
 */

var 
  Site = exports,
  check = require('validator').check,
  path = require('path'),
  opt = require('./opt');

/*
 * index
 */
Site.index = function(req, res, next)  {  
  var args = {};
  args['layout'] = req.isMobile ? 'mobile/index.jade' : 'index.jade';    
  args['page'] = {class: 'index' },
  res.render(path.join(opt.pagesPath, 'index.md'), args);  
};

/*
 * show
 */
Site.show = function(req, res, next)  {  
  
  // requested page
  var pageName = req.params.id;
  
  // validate
  try {
    // starts with alpha then only alpha, digits and underscore and dash are allowed
    check(pageName, "not found").notEmpty().regex(/^[a-z][a-z0-9_\-]+$/, 'i');
    
    var args = {};  
    args['layout'] = req.isMobile ? 'mobile/page.jade' : 'page.jade'; 
    args['page'] = {class: 'page' },
    res.render(path.join(opt.pagesPath, pageName + '.md'), args);  
  }
  catch (err) {
    next(err);
  }
};
