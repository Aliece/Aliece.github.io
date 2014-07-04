---
title: Java MyBaits Lazy-Loading!
first:  Java MyBaits Lazy-Loading
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

如果只需要ID而不需要获取整个实例，那么可以修改ProxyFactory

{% highlight ruby %}

public class ExtraProxyFactory implements ProxyFactory {

	private static final Log log = LogFactory.getLog(CglibProxyFactory.class);
	private static final String FINALIZE_METHOD = "finalize";
	private static final String WRITE_REPLACE_METHOD = "writeReplace";
	private static final String SKIP_METHOD = "getId";

	@Override
	public void setProperties(Properties properties) {
		try {
			Resources.classForName("net.sf.cglib.proxy.Enhancer");
		} catch (Throwable e) {
			throw new IllegalStateException(
					"Cannot enable lazy loading because CGLIB is not available. Add CGLIB to your classpath.", e);
		}
	}

	@Override
	public Object createProxy(Object target, ResultLoaderMap lazyLoader, Configuration configuration,
			ObjectFactory objectFactory, List<Class<?>> constructorArgTypes, List<Object> constructorArgs) {
		return EnhancedResultObjectProxyImpl.createProxy(target, lazyLoader, configuration, objectFactory,
				constructorArgTypes, constructorArgs);
	}

	private static Object crateProxy(Class<?> type, Callback callback, List<Class<?>> constructorArgTypes,
			List<Object> constructorArgs) {
		Enhancer enhancer = new Enhancer();
		enhancer.setCallback(callback);
		enhancer.setSuperclass(type);
		try {
			type.getDeclaredMethod(WRITE_REPLACE_METHOD);
			// ObjectOutputStream will call writeReplace of objects returned by
			// writeReplace
			log.debug(WRITE_REPLACE_METHOD + " method was found on bean " + type + ", make sure it returns this");
		} catch (NoSuchMethodException e) {
			enhancer.setInterfaces(new Class[] { WriteReplaceInterface.class });
		} catch (SecurityException e) {
			// nothing to do here
		}
		Object enhanced = null;
		if (constructorArgTypes.isEmpty()) {
			enhanced = enhancer.create();
		} else {
			Class<?>[] typesArray = constructorArgTypes.toArray(new Class[constructorArgTypes.size()]);
			Object[] valuesArray = constructorArgs.toArray(new Object[constructorArgs.size()]);
			enhanced = enhancer.create(typesArray, valuesArray);
		}
		return enhanced;
	}

	private static class EnhancedResultObjectProxyImpl implements MethodInterceptor {

		private Class<?> type;
		private ResultLoaderMap lazyLoader;
		private boolean aggressive;
		private Set<String> lazyLoadTriggerMethods;
		private ObjectFactory objectFactory;
		private List<Class<?>> constructorArgTypes;
		private List<Object> constructorArgs;
		private Configuration configuration;
		private LoadPair oldLoadPair;

		private EnhancedResultObjectProxyImpl(Class<?> type, ResultLoaderMap lazyLoader, Configuration configuration,
				ObjectFactory objectFactory, List<Class<?>> constructorArgTypes, List<Object> constructorArgs) {
			this.type = type;
			this.lazyLoader = lazyLoader;
			this.aggressive = configuration.isAggressiveLazyLoading();
			this.lazyLoadTriggerMethods = configuration.getLazyLoadTriggerMethods();
			this.objectFactory = objectFactory;
			this.constructorArgTypes = constructorArgTypes;
			this.constructorArgs = constructorArgs;
			this.configuration = configuration;
		}

		public EnhancedResultObjectProxyImpl(Class<?> type, ResultLoaderMap lazyLoader, Configuration configuration,
				ObjectFactory objectFactory, List<Class<?>> constructorArgTypes, List<Object> constructorArgs,
				LoadPair pair) {
			this.type = type;
			this.lazyLoader = lazyLoader;
			this.aggressive = configuration.isAggressiveLazyLoading();
			this.lazyLoadTriggerMethods = configuration.getLazyLoadTriggerMethods();
			this.objectFactory = objectFactory;
			this.constructorArgTypes = constructorArgTypes;
			this.constructorArgs = constructorArgs;
			this.configuration = configuration;
			this.oldLoadPair = pair;
		}

		public static Object createProxy(Object target, ResultLoaderMap lazyLoader, Configuration configuration,
				ObjectFactory objectFactory, List<Class<?>> constructorArgTypes, List<Object> constructorArgs) {
			final Class<?> type = target.getClass();
			EnhancedResultObjectProxyImpl callback = new EnhancedResultObjectProxyImpl(type, lazyLoader, configuration,
					objectFactory, constructorArgTypes, constructorArgs);
			Object enhanced = crateProxy(type, callback, constructorArgTypes, constructorArgs);
			PropertyCopier.copyBeanProperties(type, target, enhanced);
			return enhanced;
		}

		public Object intercept(Object enhanced, Method method, Object[] args, MethodProxy methodProxy)
				throws Throwable {
			final String methodName = method.getName();
			try {
				synchronized (lazyLoader) {
					// 判断get方法是否在懒加载内,并且接口是什么
					if (lazyLoader.size() > 0 && !FINALIZE_METHOD.equals(methodName)) {
						if (SKIP_METHOD.equals(methodName)) {
						} else if (PropertyNamer.isGetter(methodName) && oldLoadPair != null) {
							oldLoadPair.load(enhanced);
							oldLoadPair = null;
							lazyEmptyObject(method, enhanced);
						} else if (PropertyNamer.isGetter(methodName)) {
							lazyEmptyObject(method, enhanced);
						}
					}
				}
				return methodProxy.invokeSuper(enhanced, args);
			} catch (Throwable t) {
				throw ExceptionUtil.unwrapThrowable(t);
			}
		}

		public void lazyEmptyObject(Method method, Object enhanced) throws IllegalArgumentException,
				IllegalAccessException, SQLException {
			String methodName = method.getName();
			final String property = PropertyNamer.methodToProperty(methodName);
			// Map<String, LoadPair> map = lazyLoader.getProperties();
			Map<String, LoadPair> map = (Map<String, LoadPair>) ReflectionUtils.getFieldValue(lazyLoader, "loaderMap");
			LoadPair pair = map.get(property.toUpperCase(Locale.ENGLISH));
			if (pair == null) {
				return;
			} else if (pair != null && !isInstanceofCollection(method.getReturnType())) {

				final Class<?> returntype = method.getReturnType();
				EnhancedResultObjectProxyImpl saveCallBack = new EnhancedResultObjectProxyImpl(returntype, lazyLoader,
						configuration, objectFactory, constructorArgTypes, constructorArgs, pair);
				// map中移除防重复 getProperties为新增
				map.remove(property.toUpperCase(Locale.ENGLISH));
				Object emptyProxy = crateProxy(returntype, saveCallBack, constructorArgTypes, constructorArgs);
				// 非安全方法拿对象
				ResultLoader resultLoader = (ResultLoader) ReflectionUtils.getFieldValue(pair, "resultLoader");
				Object id = ReflectionUtils.getFieldValue(resultLoader, "parameterObject");

				// 设置ID
				Field idField = ReflectionUtils.getDeclaredField(emptyProxy, "id");
				idField.setAccessible(true);
				idField.set(emptyProxy, id);
				// 设置代理属性和
				Field lazyFiledField = ReflectionUtils.getDeclaredField(enhanced, property);
				lazyFiledField.setAccessible(true);
				lazyFiledField.set(enhanced, emptyProxy);
			} else {
				// 列表型全部懒加载
				pair.load();
			}
		}

		public static boolean isInstanceofCollection(Class<?> cl) {
			Class<?>[] is = cl.getInterfaces();
			for (int i = 0; i < is.length; i++) {
				if (is[i] == List.class) {
					return true;
				}
				if (is[i] == Collection.class) {
					return true;
				}
			}
			return false;
		}
	}

}

{% endhighlight %}