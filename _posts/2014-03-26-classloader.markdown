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

Classloader一个很装逼的作用就是热部署，何为热部署，下面就来解释一下：

热部署是在不重启 Java 虚拟机的前提下，能自动侦测到 class 文件的变化，更新运行时 class 的行为。Java 类是通过 Java 虚拟机加载的，某个类的 class 文件在被 classloader 加载后，会生成对应的 Class 对象，之后就可以创建该类的实例。默认的虚拟机行为只会在启动时加载类，如果后期有一个类需要更新的话，单纯替换编译的 class 文件，Java 虚拟机是不会更新正在运行的 class。如果要实现热部署，最根本的方式是修改虚拟机的源代码，改变 classloader 的加载行为，使虚拟机能监听 class 文件的更新，重新加载 class 文件，这样的行为破坏性很大。

重新加载class会导致原先实例化的对象以及原先加载的class没法被JVM回收，这样会导致很大的问题。不过我们可以换一个思路，虽然无法抢先加载该类，但是仍然可以用自定义 classloader 创建一个功能相同的类，让每次实例化的对象都指向这个新的类。当这个类的 class 文件发生改变的时候，再次创建一个更新的类，之后如果系统再次发出实例化请求，创建的对象讲指向这个全新的类。

[http://www.ibm.com/developerworks/cn/java/j-lo-hotdeploy/index.html?ca=drs-](http://www.ibm.com/developerworks/cn/java/j-lo-hotdeploy/index.html?ca=drs-)

[http://blog.csdn.net/xiaojiang0829/article/details/17523791](http://blog.csdn.net/xiaojiang0829/article/details/17523791)

但是个人认为在生成坏境中，这种方式是绝对不可取的，一般现在的服务器都是集群的，挂掉一两个不成问题，所以只要轮流替重启新的服务就没有问题，当然带来的问题就是如果服务器上有一部分新的服务一部分旧的服务，这样会导致客户端访问的时候既有可能访问到新的又有可能访问的旧的。不必考虑什么热部署热加载。当然也不能说一点儿没用。

未完待续！