<?php
require 'PHPMailerAutoload.php';	//这里需要使用第三方的邮件发送包
 
$mail = new PHPMailer();
$mail->Encoding = "base64";
$mail->isSMTP(); 					// 使用SMTP服务
$mail->CharSet = "GB2312";			//应该使用"UTF-8"编码，但邮件收到乱码，所以使用GB2312;
$mail->Host = "smtp.qq.com";      	// 发送方的SMTP服务器地址
$mail->SMTPAuth = true;				// 是否使用身份验证
$mail->Username = "****@qq.com";   // 发送方的qq邮箱用户名
$mail->Password = "yourpassword"; 	// 发送方的邮箱授权码
$mail->SMTPSecure = "ssl";			// 使用ssl协议方式
$mail->Port = 465;   				// 163邮箱的ssl协议方式端口号是465/994
//$mail->isHTML(true); 

$mail->setFrom("****@q'q.com","邮件主题");     // 设置发件人信息
$mail->addAddress("2985409357@qq.com",""); // 设置收件人信息，可设置多个，复制粘贴此行修改邮箱地址即可

$mail->addReplyTo("***@qq.com","Reply");   // 设置回复人信息，指的是收件人收到邮件后，如果要回复，回复邮件将发送到的邮箱地址
//$mail->addCC("evolraelc9@163.com");    // 设置邮件抄送人，可以只写地址，上述的设置也可以只写地址
//$mail->addBCC("bbbb@163.com");         // 设置秘密抄送人
//$mail->addAttachment("bug0.jpg");      // 添加附件

//下面是将前面表单中填写的数据进行转码。
$nametemp = $_POST['name'];
$name2 = iconv('UTF-8','GB2312',$nametemp);

$emailtemp = $_POST['email'];
$email2 = iconv('UTF-8','GB2312',$emailtemp);

$phoneltemp = $_POST['phone'];
$phone2 = iconv('UTF-8','GB2312',$phoneltemp);

$commentstemp = $_POST['comments'];
$comments2 = iconv('UTF-8','GB2312',$commentstemp);
 
//下面是将数据汇总发送至邮箱
$mail->Subject = "网页收到新留言啦~~";          // 邮件标题
$mail->Body = "　　用户姓名：".$name2."
　　QQ号码：".$email2."
　　手机号码：".$phone2."
　　反馈信息：".$comments2;      // 邮件正文

//定义成功或出错弹窗显示的文本信息
$falied = "信息发送失败，请联系网站管理员！";
$falied2 = iconv('GB2312','UTF-8',$falied);

$succeed = "信息发送成功，我们已经收到您的反馈信息。本页面将关闭，请返回。感谢支持！";
$succeed2 = iconv('GB2312','UTF-8',$succeed);

//发送邮件
//如果没成功，弹窗显示错误信息
if(!$mail->send()){
    echo "<script language=javascript>alert('$falied2');window.opener=null;window.top.open('','_self','');window.close(this);</script>";
    //echo "Mailer Error: ".$mail->ErrorInfo;  // 输出错误信息
}
//反之成功，显示发送成功文本信息，并将网页关闭，防止用户多次点击提交
else{
    echo "<script language=javascript>alert('$succeed2');window.opener=null;window.top.open('','_self','');window.close(this);</script>";
}
?>
