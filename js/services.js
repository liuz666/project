app

    // =========================================================================
    // Most of the events of table oprations
    // =========================================================================

    .factory('eventsService', ['$rootScope', '$http', '$q', '$state', 'swalService', function($rootScope, $http, $q, $state, swalService) {
        var events = {};
        var baseUrl = '';
        var code = $rootScope.CODE;
        swalSuccess = swalService.swalSuccess;
        swalWarning = swalService.swalWarning;
        swalError = swalService.swalError;
        swalWarningDefault = swalService.swalWarningDefault;

        events.initialize = function(url) {
            baseUrl = url;
        };
        events.consoleStatus = function() {
            console.log(baseUrl);
        };

        /**
         * [add common add item]
         * @param {[object]} params [additional params can be different for different pages]
         */
        events.add = function(params,replace, addUrl) {
            var addUrl = addUrl?addUrl:baseUrl + '?act=add';
            var deferred = $q.defer();
            var promise = deferred.promise; //return promise
            var status = false;
            var value = [];
            if (!replace) {
                value = $('#addItemForm').serializeArray();
                if (params) value.push(params);
            }else {
                value = params;
            }

            value.push({ 'name': 'code', 'value': code });
            $.post(addUrl, value, function(data) {
                if (data == 1 || data.code == 1) {
                    swalSuccess("添加成功！")
                    status = true;
                } else if (data == 0) {
                    swalError("添加失败！")
                    status = false;
                } else if (data.code == 0) {
                    swalError(data.info);
                    status = false;
                } else if (data.code == '404') {
                    window.location.href = "/index.php/Home/Public/login/"
                }
                $('#addModal').modal('hide');
                deferred.resolve(status);
            });
            return promise;
        };

        /**
         * [addDomain add subdomain]
         * @param {[object]} params [additional params]
         */
        events.addDomain = function(params) {
            var addUrl = baseUrl + '?act=add';
            var value = $('#addItemForm').serialize();
            var deferred = $q.defer();
            var promise = deferred.promise; //return promise
            var status = false;
            if (params) value += params;
            value += '&code=' + code;
            $.post(addUrl, value, function(data) {

                if (data == 1 || data.code == 1) {
                    swalSuccess("添加成功!");
                    status = true;
                } else if (data == 0) {
                    swalError("添加失败！")
                    status = false;
                } else if (data.code == 0) {
                    swalError(data.info);
                    status = false;
                } else if (data.code == '404') {
                    window.location.href = "/index.php/Home/Public/login/"
                }
                $('#addModal').modal('hide');
                deferred.resolve(status);
            });
            return promise;
        };
        events.edit = function(params) {
            var editUrl = baseUrl + '?act=edit';
            var value = $('#editItemForm').serializeArray();
            var deferred = $q.defer();
            var promise = deferred.promise; //return promise
            var status = false;
            if (params) value.push(params);

            value.push({ 'name': 'code', 'value': code });
            $.post(editUrl, value, function(data) {
                if (data == 0) {
                    swalError("修改失败！");
                    status = false;
                } else if (data == 1 || data.code == 1) {
                    swalSuccess("修改成功!");
                    status = true;
                    $('#editModal').modal('hide');
                } else if (data.code == '404') {
                    window.location.href = '/index.php/Home/Public/login/';
                } else {
                    swalError("修改失败！");
                    status = false;
                }
                deferred.resolve(status);
            });
            return promise;
        };

        /**
         * [delete individual]
         * @param  {[string]} id [need to remove item's id]
         */
        events.delete = function(id,delUrl,value) {
            swal(swalWarningDefault('del'), function(){   
                var deferred = $q.defer(),
                    promise = deferred.promise, //return promise
                    deleteUrl = delUrl?delUrl:(baseUrl + '?act=del'),
                    val = value?value:{ p: id, code: code };

                id = value?value.id:id;

                $.post(deleteUrl,val, function(data) {
                    if (data && data.code !=0) {
                        if (data.code == '404') {
                            window.location.href = '/index.php/Home/Public/login/';
                        };

                        swalSuccess("删除成功!");
                        $('#' + id).fadeOut("normal", function() {
                            $('#' + id).remove();
                        })
                    } else swalError("删除失败！");

                    deferred.resolve(data);
                });
                return promise; 
            });
        };

        /**
         * [deleteArr multiple delete]
         */
        events.deleteArr = function(delUrl, valueName) {
            var deleteUrl = delUrl?delUrl:(baseUrl + '?act=del'),
                arr = [],
                ch = $('#s-tab tbody input[type=checkbox]'),
                val = {};

            for (var i = 0, len = ch.length; i < len; i++) {
                var c = ch.eq(i);
                if (c.prop('checked')) {
                    arr.push(c.parents('tr').attr('id'));
                };
            }
            if (arr.length <= 0) return false;
            if (valueName) {val[valueName] = arr.join(',')}
            else {val.p = arr.join(',')};

            val.code = code;

            swal(swalWarningDefault('del'),function(){ 

                $.post(deleteUrl, val, function(data) {
                    if (data) {
                        if (data.code == '404') {
                            window.location.href = '/index.php/Home/Public/login/';
                        };

                        swalSuccess("删除成功!");
                        for (var i = arr.length - 1; i >= 0; i--) {
                            var id = "#" + arr[i];
                            $(id).fadeOut("normal", function() {
                                $(id).remove();
                            });
                        };
                    } else swalError("删除失败！");
                });
            })
        };

        /**
         * [deleteArr multiple delete]
         */
        events.servicesDeleteArr = function(domainId,type) {
            if (!domainId) {
                swalWarning("请选择左侧关联任务！");
                return;
            };
            var deleteUrl =baseUrl + '?act=del',
                handleData = servicesHandleData(type),
                val = handleData.val,
                arr = handleData.arr;

            if (val === false ) return false;
            swal(swalWarningDefault('del'), function(){ 
                $.post(deleteUrl, val, function(data) {
                    if (data) {
                        if (data.code == '404') {
                            window.location.href = '/index.php/Home/Public/login/';
                        };

                        swalSuccess("删除成功!");
                        for (var i = arr.length - 1; i >= 0; i--) {
                            var id = "#" + arr[i];
                            $(id).fadeOut("normal", function() {
                                $(id).remove();
                            });
                        };
                    } else swalError("删除失败！");
                });
            })

            function servicesHandleData(type){
                var ch = $('#s-tab tbody input[type=checkbox]'),
                    arr = [], // id array
                    val = {};
                switch(type) {
                    case 'ip':
                        var ipArr = [];
                        for (var i = 0, len = ch.length; i < len; i++) {
                            var c = ch.eq(i);
                            if (c.prop('checked')) {
                                arr.push(c.parents('tr').attr('id'));
                                ipArr.push($.trim(c.parents('tr').find('td').eq(1).text()));
                            };
                        };
                        if (arr.length <= 0) return false;
                        val = { 
                            id: arr.join(','),
                            ip: ipArr.join(','),
                            domain_id:domainId, 
                            code: code 
                        };
                    break;
                    case 'port':
                        var mulArr = [],
                            ip,
                            port;

                        for (var i = 0, len = ch.length; i < len; i++) {
                            var c = ch.eq(i);
                            if (c.prop('checked')) {
                                ip = $.trim(c.parents('tr').find('td').eq(1).text());
                                port = $.trim(c.parents('tr').find('td').eq(2).text());
                                if (ip && port) {
                                    arr.push(c.parents('tr').attr('id'));
                                    mulArr.push({
                                        "ip":ip,
                                        "port":port,
                                        "domain_id":domainId
                                    })
                                }
                            };
                        };
                        if (arr.length <= 0) return false;
                        val = { 
                            id: arr.join(','),
                            ip_port_domain_id: mulArr,
                            code: code 
                        };
                    break;
                    default:
                    break;
                }
                return {
                    arr: arr,
                    val: val
                };
            };
        };

        events.archiveDeleteArr = function(delUrl) {
            var deleteUrl = delUrl?delUrl:(baseUrl + '?act=del'),
                arr = [],
                ch = $('#s-tab tbody input[type=checkbox]'),
                val = {};

            for (var i = 0, len = ch.length; i < len; i++) {
                var c = ch.eq(i);
                if (c.prop('checked')) {
                    arr.push(c.parents('tr').attr('did'));
                };
            }
            if (arr.length <= 0) return false;
            
            arr = arr.toString().split(",");

            val.id = arr.join(',');

            val.code = code;

            swal(swalWarningDefault('del'),function(){ 

                $.post(deleteUrl, val, function(data) {
                    if (data) {
                        if (data.code == '404') {
                            window.location.href = '/index.php/Home/Public/login/';
                        };

                        swalSuccess("删除成功!");
                        for (var i = arr.length - 1; i >= 0; i--) {
                            var id = "#" + arr[i];
                            $(id).fadeOut("normal", function() {
                                $(id).remove();
                            });
                        };
                    } else swalError("删除失败！");
                });
            })
        }

        events.related = function(item, v) {
            var relatedUrl = '/index.php/home/related_info';
            var val = item.ip?item.ip:item.url;
            if (v) val = item[v];
            if (!val) swalError('参数缺失！无法生成关联关系图！');
            relatedUrl += '?search=' + val + '&domain_id=' + item.domain_id + '&code=' + code;
            $('#related').css('height', window.innerHeight - 220);
            $('#related').css('width', $('#tableWrap').width());

            //数据错误,临时获取本地json
            $.get(relatedUrl, function(data) {
                if (!data) {
                    swalError('后台数据错误，请稍候重试！');
                    return false;
                }
                $('#tableWrap').fadeOut('fast', function() {
                    $('#relatedWrap').fadeIn('fast');
                });
                $('#vulWrap').fadeOut('fast', function() {
                    $('#relatedWrap').fadeIn('fast');
                });
                $.each(data.links,function(n,value) {
                    if (data.links[n].level == 1 || data.links[n].level == 2) {
                        data.links[n].value=3
                    } else {
                        data.links[n].value=1
                    } 
                });
                console.log(data.nodes);
                var myChart = echarts.init(document.getElementById('related'));
                var option = {
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove'
                    },
                    series: [{
                        name: '关联关系',
                        type: 'sankey',
                        right: '28%',
                        data: data.nodes,
                        links: data.links,
                        itemStyle: {
                            normal: {
                                broderWidth: 1,
                                broderColor: '#aaa',
                                color: '#65C3DF'
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: 'source',
                                opacity: 0.2,
                                curveness: 0.5
                            }
                        }
                    }]
                }
                myChart.setOption(option);
            })
        };

        events.config = function(params) {
            var configUrl = '/index.php/home/scanConfig?act=add';
            var value = $('#configForm').serialize();
            if (params) value += params;
            value += '&code=' + code;


            $.post(configUrl, value, function(data) {
                if (data == -1) {
                    swalError("非法IP，无法添加！");
                } else if (data == 0) {
                    swalError("添加失败！");
                } else if (data.code == '404') {
                    window.location.href = '/index.php/Home/Public/login/';
                } else {
                    swalSuccess("添加成功！");
                }
                $('#configModal').modal('hide');
            });
        };

        events.export = function() {
            var exportUrl = baseUrl + '?act=export';
            var val = $('#exportTableForm').serializeObject();
            if(val.domain_id){
                if (typeof val.domain_id == "object") {
                    val.domain_id = val.domain_id.toString();
                }
            };
            val = JSON.stringify(val);
            val = utf16to8(val);
            val = base64encode(val);

            var col = [];
            $('#tableColumns input[type=checkbox]').each(function(index, el) {
                if ($(this).prop('checked')) {
                    col.push($(this).attr('value'))
                }
            });
            exportUrl += '&search=' + val + '&col=' + col + '&code=' + code;

            $.get(exportUrl, function(data) {
                if (!data) {
                    swalError('搜索不到符合搜索条件的信息!');
                } else if (data.code == '404') {
                    location.href = "/index.php/Home/Public/login/"
                } else {
                    $('#exportModal').modal('hide');
                    location.href = exportUrl;
                }
            })
        };

        events.immrun = function() {
            var immrunUrl = baseUrl + '/scaning';
            var deferred = $q.defer();
            var promise = deferred.promise; //return promise
            var status = false;
            var arr = [];
            var ch = $('#s-tab tbody input[type=checkbox]');
            for (var i = 0, len = ch.length; i < len; i++) {
                var c = ch.eq(i);
                if (c.prop('checked')) {
                    arr.push(c.parents('tr').attr('id'));
                };
            }
            if (arr.length <= 0) return false;

            swal(swalWarningDefault('open'), function(){ 
                $.post(immrunUrl, { domain_id: arr.join(",")}, function(data) {
                    if (data.code == '1') {
                        swalSuccess(data.info);
                        status = true;
                    } else if (data.code == '404') {
                        location.href = "/index.php/Home/Public/login/"
                    } else {
                        swalError(data.info);
                        status = false;
                    }
                    deferred.resolve(status);
                })
                return promise;
            })

        };
        //漏洞处理
        events.process = function(id, type) {
            var processUrl = baseUrl + '?act=edit';
            var deferred = $q.defer();
            var promise = deferred.promise; //return promise
            var status = false;
            processUrl += '&id=' + id;
            processUrl += '&type=' + type;
            processUrl += '&code=' + code;

            $.get(processUrl, function(data) {
                if (data) {
                    status = true;
                } else if (data.code == '404') {
                    location.href = "/index.php/Home/Public/login/"
                } else {
                    swalError('修改失败！');
                    status = false;
                }
                deferred.resolve(status);
            })
            return promise;
        };
        //漏洞批量处理
        events.processArr = function(type) {
            var processUrl = baseUrl + '?act=edit';
            var deferred = $q.defer();
            var promise = deferred.promise; //return promise
            var status = false;
            var arr = [];
            var ch = $('#s-tab tbody input[type=checkbox]');
            for (var i = 0, len = ch.length; i < len; i++) {
                var c = ch.eq(i);
                if (c.prop('checked')) {
                    arr.push(c.parents('tr').attr('id'));
                };
            }
            if (arr.length <= 0 ) return false;

            swal(swalWarningDefault('handle'), function(){ 
                var value = {};
                value.id = arr.join(',');
                value.type = type;
                value.code = code;
                $.get(processUrl, value, function(data) {
                    if (data) {
                        swalSuccess('修改成功！');
                        status = true;
                    } else if (data.code == '404') {
                        location.href = "/index.php/Home/Public/login/"
                    } else {
                        swalError('修改失败！');
                        status = false;
                    }
                    deferred.resolve(status);
                })
            });
            return promise;
            
        };
        //漏洞备注
        events.editRemark = function(id,value) {
            var deferred = $q.defer();
            var promise = deferred.promise; //return promise
            var remarkUrl = '/index.php/home/riskVul?act=edit_remark';
            remarkUrl+='&id='+id;
            remarkUrl+='&value='+value;
            remarkUrl+='&code='+code;

            $.get(remarkUrl, function(data) {
                if (data == 0) {
                    swalError("修改失败！")
                } else if (data.code == '404') {
                    window.location.href = '/index.php/Home/Public/login/';
                } else {
                    swalSuccess("修改成功！");
                    $('#remarkModal').modal('hide');
                }
                deferred.resolve(data);
            })
            return promise;
        }
        //漏洞生命周期
        events.showHistory = function(item) {
            var deferred = $q.defer();
            var promise = deferred.promise; //return promise
            var historyUrl = '/index.php/home/riskVul?act=show_history';
            var val = {};
            val.plugin_id = item.plugin_id;
            val.domain_id = item.domain_id;
            val.ip = item.ip;
            val.port = item.port;
            val.url = item.url;
            val.code = code;

            $.get(historyUrl,val, function(data) {
                if (data.code == '404') {
                    window.location.href = '/index.php/Home/Public/login/';
                }else if(!data){
                    swalWarning('暂无相关信息！')
                }
                deferred.resolve(data);
            })
            return promise;
        }
        // 资产生命周期
        events.assetHistory = function(item,url) {
            var deferred = $q.defer();
            var promise = deferred.promise; //return promise
            var baseUrl = url?url:'/index.php/home/AssetPortView';
            var hUrl = baseUrl+'/show_history?domain_id='+item.domain_id+'&ip='+item.ip;

            $http.get(hUrl).success(function(result){
                if (result == 0) {
                    swalError("查询不到该IP的生命周期！");
                }else {
                    time= [];
                    for(var key in result){
                        time.push(key);
                    }
                    deferred.resolve({
                        arr:result,
                        time: time
                    });
                }
            })
            return promise;
        }
        //同步
        events.update = function(params, url) {
            var updateUrl = url?url: baseUrl + '?act=update';
            var value = $('#updateItemForm').serializeArray();
            var deferred = $q.defer();
            var promise = deferred.promise; //return promise
            var status = false;
            if (params) value.push(params);

            value.push({ 'name': 'code', 'value': code });
            $.get(updateUrl, value, function(data) {

                if (data == 1 || data.code == 1) {
                    swalSuccess("同步成功!");
                    status = true;
                } else if (data == 0) {
                    swalError("同步失败！")
                    status = false;
                } else if (data.code == 0) {
                    swalError(data.info);
                    status = false;
                } else if (data.code == '404') {
                    window.location.href = "/index.php/Home/Public/login/"
                }
                $('#updateModal').modal('hide');
                deferred.resolve(status);
            });
            return promise;
        };
        //档案库同步操作
        events.archiveUpdate = function(url) {
            var updateUrl = url,
                value = $('#updateItemForm').serializeObject(),
                deferred = $q.defer(),
                promise = deferred.promise, //return promise
                status = false;

            value.code = code;
            $.post(updateUrl, value, function(data) {

                if (data == 1 || data.code == 1) {
                    swalSuccess(data.info);
                    status = true;
                } else if (data == 0) {
                    swalError(data.info)
                    status = false;
                } else if (data.code == 0) {
                    swalError(data.info);
                    status = false;
                } else if (data.code == '404') {
                    window.location.href = "/index.php/Home/Public/login/"
                }
                $('#updateModal').modal('hide');
                deferred.resolve(status);
            });
            return promise;
        };
        return events;
    }])

    // =========================================================================
    // Get data and generate pagination  /*code被删除 liu*/
    // =========================================================================
    
    .factory('pageService',['$rootScope', '$q', '$http', '$location', function($rootScope,$q,$http,$location){
        var service = {}, /*声明一个空对象*/
            OriginalUrl = '', /*创建一个空的路径*/
            PageStatus = {
                url:'',
                cur:1,
                limit:10,
                total:'',
                type:'',
            },
            //code = $rootScope.CODE,
            currentSearch = '';

        function searchFactory(value){ /*搜索功能*/
            var val = {};

            if (value) val = value;
            else val = $('#searchForm').serializeObject();
            if(val.domain_id){
                if (typeof val.domain_id == "object") {
                    val.domain_id = val.domain_id.toString();
                }
            }else if (val.newservice) {
                if (typeof val.newservice == "object") {
                    val.newservice = val.newservice.toString();
                }
            }else if (val.tag) {
                if (typeof val.tag == "object") {
                    val.tag = val.tag.join(",")
                }
            }
            val = JSON.stringify(val);
            val = utf16to8(val);
            val = base64encode(val);
            currentSearch = val;

            return val;
        };

        function listFactory(totalPage){
            var list = [],
                cur = PageStatus.cur; 

            // pagination analysis
            if (totalPage >= 5) {

                if (cur>3 && cur<totalPage-2) {
                    list =[];
                    for(var i = cur-2;i<=cur;i++){
                        list.push(i);
                    }
                    for(var i = cur+1;i<=cur+2;i++){
                        list.push(i);
                    }
                }else if(cur<=3){
                    list = [1,2,3,4,5];
                }else{
                    list =[];
                    for(var i = totalPage-4;i<=totalPage;i++){
                        list.push(i);
                    }
                }

            }else if(0<totalPage && totalPage<5){
                list = [];
                for (var i = 1; i <= totalPage; i++) {
                    list.push(i);
                }
            }else{
                list = [1];
            }

            return list;
        };

        service.Initialize = function(options){ /*获取初始化数据  路径，当前页数，条数*/
            PageStatus = $.extend({},PageStatus,options);
            OriginalUrl = PageStatus.url; 
        };

        service.ConsoleStatus = function(){
            console.log(PageStatus);
        };

        // Get data and generate pagination
        service.Resources = function(options){ /*获取数据功能*/
            var deferred = $q.defer(),
                promise = deferred.promise, //return promise
                type = PageStatus.type, // special opration
                url = options.url,
                cur = PageStatus.cur, // pagination current page
                totalPage = '', // pagination total page
                list = []; // pagination list

            $http.get(url).success(function(data){ /*获取数据，路径动态传进来*/

                // return datas
                switch(type){
                    case 'monitor':
                        PageStatus.total = totalPage = parseInt(data[0].count);
                        list = listFactory(totalPage);

                        deferred.resolve({
                            list:list,
                            data:data[1].content,
                            current:cur,
                            total:totalPage,
                            scanCount:data[3].scan_count
                        })
                    break;
                    case 'module':
                    case 'retrieval':
                        PageStatus.total = totalPage = parseInt(data[0].count);
                        list = listFactory(totalPage);

                        deferred.resolve({
                            list:list,
                            data:data[1].content,
                            current:cur,
                            total:totalPage,
                            statistical:data[2].statistical
                        })
                    break;
                    case 'sGeneral':
                    case 'sCustomized':
                    case 'riskport':
                        list = listFactory(PageStatus.total);
                        deferred.resolve({
                            list:list,
                            data:data.content,
                            current:cur
                        })
                    break;
                    case 'social':
                        PageStatus.total = totalPage = parseInt(data[0].count);
                        list = listFactory(totalPage);

                        deferred.resolve({
                            list:list,
                            data:data[1].content,
                            current: cur,
                            total: totalPage,
                            num: data[2].num
                        })
                    break;
                    default:
                        PageStatus.total = totalPage = parseInt(data[0].count);
                        list = listFactory(totalPage);
                        deferred.resolve({
                            list:list,
                            data:data[1].content,
                            current:cur,
                            total:totalPage
                        })
                    break;
                }
            })

            return promise;
        };

        service.Page = {
            init:function(){ /*这个方法效果是初始化 得到当前路径参数 并且 定义当前页数为第1页 最后返回*/
                var params = {};

                params.url = OriginalUrl+'&page=1&limit='+PageStatus.limit;
                PageStatus.cur = 1;
                return params;
            },
            num:function(num){ /*这个方法的效果是 得到当前路径参数 并且 通过传参动态获取到当前页数 ，最后返回*/
                num = parseInt(num);
                if (!num || num < 1 || num > PageStatus.total || num == PageStatus.cur) return;
                var params = {};
                PageStatus.cur = num;
                params.url = PageStatus.url +'&page='+num+'&limit='+PageStatus.limit;
                return params;
            },
            search:function(value){
                var params = {};
                var val = searchFactory(value);

                PageStatus.url = OriginalUrl + '&search='+val;
                PageStatus.cur = 1;
                params.url = PageStatus.url + '&page=1&limit='+ PageStatus.limit ;

                return params;
            },
            limit:function(num){
                num = parseInt(num);
                if (!num || num < 1 || num == PageStatus.limit) return;
                if (PageStatus.cur*num>PageStatus.total*PageStatus.limit) PageStatus.cur = 1;
                PageStatus.limit = num;

                var params = {};
                params.url = PageStatus.url + '&page=' + PageStatus.cur + '&limit=' + num ;

                return params;
            },
            clear:function(){ /*清除搜索*/
                var params = {};

                PageStatus.url = OriginalUrl;
                PageStatus.cur = 1;
                currentSearch = '';
                params.url = OriginalUrl + '&page=1&limit=' + PageStatus.limit ;
                return params;
            },
            refresh:function(){
                var params = {};
                params.url = PageStatus.url +'&page='+PageStatus.cur+'&limit='+PageStatus.limit;
                return params;
            }
        };

        service.GetTotalPage = function(pageName){
            var url = '/index.php/home/' + pageName + '?act=page_num&limit=' + PageStatus.limit +'&search=' + currentSearch ;
            var totalPage = '';
            var deferred = $q.defer();
            var list = [];
            var promise = deferred.promise; 

            $http.get(url).success(function(data) {
                PageStatus.total = totalPage = parseInt(data.page_num);
                list = listFactory(totalPage);
                deferred.resolve({
                    total:totalPage,
                    list:list
                });
            });

            return promise;
        };
        
        service.ClearSearch = function(){
            $('#searchForm input').each(function() {
                $(this).val('');
            })
            $('#searchForm select.form-control').each(function() {
                $(this).find('option').eq(0).prop('selected', 'true')
            })
            $location.search('');
            var el = $('#searchForm select[name="domain_id"]').select2();
            el.val(null).trigger("change");
            el = $('#searchForm select.tag-mul').select2();
            el.val(null).trigger("change");

            $("#searchForm select[name='tag']").val(null).trigger("change");
        }

        return service;
    }])

    // =========================================================================
    // swal alert
    // =========================================================================

    .factory('swalService',function(){
        var service = {};
        service.swalSuccess = function(title) {
            swal({   
                title: title,
                type: "success",   
                timer: 1200,   
                showConfirmButton: false 
            });
        };
        service.swalError = function(title) {
            swal({   
                title: title,
                type: "error",   
                timer: 1200,   
                showConfirmButton: false 
            });
        };
        service.swalWarning = function(title) {
            swal({   
                title: title,
                type: "warning",   
                timer: 1200,   
                showConfirmButton: false 
            });
        };
        service.swalWarningDefault = function(type){
            var title = '',
                btnName = '';

            switch(type) {
                case 'del':
                    title = '是否确认删除？'
                    btnName = '删除!'
                break;
                case 'open':
                    title = '是否确认开启任务?';
                    btnName = '确认开启!'
                break;
                case 'handle':
                    title = '是否确认该处理结果?';
                    btnName = '确认处理!'
                break;
            }
            return {

                title: title,   
                type: "warning",   
                showCancelButton: true,   
                confirmButtonColor: "#DD6B55",   
                confirmButtonText: btnName,   
                closeOnConfirm: false 
            }
        }
        return service;
    })
