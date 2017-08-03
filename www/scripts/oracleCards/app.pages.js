app.pages = {
    home: {
        init:function() {
            nova.touch.bindClick('#btnCardReadings', function () {
            //$('#btnCardReadings').on('click', function () {

                //alert("btnCardReadings");
                app.game.newGame();
                app.gotoPage("pages/cards.html");
                return true;
            });

            nova.touch.bindClick('#btnHistory', function () {
                app.gotoPage("pages/history.html");
            });
            nova.touch.bindClick('#btnMoreInfo', function () {
                app.gotoPage("pages/faq.html");
            });
            var restHeight = $(window).height() - $('#homeButtons').height() - $('#homeLogo').height();
            restHeight = restHeight > 0 ? restHeight : 0;
            if (app.isOnTablet()) {
                restHeight = restHeight * 0.5;
            }
            var $logo = $('#main > img');
            $logo.css('margin-top', restHeight * 0.3 + 'px');
            $logo.css('margin-bottom', restHeight * 0.3 + 'px');
            app.setContentHeight();
            var scroller = new nova.Scroller('#content');
            scroller.init();
            app.histories = [];
        }
    },
    item: {
        _isBusy:false,
        init: function () {
            var me = this;
            me._isBusy = false;
            app.game.handleBack();
            nova.touch.bindClick('#pageItem', function () {
                if (me._isBusy) {
                    return;
                }
                me._isBusy = true;
                app.game.goNext();
                app.goBack();
            });
            $('#imgCard').load(function () {
                me.resizeImage();
            });
            var item = null;
            if (app.game.step == 'step1') {
                $('#cardTitle').html('<img src="themes/images/names/issue.png" />');
                item = app.game.step1Item;
                $('#imgCard').attr('src', 'themes/images/items/issues/' + item.name + '.jpg');
                $('#cardText').html('<img src="themes/images/names/issues/' + item.name + '.png" />');
            } else {
                $('#cardTitle').html('<img src="themes/images/names/negative.png" />');
                item = app.game.step2Item;
                $('#imgCard').attr('src', 'themes/images/items/negative/' + item.name + '.jpg');
                $('#cardText').html('<img src="themes/images/names/negative/' + item.name + '.png" />');
            }
            app.setContentHeight();
            
        },
        resizeImage:function() {
            
            var $win = $(window);
            var $card = $('#imgCard');
            var containerWidth = $win.width();
            var containerHeight = $win.height() - 30;
            var originalHeight = $card.height();
            var originalWidth = $card.width();
            var rate = originalHeight / containerHeight;
            var resultHeight = 0;
            var resultWidth = 0;
            var resultLeft = 0;
            if (originalHeight >= containerHeight) {
                resultHeight = containerHeight;
                resultWidth = containerWidth / rate;
                resultLeft = (containerWidth - resultWidth) / 2;
            } else {
                resultHeight = originalHeight;
                resultWidth = originalWidth;
                resultLeft = (containerWidth - resultWidth) / 2;
            }
            
            var $imgs = $('#imgCard, #imgOverlay');
            $imgs.height(resultHeight + 'px');
            $imgs.width(resultWidth + 'px');
            $imgs.css('left', resultLeft + 'px');
            $('#imgCardWrap').height(containerHeight + 'px');
            $('#imgCardWrap img').show();
        }
    },
    cards: {
        init: function () {
            app.game.handleBack();
            var isReview = app.currentPage.isReview;
            isReview = isReview == undefined ? false : isReview;
            nova.touch.bindClick('#deck', function () {
                app.game.randomItem();
                var step = app.game.step;
                if (step == 'step1' || step == 'step2') {
                    app.gotoPage('pages/item.html');
                }
                else if (step == 'step3') {
                    app.gotoPage('pages/consciousItem.html');

                }
                else if (step == 'step4') {
                    app.game.goNext();
                    //app.gotoPage('pages/cards.html');
                    app.gotoPage('pages/continue.html');
                }
                else if (step == 'step0')
                {

                }
            });
            nova.touch.bindClick('#btnNextStep', function () {
                var readCount = $('#step5SubSteps li.read').length;
                if (readCount >= 3) {
                    if (app.game.completed == false) {
                        app.game.completed = true;
                        var play = app.game.getPlayData();
                        app.service.addPlay(play);
                    }
                    app.gotoPage('pages/nexts.html');
                } else {
                    $('#step5SubSteps li').eq(readCount).addClass('read');
                    $('#step5SubSteps li').eq(readCount + 1).show();
                }
            });

            $('#pageCrads').addClass(app.game.step);
            if (app.game.step1Item != null) {
                $('#cardIssue .card-text').html(app.game.step1Item.text);
            }
            if (app.game.step2Item != null) {
                $('#cardNegative .card-text').html(app.game.step2Item.text);
            }
            if (app.game.step3Item != null) {
                $('#cardConscious .card-text').html(app.game.step3Item);
            }
            if (app.game.step4Item != null) {
                $('#cardUnconscious .card-text').html(app.game.step4Item);
            }
            if (app.game.step == 'step5') {
                $('#footer').show();
                $('#content').addClass('with-footer');
            }
            if (isReview) {
                $('#step5SubSteps li').addClass('read').show();
                $('#step5SubSteps li#subStep4').removeClass('read');
            }

            app.setContentHeight();
            var scroller = new nova.Scroller('#content');
            scroller.init();
        }
    },
    continue:{
        init: function () {
            var me = this;
            me._isBusy = false;
            app.game.handleBack();
            var consciousCards = app.game.step1Item.cards;
            $('.total-Items').html(consciousCards.length);
            $('#issueCardName').html(app.game.step2Item.text);
            $('#itemText').html(consciousCards[0]);

            $('#imgCard').load(function () {
                app.pages.item.resizeImage();
            });
            //$('#imgCard').attr('src', 'themes/images/items/negative/' + app.game.step2Item.name + '.jpg');
            $('#imgCard').attr('src', 'themes/images/items/issues/' + app.game.step1Item.name + '.jpg');

            $('#consciousText .itemText').html(app.game.step4Item);

            nova.touch.bindClick('#btnContinue', function () {

                    app.gotoPage('pages/cards.html');


            });
        }
    },
    consciousItem: {
        _isBusy:false,
        init: function () {
            var me = this;
            me._isBusy = false;
            app.game.handleBack();
            var consciousCards = app.game.step1Item.cards;
            $('.total-Items').html(consciousCards.length);
            $('#issueCardName').html(app.game.step1Item.text);
            $('#itemText').html(consciousCards[0]);

            $('#imgCard').load(function () {
                app.pages.item.resizeImage();
            });
            $('#imgCard').attr('src', 'themes/images/items/issues/' + app.game.step1Item.name + '.jpg');

            nova.touch.bindClick('#btnNextCard', function () {
                var current = me.getCurrentItemNumber();
                if (current >= consciousCards.length) {
                    current = 1;
                } else {
                    current++;
                }
                var item = consciousCards[current - 1];
                $('#itemText').html(item);
                $('#currentItem').html(current);
            });
            nova.touch.bindClick('#btnChooseThisCard', function () {
                if (me._isBusy) {
                    return;
                }
                me._isBusy = true;
                var index = me.getCurrentItemNumber() - 1;
                app.game.step3Item = consciousCards[index];
                app.game.goNext();
                app.goBack();
            });
        },
        getCurrentItemNumber: function () {
            return $('#currentItem').html() * 1;
        }
    },
    nextSteps: {
        init: function () {
            $('#issueName').html(app.game.step1Item.text);
            $('#btnFreeOnlineClearing span').html(app.game.step1Item.next1Text);
            $('#btnClearingCDMP3 span').html(app.game.step1Item.next2Text);

            nova.touch.bindClick('#btnFreeOnlineClearing', function () {
                var ref = cordova.InAppBrowser.open(app.game.step1Item.next1, '_blank', 'location=yes');
            });
            //$('#btnFreeOnlineClearing').on('click', function () {
            //    var ref = cordova.InAppBrowser.open(app.game.step1Item.next1, '_blank', 'location=yes');
            //});
            nova.touch.bindClick('#btnClearingCDMP3', function () {
                window.open(app.game.step1Item.next2, '_blank', 'location=yes');
            });
            nova.touch.bindClick('#btnDrRick', function () {
                var ref = window.open(app.game.settings.urlDrRick, '_blank', 'location=yes');
            });
            nova.touch.bindClick('#btnBeginAgain', function () {
                app.game.restart('pages/cards.html');
            });
            nova.touch.bindClick('#btnShare', function () {
                app.game.share();
            });
            nova.touch.bindClick('#btnlearnMore', function () {
                app.game.restart('pages/faq.html');
            });
            app.game.setStartedFromHome();

            var restHeight = $(window).height() - 450;
            restHeight = restHeight > 0 ? restHeight : 0;
            if (app.isOnTablet()) {
                restHeight = restHeight * 0.4;
            }
            var $nextTitles = $('#nextTitles');
            $nextTitles.css('margin-top', restHeight * 0.3 + 'px');
            $nextTitles.css('margin-bottom', restHeight * 0.3 + 'px');
            

            app.setContentHeight();
            var scroller = new nova.Scroller('#content');
            scroller.init();
        }
    },
    history: {
        items: [],
        init: function () {
            var me = this;
            nova.touch.bindClick('#btnBack', function () {
                app.goBack();
            });
            nova.touch.bindClick('#btnNew', function () {
                app.game.newGame();
                app.gotoPage('pages/cards.html');
            });

            app.service.getAllPlays(function (items) {
                me.items = items;
                me.render();
            });
            app.game.setStartedFromHome();
        },
        render: function () {
            var me = this;
            var html = '';
            for (var i = 0; i < me.items.length; i++) {
                var item = me.items[i];
                html += '<tr data-id="' + item.id + '">\
                        <td class="cell-date">' + item.date.toStr() + '</td>\
                        <td class="cell-issue">' + app.cards.step1[item.step1ItemIndex].text + '</td>\
                        <td class="cell-action">\
                            <a class="btn btn-right70">Review</a>\
                        </td>\
                    </tr>';
            }
            if (me.items.length == 0) {
                html = '<tr><td class="empty" colspan="3">No data found.</td></tr>';
            }
            $('#histories').html(html);
            nova.touch.bindClick('#histories .btn', function () {
                var id = $(this).closest('tr').attr('data-id');
                var rowItem = me.items.firstOrDefault(function () {
                    return this.id == id;
                });
                app.game.setPlayData(rowItem);
                var page = new nova.Page('pages/cards.html');
                page.isReview = true;
                app.gotoPage(page);
            });

            app.setContentHeight();
            var scroller = new nova.Scroller('#content');
            scroller.init();
        }
    }
};