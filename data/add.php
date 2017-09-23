<?php
    $name=$_REQUEST['account']; /*接收数据*/
    $ps=$_REQUEST['password'];
    $ph=$_REQUEST['phone'];
    if(empty($name)){
        echo "名字不能为空";
        return;
    }else if(empty($ps)){
        echo "密码不能为空";
        return;
    };
    $conn=mysqli_connect('localhost','root','root','liu'); /*链接数据库*/
    $sql="set names utf8"; /*设置数据库编码*/
    mysqli_query($conn,$sql); 
    $sql="INSERT INTO students VALUES(null,'$name','$ps','$ph')"; /*添加数据*/
    $result=mysqli_query($conn,$sql);
    if($result){
        echo "success";
    }else{
        echo "erro";
    }
?>