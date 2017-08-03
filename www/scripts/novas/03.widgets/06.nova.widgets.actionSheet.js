nova.widgets.actionSheet = {
    _buttons: [],
    show: function (buttons, info) {
        var me = this;
        this._buttons = buttons;
        var $action = $('.actionsheet');
        if ($action.length > 0) {
            $action.remove();
        }
        var html = '<div class="actionsheet">\
                        <div class="actionsheet-info">' + (info == undefined ? '' : info) + '</div>\
                        <div class="actionsheet-buttons">\
                        </div>\
                    </div>';
        $action = $(html);
        $action.appendTo('#body');
        var $btns = $action.find('.actionsheet-buttons');
        for (var i = 0; i < buttons.length; i++) {
            var btn = buttons[i];
            var css = btn.css == undefined ? '' : ' ' + btn.css;
            var $btn = $('<div class="actionsheet-button' + css + '">' + btn.text + '</div>');
            $btn.appendTo($btns);
            nova.touch.bindClick($btn, function () {
                $action.remove();
                me._buttons[$(this).prevAll().length].handler();
            });
        }
        nova.touch.bindClick('.actionsheet', function () {
            $(this).remove();
        });
    },
    remove: function () {
        $('.actionsheet').remove();
    },
    createButton: function (text, css, handler) {
        return {
            text: text,
            css: css,
            handler: handler
        };
    },
    isShowing: function () {
        return $('.actionsheet').length > 0;
    }
};