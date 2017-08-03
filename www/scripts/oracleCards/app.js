var app = nova.application;
app.setContentHeight = function() {
    var $content = $('#content');
    var headerFooter = 0;
    if ($content.hasClass('with-header')) {
        headerFooter += $('#header').height();
    }
    if ($content.hasClass('with-footer')) {
        headerFooter += $('#footer').height();
    }
    if (app.isOnTablet()) {
        headerFooter *= 1.5;
    }
    var height = $(window).height() - headerFooter;
    if (app.isOnTablet()) {
        height = height / 1.5;
    }
    $content.height(height);
};

app.utiles = {
    random: function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
};

app.isOnTablet = function() {
    return $(window).width() >= 600;
};

app.service = null;
//app.isOnAndroid = true;

app.game = {
    step: '',
    step1Item: null,
    step2Item: null,
    step3Item: null,
    step4Item: null,
    completed: false,
    settings: {
        urlDrRick: 'http://www.essentialpathways.com/spiritual-counseling',
        urlHomePage: 'http://EssentialPathways.com',
        urlRateOnAndroid: 'https://play.google.com/store/apps/details?id=com.rian.transformcards'
    },
    newGame: function () {
        this.step = 'step1';
        this.step1Item = null;
        this.step2Item = null;
        this.step3Item = null;
        this.step4Item = null;
        this.completed = false;
    },
    randomItem: function () {
        var me = this;
        switch (me.step) {
            case 'step1':
                var index = app.utiles.random(0, app.cards.step1.length);
                me.step1Item = app.cards.step1[index];
                break;
            case 'step2':
                var index = app.utiles.random(0, app.cards.step2.length);
                me.step2Item = app.cards.step2[index];
                break;
            case 'step4':
                var index = app.utiles.random(0, app.cards.step3.length);
                me.step4Item = app.cards.step3[index];
                break;
        }
    },
    goNext: function () {
        var index = 0;
        while (index < app.cards.steps.length) {
            var step = app.cards.steps[index];
            index++;
            if (step == this.step) {
                break;
            }
        }
        if (index >= app.cards.steps.length) {
            index = app.cards.steps.length - 1;
        }
        this.step = app.cards.steps[index];
    },
    handleBack: function () {
        if ((app.game.step == 'step1' || app.game.completed) && app.currentPage.url == 'pages/cards.html') {
            return;
        }

        function bindExitDialog() {
            app.currentPage.backbutton(function () {
                var dialog = new nova.widgets.Dialog('dialogQuiteGame');
                dialog.title = 'Restart?';
                dialog.content = 'Do you want to restart Inner Oracle Cards?';
                dialog.height = 160;
                dialog.buttons = {
                    'YES': function () {
                        app.game.restart();
                    },
                    'NO': function () {
                        app.currentPage.backbuttonHandlers.pop();
                        dialog.close();
                    },
                    'Exit': function () {
                        app.exit();
                    }
                };
                dialog.closing = function () {
                    app.currentPage.backbuttonHandlers.pop();
                };
                dialog.closed = function () {
                    bindExitDialog();
                };
                app.currentPage.backbutton(function () {
                    dialog.close();
                });
                dialog.show();
            });
        }

        bindExitDialog();
    },
    handleMenu: function () {
        app.events.menuButton(function () {
            var actionsheet = nova.widgets.actionSheet;
            if (actionsheet.isShowing()) {
                actionsheet.remove();
            } else {
                nova.widgets.actionSheet.show([
                    {
                        text: 'Start Over',
                        handler: function () {
                            app.game.restart();
                        }
                    },
                    {
                        text: 'History',
                        handler: function () {
                            app.gotoPage('pages/history.html');
                        }
                    },
                    {
                        text: 'FAQ',
                        handler: function () {
                            app.gotoPage('pages/faq.html');
                        }
                    },
                    {
                        text: 'Visit EssentialPathways.com',
                        handler: function () {
                            window.open(app.game.settings.urlHomePage, '_blank', 'location=yes');
                        }
                    },
                    {
                        text: 'Rate and Review This App',
                        handler: function () {
                            window.open(app.game.settings.urlRateOnAndroid, '_blank', 'location=yes');
                        }
                    }
                ]);
            }
        });
    },
    restart: function (fromPage) {
        fromPage = fromPage == undefined ? 'pages/cards.html' : fromPage;
        var home = 'home.html';
        app.game.newGame();
        app.histories = [];
        if (fromPage != home) {
            app.histories.push(new nova.Page(home));
        }
        app.currentPage.needAddingToHistory = false;
        app.gotoPage(fromPage);
    },
    share: function () {
        var issue = app.game.step1Item.text;
        var negative = $('<div></div>').html(app.game.step2Item.text).text();
        var conscious = app.game.step3Item;
        var unconsious = app.game.step4Item;
        var textString = 'Issue:\n' + issue + '\n\nNegative Tendency:\n' + negative + '\n\nConscious Affirmation:\n'
            + conscious + '\n\nUnconscious Affirmation:\n' + unconsious +
            '\n\n Try the Inner Oracle Cards for yourself at \b http://www.essentialpathways.com/inner-oracle-cards';

        //if (app.isOnAndroid) {
        //    cordova.exec(function(winParam) {
        //
        //    }, function(error) {
        //        alert('share error: ' + error);
        //    }, "Share",
        //        "", [{
        //            subject: 'Inner Oracle Cards',
        //            text: textString
        //        }]);
        //} else
        //{
        //    //"PostToTwitter",
        //    var types = ["PostToFacebook", "Message",
        //               "Mail", "Print", "CopyToPasteboard", "AssignToContact", "SaveToCameraRoll"];
        //
        //    cordova.exec(function(winParam) {
        //
        //    }, function(error) {
        //        alert('share error: ' + error);
        //    }, "SocialMessage",
        //        "send", [{
        //            message: textString,
        //            activityTypes: types.join(",")
        //        }]);
        //}
        var options = {
            message: textString, // not supported on some apps (Facebook, Instagram)
            subject: 'My latest Inner Oracle Card reading:' // fi. for email
        };
        var onSuccess = function(result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
        };

        var onError = function(msg) {
            console.log("Sharing failed with message: " + msg);
        };
        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    },
    getPlayData: function () {
        var play = new Play();
        play.step1ItemIndex = app.cards.step1.indexOf(app.game.step1Item);
        play.step2ItemIndex = app.cards.step2.indexOf(app.game.step2Item);
        play.step3ItemIndex = app.game.step1Item.cards.indexOf(app.game.step3Item);
        play.step4ItemIndex = app.cards.step3.indexOf(app.game.step4Item);
        return play;
    },
    setPlayData: function (play) {
        var me = this;
        me.step = 'step5';
        me.step1Item = app.cards.step1[play.step1ItemIndex];
        me.step2Item = app.cards.step2[play.step2ItemIndex];
        me.step3Item = me.step1Item.cards[play.step3ItemIndex];
        me.step4Item = app.cards.step3[play.step4ItemIndex];
        me.completed = true;
    },
    setStartedFromHome: function () {
        app.histories = [];
        app.histories.push(new nova.Page('home.html'));
    }
};

app.cards = {
    steps: ['step1', 'step2', 'step3', 'step4', 'step5'],
    step1: [
        {
            name: 'addiction',
            text: 'Addiction',
            cards: [
                'Desire without Love is endless addiction.',
                'Addiction is always trying to find the Self outside of the Self.',
                'Until enlightenment we are all addicted to something.',
                'All recovery is, in essence, joyful, for it is the Self that is being recovered.'
            ],
            next1Text: 'If I Could Just Not Feel The Pain Then I’d Be OK',
            next1: 'http://www.essentialpathways.com/pathways/addiction',
            next2Text: 'Freedom: Releasing Unrewarding And Addictive Behaviors',
            next2: 'http://www.essentialpathways.com/?wpsc-product=freedom-releasing-unrewarding-and-addictive-behaviors'
        },
        {
            name: 'authoritygod',
            text: 'Authority & God',
            cards: [
                'All authority issues are ultimately issues with God.',
                'If you could love your child unconditionally, how could God, your creator, love you any differently?',
                'The voice of fear is the ego trying to play God.',
                'Our beliefs in what God thinks about us are nothing more than projections of what we think about ourselves.'
            ],
            next1Text:"It's God's Fault",
            next1: 'http://www.essentialpathways.com/pathways/its-gods-fault',
            next2Text: 'Re-Parenting Ourselves: Healing Mother And Father Issues',
            next2: 'http://www.essentialpathways.com/?wpsc-product=re-parenting-ourselves-healing-mother-and-father-issues'
        },
        {
            name: 'bodyhealth',
            text: 'Body & Health',
            cards: [
                'Excess weight only gives the illusion of protection. Seek to experience your true Self, for it doesn\'t need protection at all.',
                "The body is your perfect servant; it follows your instructions impeccably. Don't blame the servant for the orders of the 'master.'",
                "You can eat to be filled, but you cannot eat to be fulfilled.",
                "To deprive your self of your symptom before it is time, is to deprive yourself of your learning before it is complete."
            ],
            next1Text: "I'm Afraid To Be Truly Sexual",
            next1: 'http://www.essentialpathways.com/pathways/sexuality',
            next2Text: 'Weight Loss From The Inside Out!',
            next2: 'http://www.essentialpathways.com/?wpsc-product=weight-loss-from-the-inside-out'
        },
        {
            name: "commitmentpurpose",
            text: "Commitment & Purpose",
            cards: [
                "Each of us has a purpose; the resistance to fulfilling it causes suffering.",
                "In the end, our only purpose is to love everyone unconditionally.",
                "Without commitment there is no completion.",
                "Know your commitment and you'll realize your power."
            ],
            next1Text: "I Don't Deserve To Do What I Want Or Love",
            next1: 'http://www.essentialpathways.com/pathways/i-dont-deserve-to-do-what-i-want-or-love',
            next2Text: "The Light-Traveler's Notebook CD",
            next2: 'http://www.essentialpathways.com/?wpsc-product=the-light-travelers-notebook-cd'
        },
        {
            name: "communication",
            text: "Communication",
            cards: [
                "From communion comes true communication. We communicate best from Oneness.",
                "All communication is contained in one act of love.",
                "If there is a problem in communication, your unhealedness is its source and your healing is its solution.",
                "Effective communication is spoken in the 'language' of the listener."
            ],
            next1Text: 'If I Open Up And Reveal Myself I Will Be Hurt',
            next1: 'http://www.essentialpathways.com/pathways/if-i-open-up-and-reveal-myself-i-will-be-hurt',
            next2Text: 'Self-Expression, Communication And Creativity',
            next2: 'http://www.essentialpathways.com/?wpsc-product=self-expression-communication-and-creativity'
        }, //----end 5---------------------------
        {
            name: "creatorship",
            text: "Creatorship",
            cards: [
                "If you want to see what your subconscious is programmed to create, look at your life now. If you don't like it, change the programs.",
                "There are no mysteries. There is only that which you have not been fully willing to know yet.",
                "What is' is the perfect lesson that you have created. Mind your own Is-ness!",
                "Life is like a buffet. We've been standing around complaining that others have more than we and we've forgotten that we served ourselves in the first place."
            ],
            next1Text: "It's God's Fault",
            next1: 'http://www.essentialpathways.com/pathways/its-gods-fault',
            next2Text: 'Creatorship Card',
            next2: 'http://www.essentialpathways.com/?wpsc-product=creatorship-card'
        },
        {
            name: "death",
            text: "Death - (often refers to death of the ego)",
            cards: [
                "Death is just a hallway between two classrooms of life.",
                "Death is only a change of clothes for spirit.",
                "Fear not death...love knows no vacations, no goodbyes.",
                "We don't really die, only the illusions we hold of ourselves disappear."
            ],
            next1Text: 'Short Clearings',
            next1: 'http://www.essentialpathways.com/short-clearings',
            next2Text: 'Returning To The True Self: Clearing An Inner Path To Peace And Bliss',
            next2: 'http://www.essentialpathways.com/?wpsc-product=returning-to-the-true-self-clearing-an-inner-path-to-peace-and-bliss'
        },
        {
            name: "failure",
            text: "Failure",
            cards: [
                "The only real 'failure' there is, is the refusal to learn from the experiences of the past, and the insistence on judging learning as failure.",
                "We don't only grow from what we are good at and know. We also grow from what we don't know and have not yet experienced.",
                "In the end, it will not be asked how much we've done, but how much we've loved.",
                "'Failure' is judgment falsely imposed on experience."
            ],
            next1Text: 'I Am Afraid To Love What I Do',
            next1: 'http://www.essentialpathways.com/pathways/i-am-afraid-to-love-what-i-do',
            next2Text: 'No Fault Card',
            next2: 'http://www.essentialpathways.com/?wpsc-product=no-fault-card'
        },
        {
            name: "forgiveness",
            text: "Forgiveness",
            cards: [
                "Holding others as the source of your pain only increases the discomfort, and delays its release.",
                "There are two paths to forgiveness: Love (in which differences melt) and the owning of one's Creatorship (wherein others are seen as willing actors in your play and therefore as perfect Co-creators)",
                "Your reaction is the lesson. Forgiveness is the diploma.",
                "Forgiveness happens when you can see the underlying perfection of what you have 'created'."
            ],
            next1Text: 'To Forgive Is To Leave Myself Vulnerable To It Happening Again',
            next1: 'http://www.essentialpathways.com/pathways/to-forgive-is-to-leave-myself-vulnerable-to-it-happening-again',
            next2Text: 'Guilt, Shame & Forgiveness',
            next2: 'http://www.essentialpathways.com/?wpsc-product=guilt-shame-forgiveness'
        },
        {
            name: "intimacy",
            text: "Intimacy",
            cards: [
                "Intimacy is finding that your lover's hand is really the hand of god.",
                "Intimacy is the feeling of the oneness with Self, not the sharing of information.",
                "Everyone is called to intimacy. Some, as yet, are afraid to open the invitation.",
                "All intimacy issues are, in essence, issues with God, because there is only one intimacy and that is oneness with God."
            ],
            next1Text: "I'm Afraid To Be Truly Sexual",
            next1: 'http://www.essentialpathways.com/pathways/sexuality',
            next2Text: 'Oneness, Intimacy And Sexuality',
            next2: 'http://www.essentialpathways.com/?wpsc-product=oneness-intimacy-and-sexuality'
        }, //-------end 10 ------------------------------
        {
            name: "intuition",
            text: "Intuition",
            cards: [
                "If you want to experience your intuition, first be willing not to know.",
                "The payment to attend the inner school of learning is in-tuition!",
                "Intellect is of the head. Intuition is of the heart.",
                "Intuition is an effortless flow. Trust increases flow. Trying decreases flow."
            ],
            next1Text: 'Spirit And Wealth',
            next1: 'http://www.essentialpathways.com/short-clearings/learning-to-listen-to-your-intuition',
            next2Text: 'Developing Intuition - The Signal: An Inner Pathway To Innate Intelligence',
            next2: 'http://www.essentialpathways.com/?wpsc-product=developing-intuition-the-signal-an-inner-pathway-to-innate-intelligence'
        },
        {
            name: "judgement",
            text: "Judgment",
            cards: [
                "Rather than resisting, accepting something as it appears right now is the most powerful first step in transforming it.",
                "Blame is like cement. It binds one to the past.",
                "All judgment is, in essence, self-judgment.",
                "Shame is the imposition of judgment on a perfection that has not yet been understood."
            ],
            next1Text: 'To Withhold Forgiveness Makes Me Feel Better About Myself',
            next1: 'http://www.essentialpathways.com/pathways/to-withhold-forgiveness-makes-me-feel-better-about-myself',
            next2Text: 'Guilt, Shame & Forgiveness',
            next2: 'http://www.essentialpathways.com/?wpsc-product=guilt-shame-forgiveness'
        },
        {
            name: "love",
            text: "Love",
            cards: [
                "I do not have to give to be loved: I have to give love.",
                "No one has to change one bit for you to love them.",
                "All actions, if done from unconditional love, regardless of the seeming outcome, serve love.",
                "It is about one thing: the ability to expand your capacity to love unconditionally."
            ],
            next1Text: 'It Hurts To Love',
            next1: 'http://www.essentialpathways.com/pathways/it-hurts-to-love',
            next2Text: 'Self-Love As The Basis Of All Healing: Body/Mind/Spirit',
            next2: 'http://www.essentialpathways.com/?wpsc-product=self-love-as-the-basis-of-all-healing-bodymindspirit'
        },
        {
            name: "moneysuccess",
            text: "Money & Success",
            cards: [
                "To increase your success, increase your loving.",
                "Money is an expression of God's love... How willing are you to be loved?",
                "Drawing abundance to ourselves is simply allowing the world to mirror more perfectly who we really are.",
                "If God is fullness, how can lack be spiritual?"
            ],
            next1Text: 'Abundance Is More Than I Deserve',
            next1: 'http://www.essentialpathways.com/pathways/abundance',
            next2Text: 'Affluence As A Path',
            next2: 'http://www.essentialpathways.com/?wpsc-product=affluence-as-a-path'
        },
        {
            name: "painfeelings",
            text: "Pain & Feelings",
            cards: [
                "A symptom will be in your life only as long as it's needed to alert you to the job of clearing an underlying distortion of consciousness. Then it is free to go.",
                "The fire alarm is not how we put out the fire. Pain is only for the purpose of awakening. You can surrender your mistaken attachment to 'healing through pain.",
                "In order to feel love, first you have to feel.",
                "If there is suffering, there is attachment."
            ],
            next1Text: 'Sweeping Out The Heart',
            next1: 'http://www.essentialpathways.com/short-clearings/sweeping-out-the-heart',
            next2Text: 'Self-Love As The Basis Of All Healing: Body/Mind/Spirit',
            next2: 'http://www.essentialpathways.com/?wpsc-product=self-love-as-the-basis-of-all-healing-bodymindspirit'
        }, //----end 15 ------------------------
        {
            name: "pleasurehappiness",
            text: "Pleasure & Happiness",
            cards: [
                "There is never enough pleasure outside of you to keep you pleased.",
                "Nothing that happens to you can ever be the source of your happiness, and nothing you experience can ever take your happiness away. Happiness is not 'Happeningness'",
                "The only real and lasting pleasure is in remembering who you are.",
                "That which you empower to be the 'source' of you happiness, you also falsely empower to be the 'source' of your suffering."
            ],
            next1Text: "Happiness Doesn't Last",
            next1: 'http://www.essentialpathways.com/pathways/happiness-doesnt-last',
            next2Text: 'Only Everything Fulfills A Child Of God',
            next2: 'http://www.essentialpathways.com/?wpsc-product=only-everything-fulfills-a-child-of-god'
        },
        {
            name: "power",
            text: "Power",
            cards: [
                "Personal power seeks gratification and is always needing more. Real power comes from a place of fullness and is complete.",
                "Personal power seemingly serves the wielder. Real power serves all of creation.",
                "Real power is the ability to give expression to love.",
                "Personal power creates learning. Real power creates transformation."
            ],
            next1Text: 'Power Hurts And Destroys',
            next1: 'http://www.essentialpathways.com/pathways/power-hurts-and-destroys',
            next2Text: 'Coming Into Real Power',
            next2: 'http://www.essentialpathways.com/?wpsc-product=coming-into-real-power'
        },
        {
            name: "relationship",
            text: "Relationship",
            cards: [
                "Trust one thing about people... that everyone is serving you perfectly, just as you 'hired' them to do.",
                "Receiving is a gift we give to the giver.",
                "Others can only trigger what is already there. This is how they serve you in your healing.",
                "If someone offers you an idea that you react harshly to, know that it is a call to healing, or you would not react at all."
            ],
            next1Text: 'My Happiness Is Separate From Your Happiness',
            next1: 'http://www.essentialpathways.com/pathways/my-happiness-is-separate-from-your-happiness',
            next2Text: 'Oneness, Intimacy And Sexuality',
            next2: 'http://www.essentialpathways.com/?wpsc-product=oneness-intimacy-and-sexuality'
        },
        {
            name: "responsibility",
            text: "Responsibility",
            cards: [
                "Your true responsibility is the responsibility of being the 'real you' in the world. Be thyself.",
                "Do not try to take emotional responsibility for anyone else, for response-ability is based on the ability to respond.",
                "You can't do anything for anyone that they are unwilling to do for themselves.",
                "If you take responsibility for someone, you take responsibility from someone. This weakens both."
            ],
            next1Text: 'Power Hurts And Destroys',
            next1: 'http://www.essentialpathways.com/pathways/power-hurts-and-destroys',
            next2Text: 'Coming Into Real Power',
            next2: 'http://www.essentialpathways.com/?wpsc-product=coming-into-real-power'
        },
        {
            name: "surrender",
            text: "Surrender",
            cards: [
                "Control is the ego denying God. Surrender is the Self recognizing God.",
                "If you want to be truly happy, resign as the Director of the Universe.",
                "Surrender!!! The gifts God has in store for you are far better than the ones you've planned for yourself!",
                "Never ask for anything that you wouldn't immediately surrender to God."
            ],
            next1Text: 'Embracing The Emptiness',
            next1: 'http://www.essentialpathways.com/short-clearings/embracing-the-emptiness',
            next2Text: 'Returning To The True Self: Clearing An Inner Path To Peace And Bliss',
            next2: 'http://www.essentialpathways.com/?wpsc-product=returning-to-the-true-self-clearing-an-inner-path-to-peace-and-bliss'
        }
    ],
    step2: [
        {
            name: "addiction",
            text: "<b>Addiction</b><br>(dependence on anything outside of oneself)"
        },
        {
            name: "anger",
            text: "<b>Anger</b>"
        },
        {
            name: "attachment",
            text: "<b>Attachment</b>"
        },
        {
            name: "avoidance",
            text: "<b>Avoidance</b>"
        },
        {
            name: "blame",
            text: "<b>Blame</b>"
        }, // ---------- end 5 -----------------
        {
            name: "choosinguntruth",
            text: "<b>Choosing Untruth</b>"
        },
        {
            name: "control",
            text: "<b>Control</b>"
        },
        {
            name: "criticizing",
            text: "<b>Criticizing</b>"
        },
        {
            name: "egoaggrandizement",
            text: "<b>Ego Aggrandizement</b><br>(the ego's demand to be in control)"
        },
        {
            name: "fear",
            text: "<b>Fear</b>"
        }, // ---------- end 10 -----------------
        {
            name: "guilt",
            text: "<b>Guilt</b>"
        },
        {
            name: "insensitivity",
            text: "<b>Insensitivity</b>"
        },
        {
            name: "narcissism",
            text: "<b>Narcissism</b><br>(everything is about you)"
        },
        {
            name: "outofbalance",
            text: "<b>Out-of-Balance</b>"
        },
        {
            name: "regression",
            text: "<b>Regression</b><br> (getting stuck in the past)"
        }, // ---------- end 15 -----------------
        {
            name: "resistance",
            text: "<b>Resistance</b>"
        },
        {
            name: "selfdoubt",
            text: "<b>Self Doubt</b>"
        },
        {
            name: "shutdown",
            text: "<b>Shutdown</b>"
        },
        {
            name: "withdrawal",
            text: "<b>Withdrawal</b>"
        }
    ],
    step3: [
        "If you are not getting something you want, increase your loving. Love brings fulfillment.",
        "How have you forgotten your creatorship in this matter?",
        "An illuminated screen accepts no projection. The brighter you are, the less judgment will affect you.",
        "Reclaim the power to make yourself happy.",
        "What you won't face you'll carry on your back until you do.", //----------end 5 ----------
        "Problems are just solutions trying to get your attention!",
        "We are like string beans; when we are connected to 'de-vine' we get nourished!",
        "The important thing is not the problem, it is the healing that comes from the solving it.",
        "The more you put your faith in that which is always changing, the more you will be disappointed. Embrace the unchanging.",
        "If a 'positive attitude' is a rug under which you sweep a lot of negative feelings, eventually, the unprocessed emotion will pull the rug out from under you.", //--------end 10 ----------
        "You can feed something by attention or avoidance.",
        "Don't think that the gifts are given by the postman! God is the only real giver; everyone else just delivers!",
        "Only love is real. All else will eventually disappear.",
        "Judging it binds it. Love it unconditionally and it will transform.",
        "If you could see the whole truth, you would know that the only appropriate responses are: 'Thank you' and 'I love you.'", //---------end 15 -----------
        "Cherish the right to be wrong. Mistakes are great teachers.",
        "You are not the distortions or limitations. You are the perfection, even if yet unseen.",
        "'It' has no power to make you happy or sad other than what you momentarily ascribe to it.",
        "To be 'enough', all I have to be is who I truly am.",
        "It is impossible to become what You already are. And You are already perfect.", //---------end 20 -----------
        "There is no recovery without Self-recovery.",
        "Do not judge or fear what you have created. Learn from it, love it, and it will change.",
        "The outer is always changing; this is how we learn. The inner essence is never changing; this is who we are.",
        "You can have anything you want. In fact, you already do (subconsciously, of course)."
    ]
};