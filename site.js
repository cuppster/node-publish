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
 * regex used in validating a url
 */
var
  // starts with alpha then only alpha, digits and underscore and dash are allowed
  pageNameRegex = /^[a-z][a-z0-9-]+$/;
  // yyyy/mm/dd
  datePathRegex = /^\d{4}\/\d{2}\/\d{2}$/;
  
var
  // used with scanning the pages directory for posts
  postFileRegex = /^(\d{4})-(\d{2})-(\d{2})-([a-z][a-z0-9-]+)\.md/;
  
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
        var match = postFileRegex.exec(files[i]);
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
 * get post by date (YY/MM/DD) and slug
 */
Site.showPost = function(req, res, next) {  
  req.params['date'] = req.params[0] + '-' + req.params[1] + '-' + req.params[2];
  req.params['datePath'] = req.params[0] + '/' + req.params[1] + '/' + req.params[2];
  req.params['id'] = req.params[3];   
  Site.show(req, res, next);
}

/**
 * show post or page
 */
Site.show = function(req, res, next)  {  
  
  // get params
  var 
    pageDate = req.params.date,  
    pageName = req.params.id,
    pageDatePath = req.params.datePath;
  
  // validate page name
  check(pageName, "bad page").notEmpty().regex(pageNameRegex, 'i');
  
  // validate date path
  if (pageDatePath)
    check(pageDatePath, "bad date").notEmpty().regex(datePathRegex, 'i');
  
  // construct filename from page slug
  var filename = pageName + '.md';
  
  if (pageDate) {
    /**
     * post, yyyy-mm-dd-slug.md
     */
    filename = pageDate + '-' + filename;
  }
  else {
    /**
     * page, pages/slug.md
     */
    filename = 'pages/' + filename;
  }
  
  /**
   * check if file exists
   */
  var fullPath = path.join(opt.pagesPath, filename);
  if (!path.existsSync(fullPath)) {
    fs.readdir(opt.pagesPath, function(err, files) {
      var re = new RegExp("^(\\d{4})-(\\d{2})-(\\d{2})-" + pageName + "\\.md$");
      for (var i in files) {
        var match = re.exec(files[i]);
        if (match) {
          var redirUrl = opt.siteUrl + "/" + match[1] + '/' + match[2] + '/' + match[3] + '/' + pageName;
          res.redirect(redirUrl);
          return;
        }         
      }
      
      /**
       * not found
       */
      next(new Error("not found!"));
      
    });
  }
  else /* OK */ {    
    
    var permalink = pageDate  ? (opt.siteUrl + '/' + pageDatePath + '/' + pageName)
                              : (opt.siteUrl + '/' + pageName);
                              
    var pageClass = pageDate ? 'post' : 'page';
    
    // render      
    var args = {
      isMobile:   req.isMobile,
      isIndex:    false,
      layout:     (req.isMobile ? 'mobile/page.jade' : 'page.jade'),
      page:       {
                    class: pageClass,
                    id: crypto.createHash('md5').update(pageName).digest('hex'),
                    permalink:  permalink,
                  },
    };    
    res.render(path.join(opt.pagesPath, filename), args);  
  }
};
