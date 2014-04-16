---
title: Java Serializable !
first: Java的序列化与反序列化:进行对象序列化的话的主要原因就是实现对象持久化和进行网络传输，而序列化存储的目的主要是为了再恢复使用，也就是反序列化。
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

Java的序列化与反序列化，进行对象序列化的话的主要原因就是实现对象持久化和进行网络传输，而序列化存储的目的主要是为了再恢复使用，也就是反序列化。

我们知道Java中的对象都是存在于堆内存中的，而堆内存是可以被垃圾回收器不定期回收的。从对象被创建到被回收这一段时间就是Java对象的生命周期，也即Java对象只存活于这个时间段内。

对象被垃圾回收器回收意味着对象和对象中的成员变量所占的内存也就被回收，这意味着我们就再也得不到该对象的任何内容了，因为已经被销毁了嘛，当然我们可以再重新创建，但这时的对象的各种属性都又被重新初始化了。所以如果我们需要保存某对象的状态，然后再在未来的某段时间将该对象再恢复出来的话，则必须要在对象被销毁即被垃圾回收器回收之前保存对象的状态。要保存对象状态的话，我们可以使用文件、数据库，也可以使用序列化，这里我们主要介绍对象序列化。我们很有必要了解这方面的内容，因为对象序列化不仅在保存对象状态时可以被用到（对象持久化），在Java中的远程方法调用RMI也会被用到，在网络中要传输对象的话，则必须要对对象进行序列

{% highlight ruby %}

public class User implements Serializable {
	
	private static final long serialVersionUID = 1L;
	private String name;
    private String sex;  
    private String address;
    private int age;
    
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
    
    public String toString() {
    	return "[name = " + name + ", sex = " + sex + ", age = " + age + ", address = " + address + "]";   
    }

}


{% endhighlight %}


{% highlight ruby %}

public class UserTest {
	String filePath = "E:\\test\\user.txt";

	public void write() throws IOException {
		FileOutputStream fout = new FileOutputStream(filePath);
		ObjectOutputStream oout = new ObjectOutputStream(fout);

		User user1 = new User();
		user1.setAddress("as");
		user1.setName("as");
		user1.setSex("male");
		user1.setAge(16);
		oout.writeObject(user1);
		oout.writeObject(user1);
		oout.flush();
	}

	public void read() throws IOException, ClassNotFoundException {
		FileInputStream fin = new FileInputStream(filePath);
		ObjectInputStream oin = new ObjectInputStream(fin);

		User user1 = (User) oin.readObject();
		User user2 = (User) oin.readObject();
		System.out.println(user1.toString());
		System.out.println(user2.toString());
	}

	public static void main(String[] args) throws IOException,
			ClassNotFoundException {
		UserTest test = new UserTest();
		test.write();
		test.read();
	}
}

[name = as, sex = male, age = 16, address = as]
[name = as, sex = male, age = 16, address = as]

{% endhighlight %}

补充一：上面我们举得例子很简单，要保存的成员变量要么是基本类型的要么是String类型的。但有时成员变量有可能是引用类型的，这是的情况会复杂一点。那就是当要对某对象进行序列化时，该对象中的引用变量所引用的对象也会被同时序列化，并且该对象中如果也有引用变量的话则该对象也将被序列化。总结说来就是在序列化的时候，对象中的所有引用变量所对应的对象将会被同时序列化。这意味着，引用变量类型也都要实现Serializable接口。当然其他对象的序列化都是自动进行的。所以我们只要保证里面的引用类型是都实现Serializable接口就行了，如果没有的话，会在编译时抛出异常。如果序列化的对象中包含没有实现Serializable的成员变量的话，这时可以使用transient关键字，让序列化的时候跳过该成员变量。使用关键字transient可以让你在序列化的时候自动跳过transient所修饰的成员变量，在反序列化时这些变量会恢复到默认值。

补充二：如果某类实现了Serializable接口的话，其子类会自动编程可序列化的，这个好理解，继承嘛。

补充三：在反序列化的时候，并不会调用对象的构造器，这也好理解，如果调用了构造器的话，对象的状态不就又重新初始化了吗。

补充四：我们说到对象序列化的是为了保存对象的状态，即对象的成员变量，所以静态变量不会被序列化。