---
title: Java Clone!
first:  Java Basis
layout: default
author:
  name: Aliece TT
  url: http://aliecett.wicp.net
---

浅拷贝又叫浅复制，将对象中的所有字段复制到新的对象（副本）中。其中，值类型字段(java中8中原始类型)的值被复制到副本中后，在副本中的修改不会影响到源对象对应的值。而引用类型的字段被复制到副本中的还是引用类型的引用，而不是引用的对象，在副本中对引用类型的字段值做修改会影响到源对象本身。1浅拷贝简单归纳就是只复制一个对象，对象内部存在指向其他对象，数组或引用则不复制。

深拷贝是将对象中的所有字段复制到新的对象中。不过，无论是对象的值类型字段，还是引用类型字段，都会被重新创建并赋值，对于副本的修改，不会影响到源对象本身。深拷贝简单归纳就是对象内部引用的对象均复制。

继承自java.lang.Object类的clone()方法是浅复制。

序列化对象然后反序列化出来的对象时深度克隆。


public class CglibBeanCopy extends CglibBeanCopyMBeanSupport implements BeanCopy, CglibBeanCopyMBean {

    private final BeanCopierCache beanCopierCache;

    public CglibBeanCopy() {
        this( true );
    }

    public CglibBeanCopy(boolean usingJmxMonitor) {
        super( usingJmxMonitor , "cglib" );
        this.beanCopierCache = new BeanCopierCache();
    }

    public CglibBeanCopy(int maxCount , boolean usingJmxMonitor) {
        super( usingJmxMonitor , "cglib" );
        this.beanCopierCache = new BeanCopierCache(maxCount );
    }

    public CglibBeanCopy(MemoryCache<BeanCopier> beanCopiers , boolean usingJmxMonitor) {
        super( usingJmxMonitor , "cglib" );
        this.beanCopierCache = new BeanCopierCache( beanCopiers );
    }

    @Override
    protected boolean doCopy(Object source, Object target, BeanCopyConverter beanCopyConverter) {
        BeanCopier beanCopier = createBeanCopier( source , target , beanCopyConverter );
        Converter converter = createConverter( beanCopyConverter );
        beanCopier.copy( source , target , converter );
        return beanCopierCache.isFirstCreation();
    }

    BeanCopierCache getBeanCopierCache() {
        return beanCopierCache;
    }

    private Converter createConverter(BeanCopyConverter beanCopyConverter) {
        if ( beanCopyConverter == null ) {
            return null;
        }
        return new BeanConverter( beanCopyConverter );
    }

    private BeanCopier createBeanCopier( Object source, Object target, BeanCopyConverter beanCopyConverter ) {
        return beanCopierCache.createBeanCopier( source , target , source.getClass(), target.getClass(), beanCopyConverter != null );
    }

    private static final class BeanConverter implements Converter {

        private final BeanCopyConverter beanCopyConverter;

        public BeanConverter(BeanCopyConverter beanCopyConverter) {
            this.beanCopyConverter = beanCopyConverter;
        }

        @Override
        @SuppressWarnings("rawtypes")
        public Object convert(Object value, Class target, Object context) {
            return beanCopyConverter.convert( value , target );
        }
    }
}
