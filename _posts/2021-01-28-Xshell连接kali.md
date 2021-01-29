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
一、首先要安装好kali虚拟机，在此附上安装的步骤 

https://www.jianshu.com/p/27ca274b70c8
二、安装xshell 。官网下载地址：

[https://www.netsarang.com/zh/free-for-home-school/](https://www.netsarang.com/zh/free-for-home-school/)

![](https://s3.jpg.cm/2021/01/29/4zsVk.png)
*************************************************
![](https://s3.jpg.cm/2021/01/29/4zEke.png)
**************************************************
![](https://s3.jpg.cm/2021/01/29/4zFyy.png)
PS：下载完成安装就好

## 一、允许root用户登录sshd服务
vim /etc/ssh/sshd_config
![4zH2U.png](https://s3.jpg.cm/2021/01/29/4zH2U.png)


把34行的 "prohibit-password" 改为 "yes" 并把把34行 和39行前的"#"号删掉，改完效果如下图：
![4ztLO.png](https://s3.jpg.cm/2021/01/29/4ztLO.png)

重启ssh服务：root@192:~# /etc/init.d/ssh restart
[ ok ] Restarting ssh (via systemctl): ssh.service.

配置sshd服务开机自动启动：root@192:/etc/init.d# update-rc.d ssh enable

## 二、使用xshell连接kali

1、查看kali的ip是多少
2、配置xshell，输入名称（随便）和主机（ip地址）
3、配置终端模式
![](https://pic4.zhimg.com/v2-a6cc6be9ccbfd835ece93762683bb42f_b.jpg)
4、连接（用户名密码）
5、点击确定
![](https://pic1.zhimg.com/v2-4fe66d9236c9af31c1e25664d0c0b668_b.jpg)