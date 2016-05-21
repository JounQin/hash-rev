/**
 * Created by JounQin on 16/4/28.
 */
define(['text!modules/test/html/temp.html', 'jquery', 'bootstrap'], function (template, $) {
    console.log(template);
    
    $('#container').tooltip({
        title: '测试成功!!!'
    });
});