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


在MySQL 中，主要有四种类型的索引，分别为：B-Tree 索引，Hash 索引，Fulltext 索引和RTree索引

索引不仅能够提高数据检索的效率，降低数据库的IO 成本，还可以降低数据的排序成本。弊端就是需要承受索引带来的存储空间资源消耗的增长。

1. MyISAM 存储引擎索引键长度总和不能超过1000 字节；

2. BLOB 和TEXT 类型的列只能创建前缀索引；

3. MySQL 目前不支持函数索引；

4. 使用不等于（!= 或者<>）的时候MySQL 无法使用索引；

5. 过滤字段使用了函数运算后（如abs(column)），MySQL 无法使用索引；

6. Join 语句中Join 条件字段类型不一致的时候MySQL 无法使用索引；

7. 使用LIKE 操作的时候如果条件以通配符开始（ '%abc...'）MySQL 无法使用索引；

8. 使用非等值查询的时候MySQL 无法使用Hash 索引；