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

父子类初始化过程：

1) 先Class，后Object：static修饰的功能块或者变量赋值是在类被装载时进行执行，因此其最先被执行并且仅仅执行一次。

2)先父类，后子类：

3)先功能块，后构造函数：赋值属性可以看作一种特殊的功能块（仅执行一个属性的赋值操作）

4)在同级别下按照定义顺序执行：

父类中static块和赋值属性 > 子类中static块和赋值属性  >父类中块和赋值属性 > 父类构造函数 > 子类中块和赋值属性 > 子类构造函数

未完待续！