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

当然也有人会质疑，通过MD5加密的hash取值会降低效率，这里我就不去比较了，有兴趣的可以去试试。