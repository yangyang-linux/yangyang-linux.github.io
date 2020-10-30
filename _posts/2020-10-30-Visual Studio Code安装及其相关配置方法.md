---
layout:     post
title:      windows安装vscode
subtitle:   Window10系统Visual Studio Code安装及其相关配置方法
date:       2020-10-30
author:     YY
header-img: img/post/post-bg-2020-10-30.jpg
catalog: true
tags:
    - vscode
---

## Visual Studio Code安装
- 打开“开始”菜单，进入微软商店（Microsoft Store）,在搜索栏输入visual studio code，在打开的页面点击“了解更多”，进入网页选择免费版并下载安装。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201030165958119.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020103017000543.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201030170010277.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ2MTEwMjI0,size_16,color_FFFFFF,t_70#pic_center)

- 打开vs code，在左侧栏点击图标，在搜索栏中输入chinese，点击install安装该拓展包，并在弹出的窗口中点击restart now中心启动，此时vs code汉化成功。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201030170253857.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201030170312327.png#pic_center)


- 再次点击左侧栏图标，搜索c/c++安装该拓展包，安装后再搜索code runner安装该拓展包。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201030170335199.png#pic_center)- 点击左侧栏图标，点击“设置”，在搜索栏中输入code-runner，找到Code-runner:Ignore Selection和Code-runner:Run In Terminal并打勾。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020103017041337.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201030170419489.png#pic_center)
- 在第四步中的搜索栏中输入encoding，在Files:Encoding下将utf8改为gbk，这样在输出中文时就不会乱码了。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201030170444125.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ2MTEwMjI0,size_16,color_FFFFFF,t_70#pic_center)

## 编译环境mingw64的配置
- 在浏览器网址栏中输入网址https://lanzous.com/ia5tz7g， 下载到本地，用解压工具将该压缩包解压到C盘或D盘（建议D 盘），打开mingw64/bin，复制地址。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201030170529319.png#pic_center)

- 在任务栏的搜索框中用拼英输入高级,点击**查看高级系统**，点击**环境变量**，在下面的系统变量框中点击Path一栏，点击**编辑**，再点击右侧**新建**，将刚刚的bin地址复制上去（注意该地址中不能出现中文），并确定（三个窗口的“确定”都要点）。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201030170731391.png#pic_center)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201030170735148.png#pic_center)
- 检测编译环境是否安装成功：按住win键+r，在窗口中输入cmd，在弹出的黑色窗口中输入g++ -v并按回车键，出现下图说明编译环境安装成功。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201030170802119.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ2MTEwMjI0,size_16,color_FFFFFF,t_70#pic_center)

