/**
 * site options
 */
 
var path = require('path');

module.exports = {
  
  /**
   * server port
   */   
  port: 8224,
  
  /**
   * site name
   */
  siteName: 'My Site',  
  
  /**
   * site url
   */
  siteUrl: '/',
  
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
