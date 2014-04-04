---
title: Java ThreadLocal!
first: Java ThreadLocal
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

##一、ThreadLocal

{% highlight ruby %}

public class ThreadLocal<T> {  
    /** 
     * ThreadLocals rely on per-thread hash maps attached to each thread 
     * (Thread.threadLocals and inheritableThreadLocals).  The ThreadLocal 
     * objects act as keys, searched via threadLocalHashCode.  This is a 
     * custom hash code (useful only within ThreadLocalMaps) that eliminates 
     * collisions in the common case where consecutively constructed 
     * ThreadLocals are used by the same threads, while remaining well-behaved 
     * in less common cases. 
     */  
    private final int threadLocalHashCode = nextHashCode();  
  
    /** 
     * The next hash code to be given out. Accessed only by like-named method. 
     */  
    private static int nextHashCode = 0;  
  
    /** 
     * The difference between successively generated hash codes - turns 
     * implicit sequential thread-local IDs into near-optimally spread 
     * multiplicative hash values for power-of-two-sized tables. 
     */  
    private static final int HASH_INCREMENT = 0x61c88647;  
  
    /** 
     * Compute the next hash code. The static synchronization used here 
     * should not be a performance bottleneck. When ThreadLocals are 
     * generated in different threads at a fast enough rate to regularly 
     * contend on this lock, memory contention is by far a more serious 
     * problem than lock contention. 
     */  
    private static synchronized int nextHashCode() {  
        int h = nextHashCode;  
        nextHashCode = h + HASH_INCREMENT;  
        return h;  
    }  
  
    /** 
     * Creates a thread local variable. 
     */  
    public ThreadLocal() {  
    }  
  
    /** 
     * Returns the value in the current thread's copy of this thread-local 
     * variable.  Creates and initializes the copy if this is the first time 
     * the thread has called this method. 
     * 
     * @return the current thread's value of this thread-local 
     */  
    public T get() {  
        Thread t = Thread.currentThread();  
        ThreadLocalMap map = getMap(t);  
        if (map != null)  
            return (T)map.get(this);  
  
        // Maps are constructed lazily.  if the map for this thread  
        // doesn't exist, create it, with this ThreadLocal and its  
        // initial value as its only entry.  
        T value = initialValue();  
        createMap(t, value);  
        return value;  
    }  
  
    /** 
     * Sets the current thread's copy of this thread-local variable 
     * to the specified value.  Many applications will have no need for 
     * this functionality, relying solely on the {@link #initialValue} 
     * method to set the values of thread-locals. 
     * 
     * @param value the value to be stored in the current threads' copy of 
     *        this thread-local. 
     */  
    public void set(T value) {  
        Thread t = Thread.currentThread();  
        ThreadLocalMap map = getMap(t);  
        if (map != null)  
            map.set(this, value);  
        else  
            createMap(t, value);  
    }  
  
    /** 
     * Get the map associated with a ThreadLocal. Overridden in 
     * InheritableThreadLocal. 
     * 
     * @param  t the current thread 
     * @return the map 
     */  
    ThreadLocalMap getMap(Thread t) {  
        return t.threadLocals;  
    }  
  
    /** 
     * Create the map associated with a ThreadLocal. Overridden in 
     * InheritableThreadLocal. 
     * 
     * @param t the current thread 
     * @param firstValue value for the initial entry of the map 
     * @param map the map to store. 
     */  
    void createMap(Thread t, T firstValue) {  
        t.threadLocals = new ThreadLocalMap(this, firstValue);  
    }  
  
    .......  
  
    /** 
     * ThreadLocalMap is a customized hash map suitable only for 
     * maintaining thread local values. No operations are exported 
     * outside of the ThreadLocal class. The class is package private to 
     * allow declaration of fields in class Thread.  To help deal with 
     * very large and long-lived usages, the hash table entries use 
     * WeakReferences for keys. However, since reference queues are not 
     * used, stale entries are guaranteed to be removed only when 
     * the table starts running out of space. 
     */  
    static class ThreadLocalMap {  
  
    ........  
  
    }  
  
} 

{% endhighlight %}


##二、ThreadLocalDemo

{% highlight ruby %}

public class ThreadLocalDemo implements Runnable{
	
	private static final ThreadLocal<Object> teacher = new ThreadLocal<>();
	
	
	public static void main(String[] args) {
		ThreadLocalDemo td = new ThreadLocalDemo();
		
		Thread a = new Thread(td, "张三");
		Thread b = new Thread(td, "李四");
		a.start();
		b.start();
	}
	
	public void accessTeacher() {
		String teacherName = Thread.currentThread().getName();
		Random random = new Random();
        int age = random.nextInt(100);
        System.out.println("thread " + teacherName + " set age to:" + age);
        Teacher teachers = getTeacher();
        teachers.setAge(age);
        System.out.println("thread " + teacherName + " first read age is:" + teachers.getAge());
        try {
            Thread.sleep(500);
        }
        catch (InterruptedException ex) {
            ex.printStackTrace();
        }
        System.out.println("thread " + teacherName + " second read age is:" + teachers.getAge());
		
	}
	
	@Override
	public void run() {
		accessTeacher();
	}
	
	
	protected Teacher getTeacher() {
		Teacher tea = (Teacher) teacher.get();
		
		if(tea == null) {
			tea = new Teacher();
			teacher.set(tea);
		}
		
		return tea;
			
	}
	class Teacher{
		
		private String name;
		private Integer age;
		
		public Teacher() {}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public Integer getAge() {
			return age;
		}

		public void setAge(Integer age) {
			this.age = age;
		}
		
		
	}
}
  
{% endhighlight %}


ThreadLocal使用场合主要解决多线程中数据数据因并发产生不一致问题。ThreadLocal为每个线程的中并发访问的数据提供一个副本，通过访问副本来运行业务，这样的结果是耗费了内存，单大大减少了线程同步所带来性能消耗，也减少了线程并发控制的复杂度。
 
ThreadLocal不能使用原子类型，只能使用Object类型。ThreadLocal的使用比synchronized要简单得多。
 
ThreadLocal和Synchonized都用于解决多线程并发访问。但是ThreadLocal与synchronized有本质的区别。synchronized是利用锁的机制，使变量或代码块在某一时该只能被一个线程访问。而ThreadLocal为每一个线程都提供了变量的副本，使得每个线程在某一时间访问到的并不是同一个对象，这样就隔离了多个线程对数据的数据共享。而Synchronized却正好相反，它用于在多个线程间通信时能够获得数据共享。
 
Synchronized用于线程间的数据共享，而ThreadLocal则用于线程间的数据隔离。
 
当然ThreadLocal并不能替代synchronized,它们处理不同的问题域。Synchronized用于实现同步机制，比ThreadLocal更加复杂。