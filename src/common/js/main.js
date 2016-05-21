/**
 * Created by JounQin on 16/4/28.
 */
+function () {
    var ctx = '/HashRev';

    require.config({
        baseUrl: ctx,
        paths: {
            jquery: 'lib/js/jquery-1.12.3',
            bootstrap: 'lib/js/bootstrap',
            test: 'modules/test/js/test'
        },
        shim: {
            bootstrap: {
                deps: ['jquery', 'css!lib/scss/bootstrap.scss']
            }
        },
        map: {
            '*': {
                css: 'lib/js/require-css',
                text: 'lib/js/require-text'
            }
        }
    });

    require(['jquery', 'test'], function ($, Test) {
        $('#container').append('初始化成功!');
    });
}();