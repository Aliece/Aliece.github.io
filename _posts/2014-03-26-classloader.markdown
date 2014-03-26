---
title: Java Classloader!
first: Java类加载机制
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

Java类加载机制：Java加载类是通过双亲委派模型来的，通常在JDK中都会有默认的system classloader来帮我们完成类的加载，在中间服务器上面也有web classloader来帮我们管理类的加载，那到底是怎么个加载步骤呢，这里我们来看看具体吧：

首先，JDK下面有3个默认的基本Classloader，它们分别是BootstrapClassloader<-parent-ExtClassloader<-parent-APPClassloade，

未完待续！