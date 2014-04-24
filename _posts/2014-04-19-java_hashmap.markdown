---
title: HasMap!
first: HashMap是基于哈希表的Map接口的非同步实现。此实现提供所有可选的映射操作，并允许使用null值和null键。此类不保证映射的顺序，特别是它不保证该顺序恒久不变。
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

HashMap是基于哈希表的Map接口的非同步实现。此实现提供所有可选的映射操作，并允许使用null值和null键。此类不保证映射的顺序，特别是它不保证该顺序恒久不变。
 
在java编程语言中，最基本的结构就是两种，一个是数组，另外一个是模拟指针（引用），所有的数据结构都可以用这两个基本结构来构造的，HashMap也不例外。HashMap实际上是一个“链表散列”的数据结构，即数组和链表的结合体。

HashMap底层就是一个数组结构，数组中的每一项又是一个链表。当新建一个HashMap的时候，就会初始化一个数组。

{% highlight ruby %}

/**
 * The table, resized as necessary. Length MUST Always be a power of two.
 */
transient Entry[] table;

static class Entry<K,V> implements Map.Entry<K,V> {
    final K key;
    V value;
    Entry<K,V> next;
    final int hash;
    ……
}

{% endhighlight %}

Entry就是数组中的元素，每个 Map.Entry 其实就是一个key-value对，它持有一个指向下一个元素的引用，这就构成了链表。


hashmap的存储：

{% highlight ruby %}

public V put(K key, V value) {
    // HashMap允许存放null键和null值。
    // 当key为null时，调用putForNullKey方法，将value放置在数组第一个位置。
    if (key == null)
        return putForNullKey(value);
    // 根据key的keyCode重新计算hash值。
    int hash = hash(key.hashCode());
    // 搜索指定hash值在对应table中的索引。
    int i = indexFor(hash, table.length);
    // 如果 i 索引处的 Entry 不为 null，通过循环不断遍历 e 元素的下一个元素。
    for (Entry<K,V> e = table[i]; e != null; e = e.next) {
        Object k;
        if (e.hash == hash && ((k = e.key) == key || key.equals(k))) {
            V oldValue = e.value;
            e.value = value;
            e.recordAccess(this);
            return oldValue;
        }
    }
    // 如果i索引处的Entry为null，表明此处还没有Entry。
    modCount++;
    // 将key、value添加到i索引处。
    addEntry(hash, key, value, i);
    return null;
}

从上面的源代码中可以看出：当我们往HashMap中put元素的时候，先根据key的hashCode重新计算hash值，根据hash值得到这个元素在数组中的位置（即下标），如果数组该位置上已经存放有其他元素了，那么在这个位置上的元素将以链表的形式存放，新加入的放在链头，最先加入的放在链尾。如果数组该位置上没有元素，就直接将该元素放到此数组中的该位置上。

void addEntry(int hash, K key, V value, int bucketIndex) {
    // 获取指定 bucketIndex 索引处的 Entry 
    Entry<K,V> e = table[bucketIndex];
    // 将新创建的 Entry 放入 bucketIndex 索引处，并让新的 Entry 指向原来的 Entry
    table[bucketIndex] = new Entry<K,V>(hash, key, value, e);
    // 如果 Map 中的 key-value 对的数量超过了极限
    if (size++ >= threshold)
    // 把 table 对象的长度扩充到原来的2倍。
        resize(2 * table.length);
}

当系统决定存储HashMap中的key-value对时，完全没有考虑Entry中的value，仅仅只是根据key来计算并决定每个Entry的存储位置。我们完全可以把 Map 集合中的 value 当成 key 的附属，当系统决定了 key 的存储位置之后，value 随之保存在那里即可。

HashMap的resize（rehash）：

当HashMap中的元素越来越多的时候，hash冲突的几率也就越来越高，因为数组的长度是固定的。所以为了提高查询的效率，就要对HashMap的数组进行扩容，数组扩容这个操作也会出现在ArrayList中，这是一个常用的操作，而在HashMap数组扩容之后，最消耗性能的点就出现了：原数组中的数据必须重新计算其在新数组中的位置，并放进去，这就是resize。那么HashMap什么时候进行扩容呢？当HashMap中的元素个数超过数组大小*loadFactor时，就会进行数组扩容，loadFactor的默认值为0.75，这是一个折中的取值。也就是说，默认情况下，数组大小为16，那么当HashMap中元素个数超过16*0.75=12的时候，就把数组的大小扩展为 2*16=32，即扩大一倍，然后重新计算每个元素在数组中的位置，而这是一个非常消耗性能的操作，所以如果我们已经预知HashMap中元素的个数，那么预设元素的个数能够有效的提高HashMap的性能。

key为null:

if (key == null)
	return putForNullKey(value);
//那就看看这个putForNullKey是怎么处理的吧。
private V putForNullKey(V value) {
	for (Entry<K,V> e = table[0]; e != null; e = e.next) {
		if (e.key == null) {
			V oldValue = e.value;
			e.value = value;
			e.recordAccess(this);
			return oldValue;
		}
	}
	modCount++;
	addEntry(0, null, value, 0);
	return null;
}

可以看到，前面那个for循环，是在talbe[0]链表中查找key为null的元素，如果找到，则将value重新赋值给这个元素的value，并返回原来的value。如果上面for循环没找到。则将这个元素添加到talbe[0]链表的表头。 

public V get(Object key) {
	if (key == null)
    	return getForNullKey();
	int hash = hash(key.hashCode());
	for (Entry<K,V> e = table[indexFor(hash, table.length)];e != null;e = e.next) {
		Object k;
		if (e.hash == hash && ((k = e.key) == key || key.equals(k)))
		return e.value;
	}
	return null;
}
{% endhighlight %}

前面两行是找key为null的元素，前面说过，key为null的元素，是放在table[0]这个链表的。所以要找的话，直接到table[0]中查找就行了。如果没找到的话。则根据key的hash值找到元素所在table中下标索引，根据其在找到元素所在链表，在遍历链表，找到该元素并返回其value，否则返回null。

##HashSet 

对于HashSet而言，它是基于HashMap实现的，HashSet底层使用HashMap来保存所有元素，因此HashSet 的实现比较简单，相关HashSet的操作，基本上都是直接调用底层HashMap的相关方法来完成,对于HashSet中保存的对象，请注意正确重写其equals和hashCode方法，以保证放入的对象的唯一性。

##HashTable

hashMap的读写是unsynchronized, 在多线程的环境中要注意使用 ,而hashtable是synchronized 这两者的不同是通过在读写方法上加synchronized关键字来实现的.

第二个不同是hashMap可以放空值, 而hashtable就会报错.

##ConcurrentHashMap

ConcurrentHashMap和Hashtable主要区别就是围绕着锁的粒度以及如何锁。如图

<p><img src="/assets/images/hash.jpg"></p>

左边便是Hashtable的实现方式---锁整个hash表；而右边则是ConcurrentHashMap的实现方式---锁桶（或段）。ConcurrentHashMap将hash表分为16个桶（默认值），诸如get,put,remove等常用操作只锁当前需要用到的桶。试想，原来只能一个线程进入，现在却能同时16个写线程进入（写线程才需要锁定，而读线程几乎不受限制，之后会提到），并发性的提升是显而易见的。0更令人惊讶的是ConcurrentHashMap的读取并发，因为在读取的大多数时候都没有用到锁定，所以读取操作几乎是完全的并发操作，而写操作锁定的粒度又非常细，比起之前又更加快速（这一点在桶更多时表现得更明显些）。只有在求size等操作时才需要锁定整个表。而在迭代时，ConcurrentHashMap使用了不同于传统集合的快速失败迭代器（见之前的文章《JAVA API备忘---集合》）的另一种迭代方式，我们称为弱一致迭代器。在这种迭代方式中，当iterator被创建后集合再发生改变就不再是抛出ConcurrentModificationException，取而代之的是在改变时new新的数据从而不影响原有的数据，iterator完成后再将头指针替换为新的数据，这样iterator线程可以使用原来老的数据，而写线程也可以并发的完成改变，更重要的，这保证了多个线程并发执行的连续性和扩展性，是性能提升的关键。
  
  接下来，让我们看看ConcurrentHashMap中的几个重要方法，心里知道了实现机制后，使用起来就更加有底气。
    
ConcurrentHashMap中主要实体类就是三个：ConcurrentHashMap（整个Hash表）,Segment（桶），HashEntry（节点），对应上面的图可以看出之间的关系。
    
get方法（请注意，这里分析的方法都是针对桶的，因为ConcurrentHashMap的最大改进就是将粒度细化到了桶上），首先判断了当前桶的数据个数是否为0，为0自然不可能get到什么，只有返回null，这样做避免了不必要的搜索，也用最小的代价避免出错。然后得到头节点（方法将在下面涉及）之后就是根据hash和key逐个判断是否是指定的值，如果是并且值非空就说明找到了，直接返回；程序非常简单，但有一个令人困惑的地方，这句return readValueUnderLock(e)到底是用来干什么的呢？研究它的代码，在锁定之后返回一个值。但这里已经有一句V v = e.value得到了节点的值，这句return readValueUnderLock(e)是否多此一举？事实上，这里完全是为了并发考虑的，这里当v为空时，可能是一个线程正在改变节点，而之前的get操作都未进行锁定，根据bernstein条件，读后写或写后读都会引起数据的不一致，所以这里要对这个e重新上锁再读一遍，以保证得到的是正确值，这里不得不佩服Doug Lee思维的严密性。整个get操作只有很少的情况会锁定，相对于之前的Hashtable，并发是不可避免的啊！

{% highlight ruby %}

V get(Object key, int hash) {
    if (count != 0) { // read-volatile
        HashEntry e = getFirst(hash);
        while (e != null) {
            if (e.hash == hash && key.equals(e.key)) {
                V v = e.value;
                if (v != null)
                    return v;
                return readValueUnderLock(e); // recheck
            }
            e = e.next;
        }
    }
    return null;
}
        
 V readValueUnderLock(HashEntry e) {
    lock();
    try {
        return e.value;
    } finally {
        unlock();
    }
}

{% endhighlight %}

[http://ifeve.com/java-concurrent-hashmap-1/](http://ifeve.com/java-concurrent-hashmap-1/)

[http://zhangshixi.iteye.com/blog/672697](http://zhangshixi.iteye.com/blog/672697)
