/**
 * site resource
 */

var 
  Site = exports,
  check = require('validator').check,
  path = require('path'),
  opt = require('./opt'),
  crypto = require('crypto'),
  fs = require('fs'),
  md = require("node-markdown").Markdown;

/**
 * index
 */
Site.index = function(req, res, next)  {  
  var args = {
    isMobile:   req.isMobile,
    isIndex:    true,
    layout:     (req.isMobile ? 'mobile/index.jade' : 'index.jade'),
    page:       {
                  class: 'index', 
                  id: crypto.createHash('md5').update('index').digest('hex'),
                  permalink:  opt.siteUrl + '/',
                },
    h1:         opt.siteName, /* not extracting page title from markdown page */
    
  };
  
  /**
   * read directory
   */
  fs.readdir(opt.pagesPath, function(err, files) {
    
    if (err)
      next(err);
    else {
      
      // collect posts
      var posts = [];
      for (var i in files) {       
        var match = /(\d{4})-(\d{2})-(\d{2})-([a-z][a-z0-9-]+)/.exec(files[i]);
        if (match) {
          
          // extract the title of the markdown page
          var markdown = fs.readFileSync(path.join(opt.pagesPath, files[i]), "utf8");
          var html = md(markdown);
          var matches = /h1>(.+)<\/h1/i.exec(html);
          var title = "unknown";
          if (matches)
            title = matches[1];
        
          var isoDate = match[1] + '-' + match[2] + '-' + match[3];
          var pathDate = match[1] + '/' + match[2] + '/' + match[3];
          
          // push to array
          posts.push({date: isoDate, title: title, slug: match[2], link: /* opt.siteUrl + */ '/' + pathDate + '/' + match[4]});
        }
      }
      
      // sort posts descending by date      
      var sortPosts = posts.sort(function(a, b) {
        if (a.date > b.date)
          return -1;
         if (a.date < b.date)
          return 1;
         return 0;
      });
      
      // add posts
      args['posts'] = posts;
      
      // render
      res.render('contents', args);
    }    
  });
}

/**
 * static index page
 */
Site.indexStatic = function(req, res, next)  {  
  var args = {
    isMobile:   req.isMobile,
    isIndex:    true,
    layout:     (req.isMobile ? 'mobile/index.jade' : 'index.jade'),
    page:       {
                  class: 'index', 
                  id: crypto.createHash('md5').update('index').digest('hex'),
                  permalink:  opt.siteUrl + '/',
                },    
  };
  
  // render
  res.render(path.join(opt.pagesPath, 'index.md'), args);
}

/**
 * get post by date and slug
 */
Site.showPost = function(req, res, next) {  
  req.params['date'] = req.params[0] + '-' + req.params[1] + '-' + req.params[2];
  req.params['id'] = req.params[3];   
  Site.show(req, res, next);
}

/**
 * show
 */
Site.show = function(req, res, next)  {  
  
  // requested page
  var pageDate = req.params.date;  
  var pageName = req.params.id;  
  
  // validate
  try {
    // starts with alpha then only alpha, digits and underscore and dash are allowed
    check(pageName, "not found").notEmpty().regex(/^[a-z][a-z0-9-]+$/, 'i');
    
    var args = {
      isMobile:   req.isMobile,
      isIndex:    false,
      layout:     (req.isMobile ? 'mobile/page.jade' : 'page.jade'),
      page:       {
                    class: 'page', 
                    id: crypto.createHash('md5').update(pageName).digest('hex'),
                    permalink:  opt.siteUrl + '/' + pageName,
                  },
    };
    
    // construct filename
    var filename = pageName + '.md';
    if ('' != pageDate) {
      filename = pageDate + '-' + filename;
    }    
    
    // render
    res.render(path.join(opt.pagesPath, filename), args);  
  }
  catch (err) {
    next(err);
  }
};
