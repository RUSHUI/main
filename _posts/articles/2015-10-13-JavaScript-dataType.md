---
layout: post
title: "JAVASCRIPT数据类型"
modified:
categories: blog
excerpt:
tags: ["【JAVASCRIPT】","【BLOG分享】","【记录】"]
image:
  feature:tianbian.jpg
date: 2015-10-13T09:55:55-13:00
---
<div>
    <ul>
        <li class="list-inline"><a href="#baseType">基本类型</a></li><li><a href="#complexType">复合类型</a></li><li><a href="#spectialType">特殊对象</a></li>
    </ul>
    <article id="baseType">
        <div class="article-header">基本类型</div>
        <div class="article-content">
            <div class="list-item-content">数字</div>
                采用IEEE754标准定义的64位浮点格式
            特殊数值常量:
            <table>
                <thead>
                    <tr><th>JS变量</th><th>变量解释</th></tr>
                </thead>
                <tbody>
                    <tr><td>Infinity</td><td>无穷大的特殊值</td></tr>
                    <tr><td>NaN</td><td>非数字值</td></tr>
                    <tr><td>Number.MAX_VALUE</td><td>可表示的最大数字</td></tr>
                    <tr><td>Number.MIN_VALUE</td><td>可表示的最小数字</td></tr>
                </tbody>
            </table>
            Number.NaN 非数字值
            Number.POSITIVE_INFINITY 正无穷大
            Number.NEGATIVE_INFINITY 负无穷大
            把数字转为字符串6种方式
            <pre>
                var n = 1.23456;
                var n_as_str = n+"";
                String(n);
                n.toString(x); //x=2,binary; x=8, octonay; x=16,hexadecimal.if empty,decimal
                n.toFixed(x); //小数点后位数
                n.toExponential(x); //显示指数形式,x表示小数位
                n.toPrecision(x); //若n位数<x时显示为指数,x表示数字的精度
            </pre>
            ---字符串
            字符串转为数字
            在数字环境,自动转换为数字,
            <pre>
                var num = "2" * "3"; //num = 6
                var num = str_val - 0;
                var num = Number(str_val); //以10为基数的数字有效,允许开头和结尾的空白
                parseInt(str)
                parseInt(str,radix) //the same with java
                parseFloat(str)
            </pre>
            ---布尔
            显式转换的方法
            <pre>
            var x_as_boolean = Boolean(x);
            var x_as_boolean = !!x;
            </pre>
            ---null
            表示"无值".
            对象转换:布尔环境式时,非空对象为false;字符串环境时"null";数字环境时0;
            ---undefined
            使用未声明的变量时,或使用声明但没有赋值的变量时,或使用不存在的对象属性时,返回
            undefined.
            对象转换:布尔环境式时,非空对象为false;字符串环境时"undefined";数字环境时NaN;
            与null区别:
            null是关键字,undefined不是.(ECMAScript v3定义了undefined的全局变量,初始值是undefined)
        </div>
    </article>
    <article id="complexType">
        <div class="article-header">复合类型</div>
        对象:已命名的数据的集合
        对象直接量:由一个列表构成.列表的表式形式,{key:value,*};(key=标识符/字符串,value=常量/表达式)
        对象转换:布尔环境式时,非空对象为true;字符串环境时,toString();数字环境时,valueOf();
        数组
        不直持多维数组,数组元素可以是数组;
        数组元素不必据有相同的类型
    </article>
    <article id="spectialType">
        <div class="article-header">复合类型</div>
        函数
        一般语法,function name( args ) { func_body; }  var function-name=function( args ){ };
        lambda函数,function ( args ){ function-body; }
        构造函数,new Function( "args", "function-body" );

        特殊的js函数特殊的行为：
        自执行函数:常见形态  (function(){})();  变异形态 (function(){}()) || +function(){}();
        jQuery的资源加载完成回调函数:$(function(){})

    </article>
    *说明
    计划以后在note目录下发布些整理的笔记,好记心不如烂笔头.主要为了方便自己查找,若读者看了觉得哪儿理解不对,请指教.
    这篇是关于javascript的数据类型,主要内容来自"javascript权威指南".本文来自博客园-寒意，请转载注明出处，尊重作者原创。
</div>
