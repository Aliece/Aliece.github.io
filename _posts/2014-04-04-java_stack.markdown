---
title: Java TEST!
first: Java用两个栈（Stack）实现一个队列（Queue）
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

##一、用两个栈（Stack）实现一个队列（Queue）

{% highlight ruby %}

public class QueneT{
	private static Stack<Object> stackpush = new Stack<Object>();
	private static Stack<Object> stackpop = new Stack<Object>();
	
	public void QueueT(){}
	
	public Object deQueue() {
		Object o ;
		if(stackpop.isEmpty()) {
			for(int i = 1,size=stackpush.size();i<size;i++) {
				stackpop.add(stackpush.pop());
			}
			o = stackpush.pop();
		} else {
			o = stackpop.pop();
		}
		
		return o;
	}
	
	public boolean isEmpty() {
		boolean bool = (stackpop.isEmpty() && stackpush.isEmpty());
		return bool;
	}
	
	public int size() {
		int size = stackpop.size()+ stackpush.size();
		return size;
	}
	
	public void addQueue(Object o) {
		stackpush.add(o);
	}
	
	public static void main(String[] args) {
		QueneT queue = new QueneT();
		
		queue.addQueue("1");
		queue.addQueue("2");
		queue.addQueue("3");
		
		System.out.println(queue.deQueue());
		queue.addQueue("4");
		System.out.println(queue.deQueue());
		System.out.println(queue.deQueue());
		System.out.println(queue.deQueue());
		System.out.println(queue.size());
	}

}

{% endhighlight %}

##二、换位字符串

{% highlight ruby %}

public class Anagrams {
	
	public static boolean isAnagrams(String str1, String str2) {
		boolean bool = true ;
		
		if(str1.length() == str2.length()) {
			int[] strs1 = new int [256];
			int[] strs2 = new int [256];
			
			for(int i =0,len=str1.length(); i<len; i++ ) {
				strs1[(int)str1.charAt(i)]++;
				strs2[(int)str2.charAt(i)]++;
			}
			
			for(int i=0;i<256;++i){
				if(strs1[i]!=strs2[i]){
					bool = false;
				}
			}
		} else {
			bool = false;
		}
		
		return bool;
	}
	
	public static void main(String[] args) {
		System.out.println(isAnagrams("aabbcc", "babcca"));
	}

}

{% endhighlight %}

##三、i++;++i;

i++：先赋值再自加；

++i：先自加再赋值。

{% highlight ruby %}

int i = 1;
i= ++i + i++ ;
System.out.println("i:"+i);//i:4

{% endhighlight %}

上面的这段代码，首先对i赋值为1，接下来进行运算i=++i + i++,我们可以把它抽象出来看成i=x+y，其中x为++i，y为i++，接着我们来运算x，即++i，然后对i先自加再赋值，那么x为2，i也为2，然后运算y，先把i赋值给y也就是2，然后对自加，那么此时的i为3，最后再赋值i=x+y=4。

接着看下面一段代码就很明白了

{% highlight ruby %}

int i = 1;
int j = ++i + i++ ;
System.out.println("j:"+j);//j:4
System.out.println("i:"+i);//i:3

{% endhighlight %}

##四、链表的创建，添加以及去重

{% highlight ruby %}

class Node {
	Node next = null;
	int data;

	public Node(int d) {
		data = d;
	}

	void appendToTail(int d) {/* put data to tail */
		Node end = new Node(d);
		Node n = this;
		while (n.next != null) {
			n = n.next;
		}
		n.next = end;
	}

	Node deleteNode(Node head, int d) {
		Node n = head;
		if (n.data == d) {
			return head.next;/* moved head */
		}
		while (n.next != null) {
			if (n.next.data == d) {
				n.next = n.next.next;
				return head; /* head didn’t change */
			}
			n = n.next;
		}
		return head;
	}
	
	static void deleteDups(Node node) {
		Node previous = node;
		Hashtable<Integer, Boolean> table = new Hashtable<>();
		while(node!=null) {
			if(table.containsKey(node.data)) {
				previous.next = node.next;
			} else {
				table.put(node.data, true);
				previous = node;
		    }
			node = node.next;
		}
		
	}
	
	public static void deleteDups2(Node head) {
	    if (head == null) return;
	    Node previous = head;
	    Node current = previous.next;
	    while (current != null) {
	      Node runner = head;
	      while (runner != current) { // Check for earlier dups
	        if (runner.data == current.data) {
	          Node tmp = current.next; // remove current
	          previous.next = tmp; 
	          current = tmp; // update current to next node
	          break; // all other dups have already been removed
	        }
	        runner = runner.next;
	      }
	      if (runner == current) { // current not updated - update now
	        previous = current;
	        current = current.next;
	      }
	    }
	 }
	
	public static void main(String[] args) {
		Node head = new Node(1);
		
		head.appendToTail(2);
		head.appendToTail(3);
		head.appendToTail(4);
		head.appendToTail(3);
		
		deleteDups(head);
		
		while(head!=null) {
			System.out.println(head.data);
			head = head.next;
		}
		
		
	}
}

{% endhighlight %}

关于怎么来创建、添加和删除节点我这边都不说了，都是很简单的。我要说的是关于去重的两种方法的效率，第一种很简单，一般的人都能够想得出来，但是他使用了hashtable这么一个数据结构，频繁的IO都会是性能的无形杀手，所以这个效率会很低，接下来说说第二种，首先他会定义两个节点，一个是precious，一个是current，很简单，就是当前处于的节点和当前节点的父节点，然后做什么呢，就是从head到current节点遍历，如果遇到重复的就去重，没有的话，就把current节点向前移动一位，这样遍历一遍就能够完成去重了，效率明显比第一种要来的高。

找出倒数第N个节点：

{% highlight ruby %}

static Node nthToLast(Node head, int n) {
    if (head == null || n < 1) {
      return null;
    }
    Node p1 = head;
    Node p2 = head;
    for (int j = 0; j < n - 1; ++j) { // skip n-1 steps ahead
      if (p2 == null) {
        return null; // not found since list size < n
      }
      p2 = p2.next;
    }
    while (p2.next != null) {
      p1 = p1.next;
      p2 = p2.next;
      }
      return p1;
  }
  
{% endhighlight %}

大致的思想就是先p1遍历到正数第N个位置，然后于p2一起遍历到结尾，那么此时P2处的位置便是倒数第N位置。还有一种思维就是计算Node总的长度m，那么倒数第N个位置就是m-n+1。