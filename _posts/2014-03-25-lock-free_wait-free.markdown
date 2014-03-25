---
title: Lock-Free Wait-Free!
first: 在这个人口暴增，访问量暴增的年代，并发是一个避无可避的问题，经过一辈辈人的努力，从单线程到多线程，从排他锁到共享锁，从无锁到有锁，从有锁到无锁，一步步的演变。
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

在这个人口暴增，访问量暴增的年代，并发是一个避无可避的问题，经过一辈辈人的努力，从单线程到多线程，从排他锁到共享锁，从无锁到有锁，从有锁到无锁，一步步的演变。今天我们就来说说并发编程：

首先我们举个最简单的例子：两个线程A和B修改一个Object，如果我们不做任何操作，那么会出现三种情况：

Thread A : Object.setValue(A);

Thread B : Object.setValue(Object.getValue()+B);

1、A先抢占，修改了Object的Value为A；接着B抢占，修改了Object的Value为A+B。

2、B先抢占，修改了Object的Value为B；接着A抢占，修改了Object的Value为A。

3、线程B得到值＂object＂然后赋给本地变量Value。线程A改变Object的值为A。然后线程B醒来并把变量Object的值改为Value+B;

上面三个情况中只有3是错误的，除非你的场景必须这么做，那1跟2就是错误的了。

未完待续！