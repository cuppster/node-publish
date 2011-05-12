/**
 * nodepublish server
 */
console.log("starting node server...");
console.log("NODE_ENV = " + process.env.NODE_ENV);

// dependencies
var 
  //sys = require('sys'),
  //connect = require('connect'), 
  express = require('express'),
  resource = require('express-resource'),
  //crypto = require('crypto'),
  md = require("node-markdown").Markdown,
  opt = require('./opt'),
  path = require('path');
  
// create server
var app = module.exports = express.createServer();

// common middleware
console.log('adding commmon middleware...');
//app.use(express.methodOverride());
//app.use(express.bodyParser());
//app.use(express.cookieParser());

// set view options
console.log('setting view options..');
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', { layout: true });

// register the markdown pages for views
app.register('.md', {
  compile: function(str, options){
    var html = md(str);
    return function(locals){
      
      // options
      locals['siteName'] = opt.siteName;
      locals['siteUrl'] = opt.siteUrl;
      
      // locals variables substitution {<varname>}
      var withlocals = html.replace(/\{([^}\s]+)\}/g, function(_, name){
        return locals[name];
      });
      
      // extract H1 title
      var matches = /h1>(.+)<\/h1/i.exec(withlocals);
      if (matches)
        locals['h1'] = matches[1];
        
      // return markdown converted to html
      return withlocals;      
    };
  }
});
  
// NOTE: this is called by chrome on every request... ignore it
app.use('/favicon.ico', function(req, res) { res.send('no favicon yet, sry!', 404); });

/**
 * mobile/tablet detect middleware
 */
app.use(function(req, res, next) {  
  var ua = req.headers['user-agent'].toLowerCase();
  req.isMobile = (/android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(ua.substr(0,4)));
  next();
});

/**
 * generic configuration
 */
app.configure(function() {  
  console.log("generic configuration...");
});

/**
 * production configuration
 */
app.configure('production', function(){  
  console.log("production configuration...");  
  var oneYear = 31557600000;
  app.use('/static', express.static(__dirname + '/static', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

/**
 * development config
 */
app.configure('development', function(){  
  console.log("development configuration...");    
  app.use('/static', express.static(__dirname + '/static'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));  
});

/**
 * dynamic view helpers
 */
app.dynamicHelpers({
  
  // is mobile
  isMobile: function(req, res) {
    return req.isMobile;
  },
  
  // site options
  opt: function(req, res) {
    return opt;
  },
    
});

/**
 * fancy express routing
 */
console.log("adding express resources...");  

// site
var SiteResource = require('./site');
app.resource(SiteResource);

// errors
app.error(function(err, req, res){
  var args = {
    layout: 'error.jade',
    error: err,
    page: {class: 'error' },
  };   
  res.render(path.join(opt.pagesPath, 'error.md'), args);  
});

 
/**
 * listen already!
 */
app.listen(opt.port);
