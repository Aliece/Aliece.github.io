---
title: Java Array N-1!
first: Java Array 给定一个长度为N的整数数组，只允许用乘法，不能用除尘，计算任意（N-1)个数的组合中乘积最大的一组。
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

给定一个长度为N的整数数组，只允许用乘法，不能用除尘，计算任意（N-1)个数的组合中乘积最大的一组。

##一、Pi = Si * Ti

{% highlight ruby %}

public class N {
	

public class N {
	
	public static int countN(int[] array) {
		int n = array.length;
		int[] p = new int[n];
		int[] s = new int[n];
		int[] t = new int[n];
		s[0] = 1;
		t[n-1] = 1;
		for(int i = 1 ; i < array.length; i++){
			s[i] = s[i-1]*array[i-1];
		}
		
		for(int i = n-2 ; i >=0; i--){
			t[i] = t[i+1]*array[i+1];
		}
		
		int max = -1000000;
		
		for(int i = 0; i<n; ++i) {
			p[i] = s[i]*t[i];
	        if(p[i] > max){
	        	max = p[i];
	        }
	    }
		
		return max;
	}
	
	public static void main(String[] args) {
		
		int a[]={1,2,3,4,-5};
		System.out.println(countN(a));
	}

}

  
{% endhighlight %}