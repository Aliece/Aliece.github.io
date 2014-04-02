---
title: Consistent Hash!
first: 在互联网迅速发展的年代，数据量暴增，所以大数据这个词也就顺势产生了，虽然我们这种屌丝程序员碰不到那种大规模的集群或者分布式系统，但是拥有一颗好学的心驱动着我们硬着头皮往上靠啊，据我所知，一般的分布式均匀分布是算法有
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

在互联网迅速发展的年代，数据量暴增，所以大数据这个词也就顺势产生了，虽然我们这种屌丝程序员碰不到那种大规模的集群或者分布式系统，但是拥有一颗好学的心驱动着我们硬着头皮往上靠啊，据我所知，一般的分布式均匀分布是算法有： 轮循算法(Round Robin)、哈希算法(HASH)、最少连接算法(Least Connection)、响应速度算法(Response Time)、加权法(Weighted )等等。而我们接触最多的就是哈希算法了，但是不管哪种算法，最终要解决的一个场景就是：有N台服务器，有M多个请求，如何把这M多个请求均匀的分配到N台服务器上面，每台服务器负责M/N的服务：

那么我们就想来看看一般情况下我们会怎么做呢：有的兄弟就会说，取模算法，对hash结果取余数 (hash() mod N )；没错，这的确能够解决平均分配问题，但是如果遇到新增一台服务器或者down掉一台服务器的时候，牛逼的同学可以去算一算，原先分配的请求有多少需要时改动的，当然这个是很多的：接下来我就说说目前流行的算法，也就是我们常用的Memcached所用的一致性哈希算法。当然具体的介绍我们可以去看看百度百科，那边肯定比我介绍的全：[一致性哈希](http://baike.baidu.com/link?url=2KThRifQ5turKKnyb9mZ-bXdGlG09fJXfLr7XVctRdLYDcTwdr_Cg1eQzo8hP7_6FY6nILuSCp-W20YCHuqs8q)

上面说它具有▪ 平衡性(Balance)▪ 单调性(Monotonicity)▪ 分散性(Spread)▪ 负载(Load)四个条件：

下面来看代码吧：

{% highlight ruby %}

	private final HashFunction hashFunction;

	private final int numberOfReplicas;

	private final SortedMap<Integer, T> circle = new TreeMap<Integer, T>();

	public ConsistentHash(HashFunction hashFunction, int numberOfReplicas,
			Collection<T> nodes) {
		this.hashFunction = hashFunction;
		this.numberOfReplicas = numberOfReplicas;

		for (T node : nodes) {
			add(node);
		}
	}

	public void add(T node) {
		for (int i = 0; i < numberOfReplicas; i++) {
			circle.put(hashFunction.hash(node.toString() + i), node);
		}
	}

	public void remove(T node) {
		for (int i = 0; i < numberOfReplicas; i++) {
			circle.remove(hashFunction.hash(node.toString() + i));
		}
	}

	public T get(Object key) {
		if (circle.isEmpty()) {
			return null;
		}
		int hash = hashFunction.hash(key);
		if (!circle.containsKey(hash)) {
			SortedMap<Integer, T> tailMap = circle.tailMap(hash);
			hash = tailMap.isEmpty() ? circle.firstKey() : tailMap.firstKey();
		}
		return circle.get(hash);
	}

	static class HashFunction {
		int hash(Object key) {
			return Md5Encrypt.md5(key.toString()).hashCode();
		}
	}

	public static void main(String[] args) {
		HashSet<String> set = new HashSet<String>();
		set.add("A");
		set.add("B");
		set.add("C");
		set.add("D");

		Map<String, Integer> map = new HashMap<String, Integer>();

		ConsistentHash<String> consistentHash = new ConsistentHash<String>(
				new HashFunction(), 100, set);

		int count = 10000;

		for (int i = 0; i < count; i++) {
			String key = consistentHash.get(i);
			if (map.containsKey(key)) {
				map.put(consistentHash.get(i), map.get(key) + 1);
			} else {
				map.put(consistentHash.get(i), 1);
			}
//			 System.out.println(key);
		}

		showServer(map);
		map.clear();
		consistentHash.remove("A");

		System.out.println("------- remove A");

		for (int i = 0; i < count; i++) {
			String key = consistentHash.get(i);
			if (map.containsKey(key)) {
				map.put(consistentHash.get(i), map.get(key) + 1);
			} else {
				map.put(consistentHash.get(i), 1);
			}
			// System.out.println(key);
		}

		showServer(map);
		map.clear();
		consistentHash.add("E");
		System.out.println("------- add E");

		for (int i = 0; i < count; i++) {
			String key = consistentHash.get(i);
			if (map.containsKey(key)) {
				map.put(consistentHash.get(i), map.get(key) + 1);
			} else {
				map.put(consistentHash.get(i), 1);
			}
			// System.out.println(key);
		}

		showServer(map);
		map.clear();

		consistentHash.add("F");
		System.out.println("------- add F服务器  业务量加倍");
		count = count * 2;
		for (int i = 0; i < count; i++) {
			String key = consistentHash.get(i);
			if (map.containsKey(key)) {
				map.put(consistentHash.get(i), map.get(key) + 1);
			} else {
				map.put(consistentHash.get(i), 1);
			}
			// System.out.println(key);
		}

		showServer(map);

	}

	public static void showServer(Map<String, Integer> map) {
		System.out.println(map.size());
		for (Entry<String, Integer> m : map.entrySet()) {
			System.out.println("服务器 " + m.getKey() + "----" + m.getValue()
					+ "个");
		}
	}
	
{% endhighlight %}

由于hash算法结果一般为unsigned int型，因此对于hash函数的结果应该均匀分布在[0,232 -1]间，如果我们把一个圆环用232 个点来进行均匀切割，首先按照hash(key)函数算出服务器(节点)的哈希值， 并将其分布到0～232 的圆上。

1. 新增一个节点：只有在圆环上新增节点到逆时针方向的第一个节点之间的数据会受到影响(增加节点顺时针的第一个节点的信息需要迁移到增加节点上)。

2. 删除一个节点：只有在圆环上原来删除节点到 逆时针 方向的第一个节点之间的数据会受到影响(删除节点的信息需要迁移到顺时针的第一个节点上) ，因此通过Consistent Hashing很好地解决了负载均衡中由于新增节点、删除节点引起的hash值颠簸问题。用同样的hash(key)函数求出需要存储数据的键的哈希值，并映射到圆上。然后从数据映射到的位置开始顺时针查找，将数据保存到找到的第一个服务器(节点)上。

虚拟节点(virtual nodes)： 之所以要引进虚拟节点是因为在服务器(节点)数较少的情况下(例如只有3台服务器)，通过hash(key)算出节点的哈希值在圆环上并不是均匀分布的(稀疏的)，仍然会出现各节点负载不均衡的问题。虚拟节点可以认为是实际节点的复制品(replicas)，本质上与实际节点实际上是一样的(key并不相同)。引入虚拟节点后，通过将每个实际的服务器(节点)数按照一定的比例(例如200倍)扩大后并计算其hash(key)值以均匀分布到圆环上。在进行负载均衡时候，落到虚拟节点的哈希值实际就落到了实际的节点上。由于所有的实际节点是按照相同的比例复制成虚拟节点的，因此解决了节点数较少的情况下哈希值在圆环上均匀分布的问题。

那么我们来看代码，首先，将四个服务器平均分配到环上面，其中有很多虚拟节点，numberOfReplicas这个就是虚拟节点的个数，每次重新分配的时候，都会去重新计算，当找不到circle.containsKey(hash)的时候，SortedMap<Integer, T> tailMap = circle.tailMap(hash);取大于这个hash值的子map，然后将节点放入比大于当前节点的第一个虚拟节点上面。

当然也有人会质疑，通过MD5加密的hash取值会降低效率，这里我就不去比较了，有兴趣的可以去试试。