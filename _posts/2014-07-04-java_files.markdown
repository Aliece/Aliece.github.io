---
title: Java File!
first:  Java File
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

关于大量的文件，可能文件大小很大也可能很小，但是数量很多，可以考虑以年月日+UUID的方式来存储到文件系统，再将UUID作为主键将文件信息存储到数据库中，文件系统通过LUCENE来进行索引，如果条件满足，可以考虑分布式文件存储系统，道理都是相同的。