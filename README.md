# video-demo 简单说明
>html video 主要标签

```
<video id="myVideo" controls preload="auto" poster="./img/poster.jpg" width="100%" height="350">
    <source src="https://media.html5media.info/video.mp4" type="video/mp4" />
    <source src="...." type="...."/>
    ......
    <p>Your browser does not support the video tag.</p>
</video>
```
**video标签最好包含mp4、webM和ogg这三种源视频文件-可以跨浏览器。如果浏览器不支持html5，你可以使用flash作为后备**

>video 控制部分（播放，暂停，全屏，时间）主要代码：

1. 获取页面video：
```
var video = $('#myVideo');
```
2. 播放暂停

通过判断video的三个状态进行判断控制：1：paly（播放），2：paused（暂停），3：ended（结束），控制video的播放状态，同时切换对应的播放图标
```
//视频屏幕和播放按钮点击
	video.on('click', function() { playpause(); } );
	$('.btnPlay').on('click', function() { playpause(); } );
	var playpause = function() {
		if(video[0].paused || video[0].ended) {
			$('.btnPlay').addClass('paused');
			video[0].play();
		}
		else {
			$('.btnPlay').removeClass('paused');
			video[0].pause();
		}
	};
```
3.进度条

通过视频的已播放时间video[0].duration和总时间video[0].buffered.end(0)的比例关系，计算video进度条的长度
```
	//计算进度条长度
	//buffered视频缓冲范围
	//duration视频长度
	var startBuffer = function() {
		var currentBuffer = video[0].buffered.end(0);
		var maxduration = video[0].duration;
		var perc = 100 * currentBuffer / maxduration;
		$('.bufferBar').css('width',perc+'%');
			
		if(currentBuffer < maxduration) {
			setTimeout(startBuffer, 30);
		}
	};
	//显示当前视频播放时间
	// 计算 已播放 进度条长度
	video.on('timeupdate', function() {
		var currentPos = video[0].currentTime;
		var maxduration = video[0].duration;
		var perc = 100 * currentPos / maxduration;
		$('.timeBar').css('width',perc+'%');	
		$('.current').text(timeFormat(currentPos));	
	});
```
4.全屏播放
```
	//点击全屏
	$('.btnFS').on('click', function() {
		if($.isFunction(video[0].webkitEnterFullscreen)) {
			video[0].webkitEnterFullscreen();
		}	
		else if ($.isFunction(video[0].mozRequestFullScreen)) {
			video[0].mozRequestFullScreen();
		}
		else {
			alert('Your browsers doesn\'t support fullscreen');
		}
	});
```
5.其它
一开始的时候需要有一个蒙版在视频上方，用于存放播放图标并且在光标移入的时候显示底部的控制部分
```
$('.videoContainer')
		.append('<div id="init"></div>')
		.hover(function() {
			$('.control').stop().animate({'bottom':0}, 30);
			$('.caption').stop().animate({'top':0}, 30);
		}, function() {
			if(!volumeDrag && !timeDrag){
				$('.control').stop().animate({'bottom':-45}, 30);
				$('.caption').stop().animate({'top':-45}, 30);
			}
		})
		.on('click', function() {
			$('#init').remove();
			$('.btnPlay').addClass('paused');
			$(this).unbind('click');
			video[0].play();
		});
```
