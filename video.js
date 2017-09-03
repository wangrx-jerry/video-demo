$(document).ready(function(){
	//获取video
	var video = $('#myVideo');
	//当JS载入时，删除默认video控件并控制区域隐藏
	video[0].removeAttribute("controls");
	$('.control').show().css({'bottom':-45});
	$('.loading').fadeIn(30);
	$('.caption').fadeIn(30);
 
	//在一切开始之前
	video.on('loadedmetadata', function() {
		//时间初始化
		$('.current').text(timeFormat(0));
		$('.duration').text(timeFormat(video[0].duration));
		//开始获取视频缓冲数据
		setTimeout(startBuffer, 150);
		//init用于覆盖在video上方用于控制点击暂停或播放
		var volumeDrag = false; 	
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
		$('#init').fadeIn(200);
	});
	
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
	
	//控件的事件
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
 
	
	
	//视频事件
	//视频canplay事件
	video.on('canplay', function() {
		$('.loading').fadeOut(100);
	});
	//等待视频加载
	video.on('waiting', function() {
		$('.loading').fadeIn(200);
	});
	
	
	//预计能够在不停下来进行缓冲的情况下持续播放指定的音频/视频时，会发生 canplaythrough 事件
	var completeloaded = false;
	video.on('canplaythrough', function() {
		completeloaded = true;
	});
	
	//seeking 属性返回用户目前是否在音频/视频中寻址。
	video.on('seeking', function() {
		//if video fully loaded, ignore loading screen
		if(!completeloaded) { 
			$('.loading').fadeIn(200);
		}	
	}); 
	//视频结束icon变为暂停
	video.on('ended', function() {
		$('.btnPlay').removeClass('paused');
		video[0].pause();
	});
	
	//点击进度条更新 已播放 进度条位置
	var timeDrag = false;	/* check for drag event */
	$('.middleControl').on('mousedown', function(e) {
		timeDrag = true;
		updatebar(e.pageX);
	});
	$(document).on('mouseup', function(e) {
		if(timeDrag) {
			timeDrag = false;
			updatebar(e.pageX);
		}
	});
	$(document).on('mousemove', function(e) {
		if(timeDrag) {
			updatebar(e.pageX);
		}
	});
	//计算进度条的位置
	//更新视频内容
	//进度条
	// duration 属性返回当前音频/视频的长度，以秒计。（总长度）
	// currentTime 属性设置或返回音频/视频播放的当前位置（以秒计）。（当前进度）
	var updatebar = function(x) {
		var progress = $('.progress');
		var maxduration = video[0].duration;
		var position = x - progress.offset().left;
		var percentage = 100 * position / progress.width();
		if(percentage > 100) {
			percentage = 100;
		}
		if(percentage < 0) {
			percentage = 0;
		}
		$('.timeBar').css('width',percentage+'%');	
		video[0].currentTime = maxduration * percentage / 100;
	};
	//格式化时间
	var timeFormat = function(seconds){
		var m = Math.floor(seconds/60)<10 ? "0"+Math.floor(seconds/60) : Math.floor(seconds/60);
		var s = Math.floor(seconds-(m*60))<10 ? "0"+Math.floor(seconds-(m*60)) : Math.floor(seconds-(m*60));
		return m+":"+s;
	};
});