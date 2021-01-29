---
layout:     post
title:      Xshell连接kali
subtitle:   简单讲解Xshell连接kali
date:       2021-1-28
author:     YY——阳阳
header-img: img/post/2.jpg
catalog: true
tags:
    - Linux
---

## 前言
一、首先要安装好linux虚拟机，在此附上安装的步骤（一位大佬的博客）[https://blog.csdn.net/sunshine1_0/article/details/80839430](https://blog.csdn.net/sunshine1_0/article/details/80839430)
二、安装xshell 。官网下载地址：

[https://www.netsarang.com/zh/free-for-home-school/](https://www.netsarang.com/zh/free-for-home-school/)

![](https://mmbiz.qpic.cn/mmbiz_png/UcAE5U1MComRB8GtQJBSr5JZc6UZP9r0RiclYx0au3hXFoqBr3DYXFGyTMblp406Nic7Yhpzfaz3u5E2Udk080Bw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
*************************************************
![](https://mmbiz.qpic.cn/mmbiz_png/UcAE5U1MComRB8GtQJBSr5JZc6UZP9r0aiccmrVVnVE3Gw92YVNQgQ3jUZC4bdqCUxYNXwnibp1zGuwMc3jmrtLQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
**************************************************
![](https://mmbiz.qpic.cn/mmbiz_png/UcAE5U1MComRB8GtQJBSr5JZc6UZP9r0uGsWSxicicwXbNUIGnQzPuE63RaajpyGnSKriaEyTKibPhFpzqCKic7swpQ/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)
PS：下载完成安装就好

## 一、NAT模式
1、检查Linux虚拟机的网络连接模式，确保它是NAT模式。
![](https://img-blog.csdnimg.cn/20190709173912788.png)
2、在VMware里，点击菜单栏上的【编辑】-->【虚拟网络编辑器】，打开下方的虚拟网络编辑器。选择VMnet8（NAT模式），取消勾选【使用本地DHCP服务...】（若勾选，会设置动态IP）
![](https://img-blog.csdnimg.cn/20190709174100219.png)
3、点击NAT设置
![](https://img-blog.csdnimg.cn/20190709174151785.png)
**********************************************
![](https://img-blog.csdnimg.cn/20190709174214726.png)
记住上图中的子网IP范围，如上图所示表示虚拟机在192.168.33.0~192.168.33.255范围内。

注：上图中192.168.33.2为网关地址，192.168.33.255为广播地址，192.168.33.0一般为网段IP，所以0,2,255这三个地址不能设置。