
jQuery.extend(jQuery.validator.messages, {
    required: "必填字段",
    remote: "请修正该字段",
    email: "请输入正确格式的电子邮件",
    url: "请输入合法的网址",
    date: "请输入合法的日期",
    dateISO: "请输入合法的日期 (ISO).",
    number: "请输入合法的数字",
    digits: "只能输入整数",
    creditcard: "请输入合法的信用卡号",
    equalTo: "请再次输入相同的值",
    accept: "请输入拥有合法后缀名的字符串",
    maxlength: jQuery.validator.format("最多输入{0}个字符"),
    minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
    rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
    range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
    max: jQuery.validator.format("请输入一个最大为{0} 的值"),
    min: jQuery.validator.format("请输入一个最小为{0} 的值")
});

jQuery.validator.addMethod("stringCheck", function(value, element) {
    return this.optional(element) || /^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(value);

}, "只能包括中文字、英文字母和空格");

jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    var mobile = /^1(3|4|5|7|8)([0-9]{1})\d{8}$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");

jQuery.validator.addMethod("nameOnlyCheck", function(value, element) {
    //创建一个延迟对象
    var deferred = $.Deferred();
    $.ajax({
        method: "POST",
        url: "http://nmtp.netease.com/apply/insExist",
        async:false,//要指定不能异步,必须等待后台服务校验完成再执行后续代码
        data: {
            institutionName: value
        },
        success:function(res) {
            if (res.relatedObject) {
                deferred.reject();
            } else {
                deferred.resolve();
            }
        }
    });
    //deferred.state()有3个状态:pending:还未结束,rejected:失败,resolved:成功
    return deferred.state() == "resolved" ? true : false;
}, "该名称已被使用，请使用其他名称");

$(document).ready(function() {
    var focusArea = [], focusAreaField = [];

    // 获取领域列表
    $.ajax({
        method: "GET",
        url: "http://nmtp.netease.com/material/getArticleMaterialType?type=0",
        crossDomain : true
    }).done(function (res) {
        var list = res.relatedObject;
        for(var i=0; i<list.length; i++) {
            $('#field-list').append('<li class="item">' + list[i].name + '</li>');
        }
    });

    // 字段校验
    var validate = $('#form-apply').validate({
        onkeyup: function(element) {
            $(element).valid();
        },
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            'name': {
                required: true,
                stringCheck: true,
                nameOnlyCheck: true,
                maxlength: 12
            },
            'account-name': {
                required: true,
                stringCheck: true,
                maxlength: 12
            },
            'description': {
                maxlength: 128
            },
            'email': {
                required: true,
                maxlength: 40
            },
            'mobile': {
                required: true,
                isMobile: true
            }
        }
    });
    window.validate = validate;

    // 检查所有必填字段是否已填, 更新提交按钮状态
    var checkValid = function() {
        // *** important tip 实际测试得知***
        // input元素blur绑定的事件checkValid方法执行时间会比input元素blur绑定的校验方法要晚
        // input元素keyup绑定的事件checkValid方法执行时间会比input元素keyup绑定的校验方法要早
        // 因此需要延迟按钮状态变化的检测
        setTimeout(function() {
            var invalidNum=validate.numberOfInvalids(); //获得表单错误元素个数

            if (invalidNum == 0 && focusArea.length > 0) {
                $('#btn-submit').removeAttr('disabled');
            } else {
                $('#btn-submit').attr('disabled', 'disabled');
            }
        }, 10);
    };

    // 选择领域
    $('#field-list').on('click', function(ev) {
        var ele = ev.target;
        if(!$(ele).hasClass('item')) return;

        if($(ele).hasClass('checked')) {
            // 取选
            $(ele).removeClass('checked');
            for(var i=0; i<focusArea.length; i++) {
                if(ele.innerHTML == focusArea[i].innerHTML) {
                    focusArea.splice(i,1);
                }
            }
        } else {
            // 选择,领域已选择2个
            if(focusArea.length >= 2) {
                $(focusArea[0]).removeClass('checked');
                focusArea.shift();
            }
            $(ele).addClass('checked');
            focusArea.push(ele);
        }

        // 获取选择的领域
        focusAreaField = [];
        for(var i=0; i<focusArea.length; i++) {
            focusAreaField.push(focusArea[i].innerHTML);
        }

        // 点击领域,执行按钮状态变化判断
        checkValid();
    });

    // 表单input元素blur时执行按钮状态变化判断
    $('#form-apply input').on('keyup', checkValid);

    // 提交
    $('#btn-submit').on('click', function() {
        if($('#form-apply').find('input,textarea').valid() == false) {
            checkValid();
            return;
        }
        $.ajax({
            method: "POST",
            url: "http://nmtp.netease.com/apply/register",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                name: $('#name').val(),
                description: $('#description').val(),
                accountName: $('#account-name').val(),
                accountId: $('#email').val() + ($('#email-suffix').val() || ''),
                mobile: $('#mobile').val(),
                focusAreas: focusAreaField.join(',')
            }),
            dataType: 'json',
            crossDomain : true
        }).done(function (res) {
            if(res.success) {
                $('#cnt').addClass('f-dn');
                $('#res').removeClass('f-dn');
            }
        });
    });

    // 取消
    $('#btn-cancel').on('click', function () {
        window.location.href = '/';
    });
});