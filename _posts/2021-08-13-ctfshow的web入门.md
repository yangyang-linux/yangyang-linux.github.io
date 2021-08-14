---
layout:     post
title:      2021-08-13-ctfshowweb入门
subtitle:   2021-08-13-ctfshowweb入门
date:       2021-8-13
author:     YY——阳阳
header-img: img/post/1.jpg
catalog: true
tags:
    - ctfshow
---
## 信息搜集
#### web1-20
- 域名信息（通过dns解析记录）
- 弱密码以及网站信息泄露（电话，姓名，资料等）
- editor泄露（小0day:某编辑器最新版默认配置下，如果目录不存在，则会遍历服务器根目录）
- 查看源码
  * F12
  * 鼠标右键
  * 禁用js后可以
    * 打开一个正常的站点，f12以后粘贴url
    * 关闭网站的js（禁用js）
    * view-source
- 查看响应包内容
  * f12查看
  * bp抓包查看
- robots
- cookies泄露
- phps源码泄露等备份文件泄露（包括bak等）
- www.zip等一系列压缩包备份泄露
  [![fDADRf.png](https://z3.ax1x.com/2021/08/13/fDADRf.png)](https://imgtu.com/i/fDADRf)
- git源码泄露
- svn源码泄露（当开发人员使用 SVN 进行版本控制，对站点自动部署。如果配置不当,可能会将.svn文件夹直接部署到线上环境。这就引起了 SVN 泄露漏洞。）
- vim缓存泄露（临时文件是在vim编辑文本时就会创建的文件，如果程序正常退出，临时文件自动删除，如果意外退出就会保留，当vim异常退出后，因为未处理缓存文件，导致可以通过缓存文件恢复原始文件内容）
  * >   以 index.php 为例 第一次产生的缓存文件名为 .index.php.swp
        第二次意外退出后，文件名为.index.php.swo
        第三次产生的缓存文件则为 .index.php.swn
        注意：index前有 " . "
- .DS_Store(.DS_Store 是 Mac OS 保存文件夹的自定义属性的隐藏文件。通过.DS_Store可以知道这个目录里面所有文件的清单。)
- HG泄露（当开发人员使用 Mercurial 进行版本控制，对站点自动部署。如果配置不当,可能会将.hg 文件夹直接部署到线上环境。这就引起了 hg 泄露漏洞。）
- php探针（url后缀名添加/tz.php 版本是雅黑PHP探针，然后查看phpinfo搜索flag）
- js文件分析
- mdb文件是早期asp+access构架的数据库文件，文件泄露相当于数据库被脱裤了。 **直接查看url路径添加/db/db.mdb 下载文件通过txt打开**



[详细解释以及操作点击](https://blog.csdn.net/a597934448/article/details/105431367)

## 爆破
#### web21
使用题目给的字典进行爆破
注意账号密码被base64加密即可
注意取消勾选特殊字符进行url加密

#### web22
子域名爆破在线
[https://phpinfo.me/domain](https://phpinfo.me/domain)

#### web23
自己写php代码只有可以跑出来
web23.php
#### web24
随机数种子，可以编写代码出来
 mt_scrand(seed)这个函数的意思，是通过分发seed种子，然后种子有了后，靠mt_rand()生成随机 数。 提示：从 PHP 4.2.0 开始，随机数生成器自动播种，因此没有必要使用该函数 因此不需要播种，并且如果设置了 seed参数 生成的随机数就是伪随机数，意思就是每次生成的随机数 是一样的
应用场景在平常的验证，种子可以跟时间或者ip有关

#### web25
```php
<?php
error_reporting(0);
include("flag.php");
if(isset($_GET['r'])){
    $r = $_GET['r'];
    mt_srand(hexdec(substr(md5($flag), 0,8)));
    $rand = intval($r)-intval(mt_rand());
    if((!$rand)){
        if($_COOKIE['token']==(mt_rand()+mt_rand())){
            echo $flag;
        }
    }else{
        echo $rand;
    }
}else{
    highlight_file(__FILE__);
    echo system('cat /proc/version');
}
```
