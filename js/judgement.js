// JavaScript Document

function validate(){
    var name=document.forms[0].name.value;
    var email=document.forms[0].email.value;
    var phone = document.forms[0].phone.value;
    var index=bookSelect.selectedIndex;
    var message=document.forms[0].comments.value;
    
    //var reg2= /\w+([-+.']\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*/;
    
    if(name.length<=0 &&  email.length<=0 && phone.length<=0)
        alert("姓名或昵称、QQ、手机请至少填一项！"); 
    //else if(!reg2.test(email) && email.length>0 )
    //    alert("邮件格式不正确！"); 
    else if(index==0)
        alert("请选择反馈资料！");
    else if(message.length<=0)
        alert("请输入反馈信息！");
    else  
        document.forms[0].submit();    
}
