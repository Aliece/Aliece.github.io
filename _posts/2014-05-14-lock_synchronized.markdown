---
title: lock synchronized!
first:  tcp & osi
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

ReentrantLock 拥有Synchronized相同的并发性和内存语义，此外还多了 锁投票，定时锁等候和中断锁等候

     线程A和B都要获取对象O的锁定，假设A获取了对象O锁，B将等待A释放对O的锁定，
     如果使用 synchronized ，如果A不释放，B将一直等下去，不能被中断
     如果 使用ReentrantLock，如果A不释放，可以使B在等待了足够长的时间以后，中断等待，而干别的事情
     
synchronized是在JVM层面上实现的，不但可以通过一些监控工具监控synchronized的锁定，而且在代码执行时出现异常，JVM会自动释放锁定，但是使用Lock则不行，lock是通过代码实现的，要保证锁定一定会被释放，就必须将unLock()放到finally{}中

在资源竞争不是很激烈的情况下，Synchronized的性能要优于ReetrantLock，但是在资源竞争很激烈的情况下，Synchronized的性能会下降几十倍，但是ReetrantLock的性能能维持常态；

lock是java实现的，通过cas来实现加锁通过trylock来降低死锁