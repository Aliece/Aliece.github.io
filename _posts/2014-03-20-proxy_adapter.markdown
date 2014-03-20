---
title: Proxy Adapter!
first: 很早以前就听说Spring的AOP，IOC，但是真正用到的也只有IOC而已，最近研究了一些Java的反射机制，所以打算自己弄一个类似于AOP的拦截器框架。
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

很早以前就听说Spring的AOP，IOC，但是真正用到的也只有IOC而已，最近研究了一些Java的反射机制，所以打算自己弄一个类似于AOP的拦截器框架。

这期间我们需要用到DynamicProxy，所以顺便把设计模式中的Proxy回顾一下：

##代理模式Proxy

首先看一张图：

<img src="/assets/images/DesignPatterns/proxy.jpg"></img>

Proxy：代理对象，通常具有如下功能。实现与具体的目标对象一样的接口，这样就可以使用代理来代替具体的目标对象。保存一个指向具体目标对象的引用（代理对象中有具体对象的成员变量），可以在需要的时候调用具体的目标对象。可以控制对具体对象的访问，并可以负责创建和删除它。

Subject：具体接口，定义代理和具体对象的接口，这样就可以在任何使用具体目标对象的地方使用代理对象。

RealSubject：具体的目标对象，真正实现目标接口要求的功能。

直接上代码：

{% highlight ruby %}

User.java

public interface User {
	public String getUserId() ;
	public void setUserId(String userId);
	
	public String getUserName() ;
	public void setUserName(String userName) ;
	
	public String getDeptId() ;
	public void setDeptId(String deptId);
	
	public String getSex() ;
	public void setSex(String sex) ;
}

Proxy.java

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
/**
 * 代理对象,代理用户数据对象
 */
public class Proxy implements User {
	/**
	 * 持有被代理的具体的目标对象
	 */
	private UserModel realSubject = null;
	private boolean loaded = false;//标志位，表示是否被加载过
	/**
	 * 构造方法，传入被代理的具体的目标对象
	 * @param realSubject 被代理的具体的目标对象
	 */
	public Proxy(UserModel realSubject) {
		this.realSubject = realSubject;
	}
	// 代理对象中只保存userId和userName属性，其他属性要从实体对象中获取
	@Override
	public String getUserId() {
		// TODO Auto-generated method stub
		return realSubject.getUserId();
	}
	@Override
	public void setUserId(String userId) {
		// TODO Auto-generated method stub
		realSubject.setUserId(userId);
	}
	@Override
	public String getUserName() {
		// TODO Auto-generated method stub
		return realSubject.getUserName();
	}
	@Override
	public void setUserName(String userName) {
		// TODO Auto-generated method stub
		realSubject.setUserName(userName);
	}
	@Override
	public String getDeptId() {
		// TODO Auto-generated method stub
		// 获取的非proxy对象中拥有的属性，则需要再次查询数据库获取
		if (!loaded)// 判断数据是否加载过。
		{
			reload();
			this.loaded = true;
		}
		return realSubject.getDeptId();
	}
	@Override
	public void setDeptId(String deptId) {
		// TODO Auto-generated method stub
		realSubject.setDeptId(deptId);
	}
	@Override
	public String getSex() {
		// TODO Auto-generated method stub
		if (!loaded) {
			reload();
			this.loaded = true;
		}
		return realSubject.getSex();
	}
	@Override
	public void setSex(String sex) {
		// TODO Auto-generated method stub
		realSubject.setSex(sex);
	}
	/**
	 * 重新查询数据库以获取完整的用户数据
	 */
	private void reload() {
		System.out.println("重新查询数据库获取完整的用户数据，userId=="
				+ realSubject.getUserId());
		Connection conn = null;
		try {
		Sysem.out.println("查询中！");
		} catch (Exception err) {
			err.printStackTrace();
		} finally {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	@Override
	public String toString(){
		return "userId="+getUserId()+",name="+getUserName()
		+",depId="+getDeptId()+",sex="+getSex()+"\n";
	}
}

UserModel.java

/**
 * 描述用户数据的对象
 */
public class UserModel implements User {
	private String userId;//用户编号
	private String userName;//用户姓名
	private String deptId;//部门编号
	private String sex;//性别
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	//重写Object类的toString()方法
	@Override
	public String toString(){
		return "userId="+userId+",name="+userName+",depId="+deptId+",sex="+sex+"\n";
	}
}

UserManager.java

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Collection;
/**
 * 实现示例要求的功能
 */
public class UserManager {
	/**
	 * 根据部门编号来获取该部门下的所有人员
	 * @param depId 部门编号
	 * @return 该部门下的所有人员
	 */
	public Collection<User> getUserById(String deptId) throws Exception {
		Collection<User> col = new ArrayList<UserM>();
		Connection conn = null;
		try {
			conn = DBConnection.getInstance().getConnection();
			//只需要查询userId和name两个值就可以了
			String sql = "select u.userid,u.name from tbl_user u ,tbl_dept d where u.deptid=d.deptid and u.deptid LIKE ?";
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, deptId+"%");
			ResultSet rs = ps.executeQuery();
			while (rs.next()) {
				//这里是创建的代理对象，而不是直接创建UserModel的对象
				Proxy proxy=new Proxy(new UserModel());
				//只是设置userId和name两个值就可以了
				proxy.setUserId(rs.getString("userid"));
				proxy.setUserName(rs.getString("name"));
				col.add(proxy);
			}
			rs.close();
			ps.close();
		} finally {
			conn.close();
		}
		return col;
	}
}

Client.java

import java.util.Collection;

public class Client {

	/**
	 * @param args
	 * @throws Exception 
	 */
	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		UserManager userManager=new UserManager();
		Collection<User> col=userManager.getUserById("0101");
		//如果只是显示用户名称，那么不需要重新查询数据库
		for(User umApi : col){
			System.out.println("用户编号：="+umApi.getUserId()+",用户姓名：="+umApi.getUserName());
		}		
		//如果访问非用户编号和用户姓名外的属性，那就会重新查询数据库
		for(User umApi : col){
			System.out.println("用户编号：="+umApi.getUserId()+",用户姓名：="+umApi.getUserName()+",所属部门：="+umApi.getDeptId());
		}
	}
}

{% endhighlight %}

相信大家都应该能看懂，不需要一次性把所有数据都load出来，这样可以减少很大一部分的IO.

接下来就来实现我们的拦截器吧：

Java.lang.reflect.Proxy是反射包的成员之一。具体说明请查javadoc。 用法就是比如有一个对象，我们需要在调用它提供的方法之前，干点别的什么，就不能直接调用它，而是生成一个它的代理，这个代理有这个对象所提供的所有接口方法，我们通过直接调用代理的这些方法来实现：函数既能像原来对象的那样工作，又能在函数运行过程前后加入我们自己的处理。这也就是AOP的面向过程编程的基本原理了。

{% highlight ruby %}

Object Java.lang.reflect.Proxy.newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h) throws IllegalArgumentException){}

{% endhighlight %} 

ClassLoader 是类加载器，这个参数用来定义代理类，一般使用原对象的即可，也可以为null用上下文解决。 

Class<?>[] 接口数组,就是我们需要这个代理能够提供原来的类的什么函数。如果全部则直接class.getInterfaces()来解决. 

InvocationHandler 调用处理器，这个就是如果你调用代理的方法，那么这个处理器就会被关联过来，处理调用这个函数的整个过程。这个接口只定义了一个方法:

{% highlight ruby %}

public Object invoke(Object proxy, Method method, Object[] args) throws Throwable; 

{% endhighlight %} 

参数中proxy就是你调用的代理，method指的是你调用的代理的那个方法，args是传给该方法的参数。

直接上干货吧:

{% highlight ruby %}

public interface IUser {
	
	public String getName();
	
	public void setName(String name);   
}

public class User implements IUser {
	String name;
	
	public User(String name) {
		this.name = name;
	}
	public String getName() {
		return name;
	}

	public void setName(String name) {
		String result = "Hello, " + name;   
		System.out.println(result); 
		this.name = name;

	}
}

public interface Interceptor {
	public void before(Method method, Object[] args);
	
	public void after(Method method, Object[] args);
	
	public void afterThrowing(Method method, Object[] args, Throwable throwable);
	
	public void afterFinally(Method method, Object[] args);
}

public class InterceptorImpl implements Interceptor {

	@Override
	public void after(Method method, Object[] args) {
		System.out.println("after invoking method: " + method.getName()); 

	}

	@Override
	public void afterFinally(Method method, Object[] args) {
		System.out.println("afterFinally invoking method: " + method.getName());

	}

	@Override
	public void afterThrowing(Method method, Object[] args, Throwable throwable) {
		System.out.println("afterThrowing invoking method: " + method.getName());

	}

	@Override
	public void before(Method method, Object[] args) {
		System.out.println("before invoking method: " + method.getName());

	}

}

public class TraceHandler implements InvocationHandler {
	
	public Object target;
	private Interceptor interceptor;
	
	public TraceHandler(Object target, Interceptor interceptor) {
		this.target = target;
		this.interceptor = interceptor;
	}

	@Override
	public Object invoke(Object proxy, Method method, Object[] args)
			throws Throwable {
		Object result ;
		 // print implicit argument
		System.out.print(target.getClass().getName());
		// print method name
		System.out.print("." + method.getName() + "(");
		// print explicit arguments
		if (args != null) {
			for (int i = 0; i < args.length; i++) {
				System.out.print(args[i]);
				if (i < args.length - 1) {
					System.out.print(",");
					}
				}
			}
		System.out.println(")");
		
		this.interceptor.before(method, args);
		
		result = method.invoke(this.target, args);   
		
		this.interceptor.after(method, args);
		
		return result;
	
	}
}

public class ProxyTest {
	User user;
	
	public ProxyTest() {
		user = new User("Aliece");
		
		ClassLoader cl = user.getClass().getClassLoader();
		
		System.out.println(cl.getParent());
		
		Class[] intefers = user.getClass().getInterfaces();
		
		for(Class classs : intefers) {
			System.out.println(classs.getName());
		}
		
		Interceptor inte = new InterceptorImpl();
		
		InvocationHandler handler = new TraceHandler(user, inte);
		
		IUser proxy = (IUser) Proxy.newProxyInstance(cl, intefers, handler);
		
		proxy.setName("TT");
		
		System.out.println(proxy.getName());
	}
	
	public static void main(String[] args) {
		new ProxyTest();
	}
}

{% endhighlight %} 

根据上面的代码，我们就可以很容易的实现一个类似AOP以及拦截器的模式。

讲完上面的例子，我们来尝试一下另外一种设计模式：Adapter（适配器模式）：

##适配器模式Adapter

首先看一张图：

<img src="/assets/images/DesignPatterns/adapter.png"></img>

从图中我们可以看出来：

Client：客户端，调用自己需要的领域接口Target

Target：定义客户端需要的跟特定领域相关的接口

Adaptee：已经存在的接口，通常能满足客户端的功能需求，但是接口和客户端要求的特定领域接口不一致，需要被适配

Adapter：适配器，把Adaptee适配称为Client需要的Target

上代码：

{% highlight ruby %}

Target.java

public interface Target {

	public void request();
}

Adaptee.java

public class Adaptee {
	
 public void specificRequest() {  
        //具体的功能处理  
        System.out.println("this is in Adaptee!");  
    }
}

public class Adapter implements Target {  
    /** 
     * 持有需要被适配的接口对象 
     */  
    private Adaptee adaptee;  
    /** 
     * 构造方法，传入需要被适配的对象 
     * @param adaptee 需要被适配的对象 
     */  
    public Adapter(Adaptee adaptee) {  
        this.adaptee = adaptee;  
    }  
  
    public void request() {  
        System.out.println("this is in Adapter!");  
        //可能转调已经实现了的方法，进行适配  
        adaptee.specificRequest();  
    } 
}

import java.util.*;
public class Client {
	public static void main(String[] args) {
		//准备日志内容，也就是测试的数据
		LogModel lm1 = new LogModel();
		lm1.setLogId("001");
		
		List<LogModel> list = new ArrayList<LogModel>();
		list.add(lm1);

		//创建操作日志文件的对象
		LogFileOperateApi api = new LogFileOperate(""); 
		
		//保存日志文件
		api.writeLogFile(list);
		
		//读取日志文件的内容
		List<LogModel> readLog = api.readLogFile();
		System.out.println("readLog="+readLog);
	}
}

import java.io.*;

/**
 * 日志数据对象
 */
public class LogModel implements Serializable{

	private static final long serialVersionUID = 1L;
	/**
	 * 日志编号
	 */
	private String logId;
	/**
	 * 操作人员
	 */
	private String operateUser;
	/**
	 * 操作时间，以yyyy-MM-dd HH:mm:ss的格式记录
	 */
	private String operateTime;	
	/**
	 * 日志内容
	 */
	private String logContent;
	
	//getter and setter
	public String getLogId() {
		return logId;
	}
	public void setLogId(String logId) {
		this.logId = logId;
	}
	public String getOperateUser() {
		return operateUser;
	}
	public void setOperateUser(String operateUser) {
		this.operateUser = operateUser;
	}
	public String getOperateTime() {
		return operateTime;
	}
	public void setOperateTime(String operateTime) {
		this.operateTime = operateTime;
	}
	public String getLogContent() {
		return logContent;
	}
	public void setLogContent(String logContent) {
		this.logContent = logContent;
	}
	
	public String toString(){
		return "logId="+logId+",operateUser="+operateUser+",operateTime="+operateTime+",logContent="+logContent;
	}
}

import java.util.List;
/**
 * 日志文件操作接口
 */
public interface LogFileOperateApi {
	/**
	 * 读取日志文件，从文件里面获取存储的日志列表对象
	 * @return 存储的日志列表对象
	 */
	public List<LogModel> readLogFile();
	
	/**
	 * 写日志文件，把日志列表写出到日志文件中去
	 * @param list 要写到日志文件的日志列表
	 */
	public void writeLogFile(List<LogModel> list);
}

import java.io.*;
import java.util.*;

/**
 * 实现对日志文件的操作
 */
public class LogFileOperate implements LogFileOperateApi{
	/**
	 * 日志文件的路径和文件名称，默认是当前classpath下的AdapterLog.log
	 * 就是项目的根目录下，与.classpath文件同目录
	 */
	private String logFilePathName = "AdapterLog.log";	
	/**
	 * 构造方法，传入文件的路径和名称
	 * @param logFilePathName 文件的路径和名称
	 */
	public LogFileOperate(String logFilePathName) {
		//先判断是否传入了文件的路径和名称，如果是，
		//就重新设置操作的日志文件的路径和名称
		if(logFilePathName!=null && logFilePathName.trim().length()>0){
			this.logFilePathName = logFilePathName;
		}
	}
	
	//读文件
	public  List<LogModel> readLogFile() {
		List<LogModel> list = null;
		ObjectInputStream oin = null;
		try {
			File f = new File(logFilePathName);
			if(f.exists()){
				oin = new ObjectInputStream(
						new BufferedInputStream(new FileInputStream(f))
				);
				list = (List<LogModel>)oin.readObject();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				if(oin!=null){
					oin.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return list;
	}

	//写文件
	public void writeLogFile(List<LogModel> list){
		File f = new File(logFilePathName);
		ObjectOutputStream oout = null;
		try {
			oout = new ObjectOutputStream(
					new BufferedOutputStream(new FileOutputStream(f))
			);
			oout.writeObject(list);			
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			try {
				oout.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}

适配器版本：


import java.util.*;
/**
 * 定义操作日志的应用接口，为了示例的简单，
 * 只是简单的定义了增删改查的方法
 */
public interface LogDbOperateApi {
	/**
	 * 新增日志
	 * @param lm 需要新增的日志对象
	 */
	public void createLog(LogModel lm);
	/**
	 * 修改日志
	 * @param lm 需要修改的日志对象
	 */
	public void updateLog(LogModel lm);
	/**
	 * 删除日志
	 * @param lm 需要删除的日志对象
	 */
	public void removeLog(LogModel lm);
	/**
	 * 获取所有的日志
	 * @return 所有的日志对象
	 */
	public List<LogModel> getAllLog();
}


import java.util.List;

/**
 * 适配器对象，把记录日志到文件的功能适配成第二版需要的增删改查的功能
 */
public class Adapter implements LogDbOperateApi{
	/**
	 * 持有需要被适配的接口对象
	 */
	private LogFileOperateApi adaptee;
	/**
	 * 构造方法，传入需要被适配的对象
	 * @param adaptee 需要被适配的对象
	 */
	public Adapter(LogFileOperateApi adaptee) {
		this.adaptee = adaptee;
	}

	@Override
	public void createLog(LogModel lm) {
		//首先创建日志并保存到数据库中，此处省略
		System.out.println("now in LogDbOperate createLog");
		//接下来是日子文件操作
		//1：先读取文件的内容
		List<LogModel> list = adaptee.readLogFile();
		
		//2：加入新的日志对象
		System.out.println(lm.getLogId());
		list.add(lm);
		//3：重新写入文件
		adaptee.writeLogFile(list);
	}
	
	@Override
	public List<LogModel> getAllLog() {
		//读取数据库中的日志文件，此处省略
		System.out.println("now in LogDbOperate getAllLog");
		//接下来是日子文件操作
		return adaptee.readLogFile();
	}
	
	@Override
	public void removeLog(LogModel lm) {
		//删除数据库中的日志文件，此处省略
		System.out.println("now in LogDbOperate removeLog");
		//接下来是日子文件操作
		//1：先读取文件的内容
		List<LogModel> list = adaptee.readLogFile();
		//2：删除相应的日志对象
		list.remove(lm);
		//3：重新写入文件
		adaptee.writeLogFile(list);
	}
	
	@Override
	public void updateLog(LogModel lm) {
		//更新数据库中的日志文件，此处省略
		System.out.println("now in LogDbOperate updateLog");
		//接下来是日子文件操作
		//1：先读取文件的内容
		List<LogModel> list = adaptee.readLogFile();
		//2：修改相应的日志对象
		for(int i=0;i<list.size();i++){
			if(list.get(i).getLogId().equals(lm.getLogId())){
				list.set(i, lm);
				break;
			}
		}
		//3：重新写入文件
		adaptee.writeLogFile(list);
	}
}


import java.util.*;
public class Client {
	public static void main(String[] args) {
		//准备日志内容，也就是测试的数据
		LogModel lm1 = new LogModel();
		lm1.setLogId("001");
		lm1.setOperateUser("admin");
		lm1.setOperateTime("2010-03-02 10:08:18");
		lm1.setLogContent("这是一个测试");
		
		List<LogModel> list = new ArrayList<LogModel>();
		list.add(lm1);

		//创建操作日志文件的对象
		LogFileOperateApi logFileApi = new LogFileOperate("");
		
		//创建新版的操作日志的接口对象
		LogDbOperateApi api = new Adapter(logFileApi); 
		
		//保存日志文件
		api.createLog(lm1);
		
		//读取日志文件的内容
		List<LogModel> allLog = api.getAllLog();
		System.out.println("allLog="+allLog);
	}
}

{% endhighlight %} 

注意两个客户端的变化，可以发现已经进行匹配，复用了原先已有的功能，不需要再对原来的代码进行修改就可以实现新增的功能。

期间的例子基本都是别人的，所以看明白就行了。
