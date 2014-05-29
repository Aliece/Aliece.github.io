---
title: Mysql-Like!
first:  对于模糊查询语句，最不利的情况是要like '%key%'这样的查询
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

对于模糊查询语句，最不利的情况是要like '%key%'这样的查询，但是如果是like '%key%'这种情况，那么mysql的索引在些查询方式上还是可以优化的。

网上常见的是ASCII的英文字符优化，如下：

select corp_code, corp_corp from tb_Z_Corp where corp_code like '0008%';

取key的ASCII码来进行大小判断:

优化前:

select corp_code, corp_corp from tb_Z_Corp where corp_code like '0008%';

select corp_code, corp_corp from tb_Z_Corp where corp_corp like '江%';

优化后：

select corp_code, corp_corp from tb_Z_Corp where corp_code >= '0008' and corp_code < '0009';

select corp_code, corp_corp from tb_Z_Corp where corp_corp >= '江' and corp_corp < CONCAT('江', x'EFBFBF');

[http://blog.csdn.net/firstboy0513/article/details/6912632](http://blog.csdn.net/firstboy0513/article/details/6912632)
