
app.controller('headerCtrl',['$scope','$http','$interval',function($scope,$http,$interval){
    $scope.flg=false;
    $scope.signUp=function(){ /*×¢²áÊÂ¼þ*/
        var name=$("#signUpModal .signForm #account").val();
        var ps=$("#signUpModal .signForm #password").val();
        var ph=$("#signUpModal .signForm #phone").val();
        $http.post('data/add.php',{account:name,password:ps,phone:ph}).success(function(data){
            $scope.result=data;
            if($scope.result='success'){
                $scope.flg=true;
                $scope.num=3;
                var timer=$interval(function(){
                   $scope.num--;
                    if($scope.num==0){
                        $interval.cancel(timer);
                    }
                },1000)
            }else{
                $scope.flg=false;
            }
        })
    }
}]);

app.controller('submitCtrl',['$scope',function($scope){

    $scope.click = 'a'; /**默认显示第一个*/
    $scope.onClick=function(type){
        $scope.click=type;
        console.log($scope.click);
    }
}]);
app.controller('ngModelCtrl',['$scope',function($scope){
    $scope.name="张三";
    $scope.tup='1.jpg';
}]);

app.controller('directiveCtrl',['$scope',function($scope){

}]);
app.controller('serviceCtrl',['$scope','$box',function($scope,$box){
    $scope.show=function(){
        alert($box.msg("hello word,this is my service!"));
        console.log($box.name);
    }
}]);
app.directive('zhiling',function(){ /*自定义指令 两个参数第一个是指令名字，第二是函数*/
    return {
        restrict:'E', /*指定指令的属性：E元素，A属性(默认值)，C类名，M注释*/
        template:'<h2>hello directive</h2>'
    }
});

app.factory('$box',function(){ /*通过工厂模式自定义服务*/
    return {
        name:"张三",
        msg:function(data){
            return data
        }
    }
})