---
title: Google Guice!
first: Java Array 给定一个长度为N的整数数组，只允许用乘法，不能用除尘，计算任意（N-1)个数的组合中乘积最大的一组。
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

##一、Google Guice

Google Guice (读作"juice")是超轻量级的，下一代的，为Java 5及后续版本设计的依赖注入容器。它在连接对象、访问中间层等方面，体现了最大程度的灵活性和可维护性。

Guice还具有一些可选的特性比如：自定义scopes，传递依赖，静态属性注入，与Spring集成和AOP联盟方法注入等。

一部分人认为，Guice可以完全替代spring, 因为对于DI组件框架来说, 性能是很重要的, guice比spring快十倍左右, 另外, 也是最重要的一点, 使用spring很容易写成service locator的风格, 而用guice, 你会很自然的形成DI风格。甚至说，guice简单超轻量级的DI框架效率是spring的100倍，Spring使用XML使用将类与类之间的关系隔离到xml中，由容器负责注入被调用的对象，而guice将类与类之间的关系隔离到Module中，声名何处需要注入，由容器根据Module里的描述，注入被调用的对象,使用Annotation使用支持自定义Annotation标注，对于相同的接口定义的对象引用，为它们标注上不同的自定义Annotation注释，就可以达到同一个类里边的同一个接口的引用，注射给不同的实现，在Module里用标注做区分，灵活性大大增加。

##二、优缺点

与现有框架集成度高

众多现有优秀的框架（如struts1.x等）均提供了spring的集成入口，而且spring已经不仅仅是依赖注入，包括众多方面。

Spring也提供了对Hibernate等的集成，可大大简化开发难度。 

提供对于orm,rmi,webservice等等接口众多，体系庞大。可以与现有框架集成，不过仅仅依靠一个效率稍高的DI，就想取代spring的地位，有点难度。配置复杂度在xml中定位类与类之间的关系,难度低代码级定位类与类之间的关系,难度稍高 

##三、使用

Guice 主要概念小结：

使用 @Inject 请求依赖项。

将依赖项与 Module 中的实现绑定。

使用 Injector 引导应用程序。

使用 @Provides 方法增加灵活性。

[源码地址](https://code.google.com/p/google-guice/)

[使用教程](http://www.blogjava.net/xylz/archive/2009/12/22/306955.html)
　