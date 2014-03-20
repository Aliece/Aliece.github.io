---
title: Bootstrap director Knockout!
first: 关于Bootstrap的介绍我想不用多说，无非就是Css的一个前端框架，使得前端美工可以轻松的实现一系列麻烦的页面，理论上，如果你能够熟练的使用并且理解CSS这个东西，使用bootstrap可以让你不需要写一行CSS代码，boot可以完全帮你实现。
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

## Bootstrap

关于Bootstrap的介绍我想不用多说，无非就是Css的一个前端框架，使得前端美工可以轻松的实现一系列麻烦的页面，理论上，如果你能够熟练的使用并且理解CSS这个东西，使用bootstrap可以让你不需要写一行CSS代码，boot可以完全帮你实现。

[Bootstrap中文网](http://www.bootcss.com/) [Bootstrap英文网](http://getbootstrap.com/)

[Bootstrap下载地址](http://v3.bootcss.com/)

当然Bootstrap提供了多种引用方式：

我们可以先下载Bootstrap的官方的rar包，里面包含的是编译后的CSS、JS和字体文件，但是不包含文档和源码文件。如果需要源码，我们可以点这里 [源码](https://github.com/twbs/bootstrap/archive/v3.0.3.zip)，当然现在很流行的Github上面也是有的<a href="https://github.com/twbs/bootstrap">Clone or fork via GitHub</a>.

除了上述的方式，我们还可以直接使用CDN引用，也可以是通过云端引用js以及css文件：

国内CDN：

{% highlight ruby %}

<!-- 最新 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="http://cdn.bootcss.com/twitter-bootstrap/3.0.3/css/bootstrap.min.css">

<!-- 可选的Bootstrap主题文件（一般不用引入） -->
<link rel="stylesheet" href="http://cdn.bootcss.com/twitter-bootstrap/3.0.3/css/bootstrap-theme.min.css">

<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="http://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>

<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="http://cdn.bootcss.com/twitter-bootstrap/3.0.3/js/bootstrap.min.js"></script>

{% endhighlight %}

国外CDN:

{% highlight ruby %}

<!-- 最新 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css">

<!-- 可选的Bootstrap主题文件（一般不用引入） -->
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap-theme.min.css">

<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>

{% endhighlight %}

当然你也可以编译源码：

如果你下载的是源码文件，那就需要将Bootstrap的LESS源码编译为可以使用的CSS代码，目前，Bootstrap官方仅支持Recess编译工具，这是Twitter提供的基于less.js构建的编译、代码检测工具。

具体的使用例子这里就不多说了，举一个简单的例子吧：

下面的就是一个简单导航条的代码，你可以试着按照我上面的介绍把Bootstrap的js和css引入一个html文件，然后再body里面插入下面的代码，直接使用浏览器打开，是不是有效果出来了：

{% highlight ruby %}

<!DOCTYPE html>
<html>
  <head>
    <title>Bootstrap 101 Template</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link rel="stylesheet" href="http://cdn.bootcss.com/twitter-bootstrap/3.0.3/css/bootstrap.min.css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="http://cdn.bootcss.com/html5shiv/3.7.0/html5shiv.min.js"></script>
        <script src="http://cdn.bootcss.com/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <h1>Hello, world!</h1>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="http://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="http://cdn.bootcss.com/twitter-bootstrap/3.0.3/js/bootstrap.min.js"></script>
  </body>
</html>

<nav class="navbar navbar-default" role="navigation">
  <!-- Brand and toggle get grouped for better mobile display -->
  <div class="navbar-header">
    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
      <span class="sr-only">Toggle navigation</span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
      <span class="icon-bar"></span>
    </button>
    <a class="navbar-brand" href="#">Brand</a>
  </div>

  <!-- Collect the nav links, forms, and other content for toggling -->
  <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
    <ul class="nav navbar-nav">
      <li class="active"><a href="#">Link</a></li>
      <li><a href="#">Link</a></li>
      <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
        <ul class="dropdown-menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li class="divider"></li>
          <li><a href="#">Separated link</a></li>
          <li class="divider"></li>
          <li><a href="#">One more separated link</a></li>
        </ul>
      </li>
    </ul>
    <form class="navbar-form navbar-left" role="search">
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Search">
      </div>
      <button type="submit" class="btn btn-default">Submit</button>
    </form>
    <ul class="nav navbar-nav navbar-right">
      <li><a href="#">Link</a></li>
      <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
        <ul class="dropdown-menu">
          <li><a href="#">Action</a></li>
          <li><a href="#">Another action</a></li>
          <li><a href="#">Something else here</a></li>
          <li class="divider"></li>
          <li><a href="#">Separated link</a></li>
        </ul>
      </li>
    </ul>
  </div><!-- /.navbar-collapse -->
</nav>

{% endhighlight %}

## Director.js

一个前端的route框架，这个也是无意中在一个论坛上看到的，应该是一个开源的框架吧，特此附上Github地址[https://github.com/flatiron/director.git](https://github.com/flatiron/director.git).

这上面它介绍时一直路由框架：Client-side routing (aka hash-routing) allows you to specify some information about the state of the application using the URL. So that when the user visits a specific URL, the application can be transformed accordingly.
<p><img src="/assets/images/hashRoute.png"></p>

根据它给出的例子我们来解析一下：

{% highlight ruby %}

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>A Gentle Introduction</title>
    <script src="https://raw.github.com/flatiron/director/master/build/director.min.js"></script>
    <script>

      var author = function () { console.log("author"); },
          books = function () { console.log("books"); },
          viewBook = function(bookId) { console.log("viewBook: bookId is populated: " + bookId); };

      var routes = {
        '/author': author,
        '/books': [books, function() { console.log("An inline route handler."); }],
        '/books/view/:bookId': viewBook
      };

      var router = Router(routes);
      router.init();

    </script>
  </head>
  <body>
    <ul>
      <li><a href="#/author">#/author</a></li>
      <li><a href="#/books">#/books</a></li>
      <li><a href="#/books/view/1">#/books/view/1</a></li>
    </ul>
  </body>
</html>

{% endhighlight %}

根据我个人的理解，应该就是一个转发器，你也可以通俗的理解为一个分发器，根据不同的url来进行触发相应的函数，跟JQuery和Node等都可以很好的结合使用。

## Knockout.js

玩过前端的人应该都比较了解MVC，OOP等框架模式，而Ko确实MVVM框架，当然如果你要去深究，类似的JS框架还是一大堆的，毕竟大牛越来越多，具体的教程这里不多说，直接上官网吧[http://knockoutjs.com/](http://knockoutjs.com/)

参考文献与延伸阅读：

1.Bootstrap的来由和发展。[http://www.alistapart.com/articles/building-twitter-bootstrap/](http://www.alistapart.com/articles/building-twitter-bootstrap/)

2.Less与Sass的介绍与对比.[http://coding.smashingmagazine.com/2011/09/09/an-introduction-to-less-and-comparison-to-sass/](http://coding.smashingmagazine.com/2011/09/09/an-introduction-to-less-and-comparison-to-sass/)

3.Html5模板 [http://html5boilerplate.com/](http://html5boilerplate.com/)

4.Html5与Bootstrap混合项目  (H5BP)[https://gist.github.com/1422879](https://gist.github.com/1422879)

5.20个有用的Bootstrap资源  [http://www.webresourcesdepot.com/20-beautiful-resources-that-complement-twitter-bootstrap/](http://www.webresourcesdepot.com/20-beautiful-resources-that-complement-twitter-bootstrap/)

6.Bootstrap按钮生成器 [http://charliepark.org/bootstrap_buttons/](http://charliepark.org/bootstrap_buttons/)

7.前后端结合讨论  [http://stackoverflow.com/questions/9525170/backend-technology-for-front-end-technologies-like-twitter-bootstrap/](http://stackoverflow.com/questions/9525170/backend-technology-for-front-end-technologies-like-twitter-bootstrap/)

8.Bootstrap英文教程  [http://webdesign.tutsplus.com/tutorials/htmlcss-tutorials/stepping-out-with-bootstrap-from-twitter/](http://webdesign.tutsplus.com/tutorials/htmlcss-tutorials/stepping-out-with-bootstrap-from-twitter/)