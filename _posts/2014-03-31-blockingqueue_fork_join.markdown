---
title: Java 并发!
first: Java并发中的有很多数据结构都是为了多线程服务的，比如阻塞队列（BlockingQueue）是一个支持两个附加操作的队列。
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

##一、BlockingQueue

Java并发中的有很多数据结构都是为了多线程服务的，比如阻塞队列（BlockingQueue）是一个支持两个附加操作的队列。有一个很经典的场景就是生产者与消费者，而阻塞队列就被常用于这种场景，假如队列里为空的时候，从队列获取元素的线程就会等待队列变为非空，假如队列里full的时候，生成元素的队列就会等待队列可用，这就是一个经典的生产者与消费者情景，阻塞队列提供了四种处理方法：抛出异常、返回特殊值，一直阻塞，超时退出。

在java7里面，一共给我们提供了7个阻塞队列：

ArrayBlockingQueue ：一个由数组结构组成的有界阻塞队列,FIFO队列。

LinkedBlockingQueue ：一个由链表结构组成的有界阻塞队列,FIFO队列。

PriorityBlockingQueue ：一个支持优先级排序的无界阻塞队列。

DelayQueue：一个使用优先级队列实现的无界阻塞队列。

SynchronousQueue：一个不存储元素的阻塞队列,维护一个排除的线程清单，等把元素加入或移出队列，不为队列元素维护任何存储空间。

LinkedTransferQueue：一个由链表结构组成的无界阻塞队列。

LinkedBlockingDeque：一个由链表结构组成的双向阻塞队列。

##二、Fork/Join

目前最火的java开发莫过于Hadoop了，他就是通过分布式计算来实现一个任务，最基本的原理无非就是Mapreduce，这边说的Fork/Join的原理基本类似，它是Java7提供了的一个用于并行执行任务的框架，无非就是把一个大的任务分割成若干个小任务，然后计算结果，最后对这些小任务的结果进行汇总后得到大任务的结果。

我们再通过Fork和Join这两个单词来理解下Fork/Join框架，Fork就是把一个大任务切分为若干子任务并行的执行，Join就是合并这些子任务的执行结果，最后得到这个大任务的结果。比如计算1+2+。。＋10000，可以分割成10个子任务，每个子任务分别对1000个数进行求和，最终汇总这10个子任务的结果。

下面我们来看一个简单的例子来说明：

{% highlight ruby %}

public class Count extends RecursiveTask<Integer>{
	
	private static final int all= 2;
	private int start;
	private int end;

	public Count(int start, int end) {
		this.start= start;
		this.end = end;
	}

	@Override
	protected Integer compute() {
		
		int sum = 0;
		
		boolean canCompute = (end-start) <= all;
		
		if(canCompute) {
			for (int i = start; i <= end; i++) {
				sum += i;
			}
		}else {
			 int middle = (start+end) / 2;
			 Count left = new Count(start, middle);
			 Count right = new Count(middle + 1,end);
			 
			 left.fork();
			 right.fork();
			 
			 int leftsum = left.join();
			 int rightsum = right.join();
			 
			 sum = leftsum + rightsum;
		}
		return sum;
	}
	
	public static void main(String[] args) {
		
		ForkJoinPool forkJoinPool = new ForkJoinPool();
		
		Count task = new Count(1, 4);
		
		forkJoinPool.execute(task);  
		
		Future<Integer> future = forkJoinPool.submit(task);
		
		try {
			System.out.println(task.get());
			System.out.println(future.get());
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (ExecutionException e) {
			e.printStackTrace();
		}
		
	}

}

{% endhighlight %}