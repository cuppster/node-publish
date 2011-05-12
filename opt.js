/**
 * site options
 */
 
var path = require('path');

module.exports = {
  
  /**
   * site name
   */
  siteName: 'Cuppster.com',  
  
  /**
   * site url
   */
  siteUrl: '/',
  
  /**
   * path to markdown pages
   */
  pagesPath: path.join(__dirname, '/pages'),   
  
  /**
   * allow comments? (commented powerd by Disqus) 
   */
  comments: false,
  
  /**
   * for Disqus, this is the 'disqus_shortname' variable
   */
  commentsOwnerId: 'cuppsterdotcom',
  
}
