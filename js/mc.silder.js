/**
 * Created by Administrator on 2019/7/18 0018.
 */
(function ($) {
    var instance = null;
    $.fn.extend({
        mcSlider: function (settings) {
            /*
             * $.type()  类似  typeof
             * */
            if ($.type(settings) == "string") return;
            /*
             * 开始操作
             * */
            return this.each(function () {
                var $element = $(this);
                if (!instance) {
                    //创建实例化对象
                    instance = new vmcSlider($element, settings);
                    instance._init();
                }
            });
        }
    });
    var effects = {
        "fade": function () {
            var that = this, node = that.node, opt = that.options;
            node.items.children().eq(that.index).css({
                display: "none",
                zIndex: 2
            }).fadeIn(opt.speed, function () {
                $.animatechange(that.index);
                that.imageFade();
            });
        }
    }
    /*
     * 构建函数  vmcSlider
     *  封装方法
     *
     *  默认参数属性
     * */
    var vmcSlider = function (element, settings) {
        var that = this;
        that.options = $.extend({}, that.options, settings);
        that.node = {elem: element};
        that.index = 0;
        that.startindex = 0;
    }
    /*
     * 原型追加  options
     * 默认的配置
     * */
    vmcSlider.prototype.options = {
        width: 1000,
        height: 300,
        gridCol: 10,
        gridRow: 5,
        gridH: 20,
        gridV: 10,
        effects: ["fade"],
        duration: 2000,
        speed: 900,
        isscend: true
    }
    /*
     * 动画对象的初始化方法  init
     * */
    vmcSlider.prototype._init = function () {
        var that = this, node = that.node, opt = that.options;
        /*
         * 动态创建dom
         * */
        that._create();
        that._size();
        that._bind();
        //初始化第一张显示
        node.items.children().eq(that.index).show();
        node.buttons.children().eq(that.index).addClass("vui-button-cur");
        //设置动画的计时器  开始加载动画
        that.time = setTimeout(function () {
            //动画加载的方法
            if (opt.isscend == true) {
                that.next();
            }
            else {
                that.prev();
            }
        }, opt.duration);
    }
    /*
     *  动态创建dom元素的方法  _create
     * */
    vmcSlider.prototype._create = function () {
        var that = this, opt = that.options, node = that.node;
        node.mimc = $("<div class='vui-slider'></div>");
        node.items = $("<div class='vui-items'></div>").appendTo(node.mimc);
        node.buttons = $("<div class='vui-buttons'></div>").appendTo(node.mimc);
        node.prev = $("<div class='vui-prev vui-left'></div>").appendTo(node.mimc);
        node.next = $("<div class='vui-next vui-right'></div>").appendTo(node.mimc);
        node.transfor = $("<div class='vui-transfer'></div>").appendTo(node.mimc);
        node.elem.children().each(function () {
            node.item = $("<div class='vui-item'></div>").append($(this));
            node.items.append(node.item);
            $("<div class='vui-button'></div>").appendTo(node.buttons);
        });
        /*
         * 元素的替换
         * */
        node.elem.replaceWith(node.mimc);
        /*
         * 创建动画的dom元素
         * 三种情况  ["","",""]
         * */
        node.stageHtml = ["", "", ""];
        //造块块
        var gridW = opt.width / opt.gridCol;
        var gridH = opt.height / opt.gridRow;
        for (var i = 0; i < opt.gridCol * opt.gridRow; i++) {
            var left = i % opt.gridCol * gridW;
            var top = Math.floor(i / opt.gridCol) * gridH;
            node.stageHtml[0] += "<div style='position: absolute; background-size:" + opt.width + "px " + opt.height + "px; background-position:" + (-left) + "px " + (-top) + "px; left: " + left + "px;top: " + top + "px;width: " + gridW + "px; height: " + gridH + "px;'></div>";
        }
        //竖的元素
        var Hwidth = opt.width / opt.gridH;
        var Hheight = opt.height;
        for (var i = 0; i < opt.gridH; i++) {
            var left = i * Hwidth;
            node.stageHtml[1] += "<div style='position: absolute;background-size:" + opt.width + "px " + opt.height + "px; background-position:" + (-left) + "px 0px;left: " + left + "px;top:0px;width: " + Hwidth + "px; height: " + Hheight + "px;'></div>";
        }

        //水平的元素
        var Vwidth = opt.width;
        var Vheight = opt.height / opt.gridV;
        for (var i = 0; i < opt.gridV; i++) {
            var top = i * Vheight;
            node.stageHtml[2] += "<div style='position: absolute;background-size:" + opt.width + "px " + opt.height + "px; background-position:0px " + (-top) + "px;left:0px;top:" + top + "px;width: " + Vwidth + "px; height: " + Vheight + "px;'></div>";
        }
        node.transfor.html(node.stageHtml[2]);
    }
    /*
     * 设置大小的方法
     * */
    vmcSlider.prototype._size = function () {
        var that = this, opt = that.options, node = that.node;
        /*node.mimc.css({
         width:opt.width,
         height:opt.height
         });*/
        node.mimc.width(opt.width).height(opt.height);
        node.buttons.css({
            left: (opt.width - node.buttons.width()) / 2 + "px"
        });
    }
    /*
     * 给元素绑定事件
     * */
    vmcSlider.prototype._bind = function () {
        var that = this, opt = that.options, node = that.node;
        node.prev.add(node.next).hover(function () {
            $(this).addClass("vui-sidebutton-hover");

        }, function () {
            $(this).removeClass("vui-sidebutton-hover");
        }).on("click", function () {
            //停止计时器
            clearTimeout(that.time);
            if ($(this).hasClass("vui-left")) {
                that.next();
            }
            else {
                that.prev();
            }
        });
        node.buttons.children().on("click", function () {

        });
    }
    /*
     * 动画的prev   next
     * */
    vmcSlider.prototype.prev = function () {
        var that = this, node = that.node;
        that.index--;
        if (that.index < 0) {
            that.index = node.mimc.children().length - 1;
        }
        //调用动画加的方法
        that.play();
    }
    vmcSlider.prototype.next = function () {
        var that = this, node = that.node;
        that.index++;
        if (that.index > node.items.children().length - 1) {
            that.index = 0;
        }
        //调用动画加的方法
        that.play();
    }
    /*
     * 动画播放方法  play
     * */
    vmcSlider.prototype.play = function () {
        var that = this, node = that.node, opt = that.options;
        //点动画
        node.buttons.children().eq(that.index).addClass("vui-button-cur").siblings().removeClass("vui-button-cur");
        if (opt.effects.length) {
            //  加载更多dom  动画
            node.transfor.children().stop(true);
            //加载动画
            /*effects["fadeTopLeft"]*/
            effects[that.getEffects()].call(that);
        }
        else {
            //普通动画
            that.imageFade();
        }
    }
    /*
     * 特效获取的方法
     * */
    vmcSlider.prototype.getEffects = function () {
        var that = this, opt = that.options;
        that.startindex++;
        if (that.startindex > opt.effects.length - 1) {
            that.startindex = 0;
        }
        return opt.effects[that.startindex];
    }
    /*
     * 正常图片的切换
     * */
    vmcSlider.prototype.imageFade = function () {
        var that = this, opt = that.options, node = that.node;
        node.transfor.hide();
        node.items.children().css("zIndex", "1").eq(that.index).show().siblings().hide();
        that.time = setTimeout(function () {
            if (opt.isscend === true) {
                that.next();
            }
            else {
                that.prev();
            }

        }, opt.duration);
    }
    /*
     * 转化舞台的方法  三种dom元素
     * */
    vmcSlider.prototype.setStage = function (stage) {
        var that = this, node = that.node;
        that.imagesrc = node.items.children().eq(that.index).find("img").attr("src");
        node.transfor.html(node.stageHtml[stage]).show().children().css("backgroundImage", "url(" + that.imagesrc + ")");
    }
    /*
     * 特效函数  vmcSliderEffects
     * */
    $.extend({

        animatechange: function (index) {  /*index  0  1  c_index 0 1 2*/
            $(".animte-1").each(function (animateindex) {
                if (animateindex === index) {
                    console.log(1);
                    $(this).find("div").each(function (c_index) {
                        $(this).addClass("animation-" + c_index);
                    });
                }
                else {
                    $(this).find("div").each(function (c_index) {
                        $(this).removeClass("animation-" + c_index);
                    });
                }
            });
        },
        vmcSliderEffects: function () {
            if ($.isPlainObject(arguments[0])) {
                effects = $.extend({}, effects, arguments[0]);
            }
            else {
                /*effects[arguments[0]] = arguments[1];*/
            }
        }
    });
    /*
     * 所有的动画
     * */
    $.vmcSliderEffects({
        'fadeTopLeft': function () {
            var the = this, node = the.node, opts = the.options;
            the.setStage(0);
            node.transfor.children().css({opacity: 0}).each(function (i) {
                var x = i % opts.gridCol;
                var y = Math.floor(i / opts.gridCol);
                var delay = ((y + 1) / opts.gridRow + (x + 1) / opts.gridCol) / 2;
                delay = opts.speed / 3 * 5 * delay;
                $(this).delay(delay).animate({opacity: 1}, opts.speed / 3);
            }).last().queue(function () {
                $.animatechange(the.index);
                the.imageFade();
            });
        }, 'fadeBottomRight': function () {
            var the = this, node = the.node, opts = the.options;
            the.setStage(0);
            node.transfor.children().css({opacity: 0}).each(function (i) {
                var x = i % opts.gridCol;
                var y = Math.floor(i / opts.gridCol);
                var delay = 1 - (y / opts.gridRow + x / opts.gridCol) / 2;
                delay = opts.speed / 3 * 5 * delay;
                $(this).delay(delay).animate({opacity: 1}, opts.speed / 3);
            }).first().queue(function () {
                $.animatechange(the.index);
                the.imageFade();
            });
        }, 'fadeLeft': function () {
            var the = this, node = the.node, opts = the.options;
            the.setStage(1);
            node.transfor.children().css({opacity: 0}).each(function (i) {
                var delay = opts.speed / 3 * 5 * (i / opts.gridH);
                $(this).delay(delay).animate({opacity: 1}, opts.speed / 3);
            }).last().queue(function () {
                $.animatechange(the.index);
                the.imageFade();
            });
        },
        'fadeRight': function () {
            var the = this, node = the.node, opts = the.options;
            the.setStage(1);
            node.transfor.children().css({opacity: 0}).each(function (i) {
                var delay = opts.speed / 3 * 5 / opts.gridH * (opts.gridH - i);
                $(this).delay(delay).animate({opacity: 1}, opts.speed / 3);
            }).first().queue(function () {
                $.animatechange(the.index);
                the.imageFade();
            });
        },
        'bomb': function () {
            var the = this, node = the.node, opts = the.options;
            var max = 0;
            var index = 0;
            var gridWidth = opts.width / opts.gridCol;
            var gridHeight = opts.height / opts.gridRow;
            the.setStage(0);
            node.transfor.children().css({
                top: (opts.height - gridHeight) / 2,
                left: (opts.width - gridWidth) / 2,
                opacity: 0
            }).each(function (i) {
                var x = i % opts.gridCol;
                var y = Math.floor(i / opts.gridCol);
                var top = gridHeight * y;
                var left = gridWidth * x;
                var delay = opts.speed / 2 * Math.random();
                if (delay > max) {
                    max = delay;
                    index = $(this).index();
                }
                $(this).delay(delay).animate({top: top, left: left, opacity: 1}, opts.speed / 2);
            }).eq(index).queue(function () {
                $.animatechange(the.index);
                the.imageFade();
            });
        }
    });
})(jQuery);