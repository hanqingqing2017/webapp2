/**
 * Created by Administrator on 2017/3/30.
 */

(function () {
    //2.拼接之后-》获取操作元素
    var oUls = document.getElementById('oUls');
    //获取到所有要加载的图片
    var oImgs = oUls.getElementsByTagName('img');
    var winH = utils.win('clientHeight');
    //回到顶部按钮
    var back = document.getElementById('back');

    // 回到顶部
    var timer;
    back.onclick = function () {
        utils.win('scrollTop', 0);
        // 每隔一段时间 获取到此时scrollTop 让它递减到0（到达顶部）为止
        //  timer = setInterval (function () {
        //      var sTop = utils.win('scrollTop');
        //      if(sTop <= 0) {
        //          clearInterval(timer);
        //          utils.win('scrollTop', 0);
        //          return;
        //      }
        //      sTop -= 100;
        //      utils.win('scrollTop', sTop);
        //  },10)
    };


    //获取初始数据
    var data;

    function getInitData() {
        //发送ajax请求
        var xhr = new XMLHttpRequest;
        xhr.open('get', 'data.txt?_=' + Math.random(), false);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && /^2\d{2}$/.test(this.status)) {
               // console.log(this.responseText) ;//验证引入是否成功
                data= utils.toJson(this.responseText);// 将JSON格式转化为数组
              //  console.log(data);//控制台输出验证；
                //如果有数据的时候 再进行绑定
                data && data.length ? bindData(data) : null;
            }
        };
        xhr.send(null);
    }
    getInitData();//执行方法

    //绑定数据
    function bindData(data) {
        console.log(data);
        var str = '';
        for(var i=0;i<20;i++){
            var ind = Math.round(Math.random()*6);
            var cur = data[ind];

            str += '<li><a href=' + cur.link + '>';
            // 左边div 用来包着img
            //将img要加载的图片路径先保存到自身的data-real属性上只有符合加载标准再让当前img的src加载这个路径 否则显示默认背景图-》background: url("./image/default.png")
            str += '<div><img data-real= ' + cur.src + '></div>';//保存图片数据
            // 右边div
            str += '<div>';
            str += '<h3>' + cur.title + '</h3>';
            str += '<p>' + cur.text + '</p>';
            str += '</div>';

            str += '</a></li>';
        }
        oUls.innerHTML += str;
        delayImgs();
    }

    //延迟图片加载

    function delayImgs() {
        for(var i=0;i<oImgs.length;i++){
            //如果当前img flag为true 说明已经加载过了就执行进行检测下一个图片
            if(!oImgs[i].flag){
                checkImg(oImgs[i])
            }
         //   checkImg(oImgs[i])
        }
    }
    //检测当前图片是否符合加载标准
    function checkImg(img) {
        //滚出去的距离
        var sTop = utils.win('scrollTop');
        //获取图片 上边框外边 距离body 的上偏移量
        var imgTop = utils.offset(img).top;
        var imgH = img.offsetHeight;
        //如果浏览器窗口g高度+滚动条滚出距离》=图片上偏移+自身高度时说明图片已经完全出现窗口中，这时我再让图片加载
        if(winH + sTop>= imgTop+imgH){
            //获取到当前图片，自身保存在data-real上的图片路径
            var imgSrc = img.getAttribute('data-real');
            // 检测图片资源有效性
            img.src = imgSrc;

            var tempImg = new Image;//创建一个临时的img
            //tempImg 如果加载成功就会触发自身的onload事件
            tempImg.src=imgSrc;
            tempImg.onload=function () {
                console.log('加载成功');
                //让页面中img加载这个图片路径
                img.src = imgSrc;
                img.flag = true;//将加载过的img加一个flag属性为true 说明加载过
            }

        }
    }
    window.onscroll = function () {
       delayImgs();
        //当滚动条快要滚动到页面底部时继续发送数据请求进行加载
        var sTop =  utils.win('scrollTop');
        // clientHeight(窗口高度) + scrollTop（滚动条最大值） == scrollHeight
        var wScrollH = utils.win('scrollHeight');
        if(winH + sTop >= wScrollH - 500) {
            getInitData();
            console.log(123);
        }
        if(sTop>=winH*0.5){
            utils.setCss(back,'display','block');
        }else {
            utils.setCss(back,'display','none');
        }

    }
})();
