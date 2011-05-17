/**
 * site options
 */
 
var path = require('path');

module.exports = {
  
  /**
   * server port
   */   
  port: 8080,
  
  /**
   * site name
   */
  siteName: 'my node publish site',
  
  /**
   * site url
   */
  siteUrl: '',
  
  /**
   * author email (used for gravatar)
   */
  authorEmail: '',
  
  /**
   * path to markdown pages
   */
  pagesPath: path.join(__dirname, '../node-blog/pages'),   
  
  /**
   * allow comments? (commented powerd by Disqus) 
   */
  comments: false,
  
  /**
   * for Disqus, this is the 'disqus_shortname' variable
   */
  commentsOwnerId: '',
  
}
