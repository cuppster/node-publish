
# node-publish

  node-publish is simple publishing tool for [Markdown](http://daringfireball.net/projects/markdown/ "Markdown") content written in node.js, expressjs and jade. Mobile and handheld browsers are supported by [jQuery Mobile](http://jquerymobile.com/ "jQuery Mobile"). You can see a live demo on my blog at [cuppster.com](http://cuppster.com)
  
  
## Installation

### get the source code

  $ git clone http://github.com/cuppster/node-publish.git
    
1. Rename the file *opt-example.js* to *opt.js* 
2. Edit the settings inside *opt.js*

### upload to your server

1. There are ~100 ways to do this, start a node server and keep it running. I have a [method for running node.js servers on Amazon EC2](http://cuppster.com/2011/05/12/diy-node-js-server-on-amazon-ec2) at my blog.

## Requirements

The following **node.js** modules are required:

    $ npm install express express-resource node-markdown validator node-gravatar crypto
    
  
## Usage

1. Put your blog posts in your *pagesPath* folder (see the *opt.js* file). 
2. Be sure to use the filename format: *yyyy-mm-dd-MY-BLOG-POST-NAME.md*


## License 

(The MIT License)

Copyright (c) 2009-2011 J Cupp (cuppster.com)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
