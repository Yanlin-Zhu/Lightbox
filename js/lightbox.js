;(function($){
	var Lightbox = function(settings){
		var self = this;
		this.settings = {
			speed:500,
			maxWidth:$(window).width(),
			maxHeight:$(window).height()
		}
		// 扩展
		$.extend(this.settings,settings || {})
		// 创建遮罩和弹出框
		this.popupMask=$('<div id="G-lightbox-mask">');
		this.popupWin=$('<div id="G-lightbox-popup">');
		// 保存body
		this.bodyNode = $(document.body);
		// 渲染剩余的DOM，并且插入到body下
		this.randerDOM();
		this.picViewArea = this.popupWin.find("div.lightbox-pic-view");
		this.popupPic = this.popupWin.find("img.lightbox-image");
		this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption");
		this.nextBtn = this.popupWin.find("span.lightbox-next-btn");
		this.prevBtn = this.popupWin.find("span.lightbox-prev-btn");
		this.captionText = this.popupWin.find("p.lightbox-caption-desc");
		this.currentIndex = this.popupWin.find("span.lightbox-of-index");
		this.closeBtn = this.popupWin.find("span.lightbox-close-btn");
		//准备开发事件委托(get新生成元素)，获取组数据
		this.groupName = null;
		this.groupData = [];//放置同一组数据
		this.bodyNode.on("click",".js-lightbox,*[data-role = lightbix]",function(e){
			// 组织事件冒泡
			e.stopPropagation()
			var currentGroupName = $(this).attr("data-group");
			if(currentGroupName != self.groupName){
				self.groupName = currentGroupName;
				// 根据当前组名获取同一组数据
				self.getGroup();
			}
			// 初始化弹出框
			self.initPopup($(this));
		})
		// 关闭弹出
		this.popupMask.click(function(){
			$(this).fadeOut();
			self.popupWin.fadeOut();
			this.clear = false;
		})
		this.closeBtn.click(function(){
			self.popupMask.fadeOut();
			self.popupWin.fadeOut();
			this.clear = false;
		})
		// 绑定上下切换按钮事件
		this.flag = true;
		this.nextBtn.hover(function(){
			if(!$(this).hasClass("disabled") && self.groupData.length>1){
				$(this).addClass("lightbox-next-btn-show")
			}
		},function(){
			if(!$(this).hasClass("disabled") && self.groupData.length>1){
				$(this).removeClass("lightbox-next-btn-show")
			}
		}).click(function(e){
			if(!$(this).hasClass("disabled")&&self.flag){
				self.flag = false;
				e.stopPropagation();
				self.goto("next")
			}
		})
		this.prevBtn.hover(function(){
			if(!$(this).hasClass("disabled") && self.groupData.length>1){
				$(this).addClass("lightbox-prev-btn-show")
			}
		},function(){
			if(!$(this).hasClass("disabled") && self.groupData.length>1){
				$(this).removeClass("lightbox-prev-btn-show")
			}
		}).click(function(e){
			if(!$(this).hasClass("disabled")&&self.flag){
				self.flag = false;
				e.stopPropagation();
				self.goto("prev")
			}
		})
		// 绑定窗口调整事件
		var timer = null;
		this.clear =false;
		$(window).resize(function(){
			if(self.clear){
				clearTimeout(timer)
				timer = window.setTimeout(function(){
					self.loadPicSize(self.groupData[self.index].src);
				},500)
			}
		}).keyup(function(e){
			// console.log(e.whitch)捕获键值
			var keyValue = e.which;
			if(self.clear){
				if(keyValue == 38 || keyValue == 37){
					self.prevBtn.click()
				}else if(keyValue == 40 || keyValue == 39){
					self.nextBtn.click()
				}
			}
		})
	}
	Lightbox.prototype = {
		goto:function(dir){
			if(dir === "next"){
				this.index++;
				if(this.index>=this.groupData.length-1){
					this.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show")
				}
				if(this.index!=0){
					this.prevBtn.removeClass("disabled")
				}
				var src = this.groupData[this.index].src;
				this.loadPicSize(src);
			}else if(dir === "prev"){
				this.index--;
				if(this.index!=this.groupData.length-1){
					this.nextBtn.removeClass("disabled")
				}
				if(this.index<=0){
					this.prevBtn.addClass("disabled").removeClass("lightbox-prev-btn-show")
				}
				var src = this.groupData[this.index].src;
				this.loadPicSize(src);
			}
		},
		loadPicSize:function(sourceSrc){
			var self = this;
			this.preLoadImg(sourceSrc,function(){
				//不加这句话图片会继承上一张图片的宽高图片变形
				self.popupPic.css({width:"auto",height:"auto"}).hide()
				self.popupPic.attr("src",sourceSrc);
				var picWidth = self.popupPic.width();
				var picHeight = self.popupPic.height();
				self.changePic(picWidth,picHeight)
			})
		},
		changePic:function(width,height){
			var self = this;
			maxWidth = this.settings.maxWidth;
			maxHeight = this.settings.maxHeight;
			// 如果图片太大溢出浏览器视口
			var scale = Math.min(maxWidth/(width+10),maxHeight/(height+10),1);
			height = height*scale;
			width = width*scale;
			this.picViewArea.animate({
				width:width-10,
				height:height-10
			},self.settings.speed)
			this.popupWin.animate({
				width:width,
				height:height,
				marginLeft:-(width/2),
				top:($(window).height()-height)/2
			},self.settings.speed,function(){
				self.popupPic.css({
					width:width-10,
					height:height-10
				}).fadeIn();
				self.picCaptionArea.fadeIn();
				self.flag = true;
				self.clear = true;
			})
			//设置描述文字和当前索引
			this.captionText.text(this.groupData[this.index].caption)
			this.currentIndex.text("当前索引："+(this.index+1)+"of"+this.groupData.length)
		},
		preLoadImg:function(src,callback){
			var img = new Image();
			img.src = src;
			if(!!window.ActiveXObject){
				//IE兼容onload
				img.onreadystatechange = function(){
					if(this.readystate == "complete"){
						callback();
					}
				}
			}else{
				img.onload = function(){
					callback();
				}
			}
		},
		showMaskAndPopup:function(sourceSrc,currentId){
			var self = this;
			this.popupPic.hide();
			this.picCaptionArea.hide();
			this.popupMask.fadeIn();
			var winWidth = $(window).width();
			var winHeight = $(window).height();
			this.picViewArea.css({
				width:winWidth/2,
				height:winHeight/2
			});
			this.popupWin.fadeIn();
			this.popupWin.css({
				width:winWidth/2+10,
				height:winHeight/2+10,
				marginLeft:-(winWidth/2+10)/2,
				top:-(winWidth/2+10)
			}).animate({
				top:(winWidth-winWidth/2+10)/2.5
			},self.settings.speed,function(){
				self.loadPicSize(sourceSrc);
			});
			// 根据当前前记得元素id获取在当前组别里面的索引
			this.index = this.getIndexOf(currentId);
			var groupDataLength = this.groupData.length;
			if(groupDataLength>1){
				if(this.index === 0){
					this.prevBtn.addClass("disabled");
					this.nextBtn.removeClass("disabled");
				}else if(this.index === groupDataLength-1){
					this.prevBtn.removeClass("disabled");
					this.nextBtn.addClass("disabled");
				}else{
					this.prevBtn.removeClass("disabled");
					this.nextBtn.removeClass("disabled");
				}
			}
		},
		getIndexOf:function(){
			var index = 0;
			$(this.groupData).each(function(i){
				index = i;
				if(this.id === currentId){
					return false;
				}
			});
			return index;
		},
		initPopup:function(currentObj){
			var self = this;
			sourceSrc = currentObj.attr("data-source");
			currentId = currentObj.attr("data-id");
			this.showMaskAndPopup(sourceSrc,currentId);
		},
		getGroup:function(){
			var self = this;
			// 根据当前组别名称，获取所有相同组别的对象
			var groupList = this.bodyNode.find("*[data-group = "+this.groupName+"]")
			//清空数组数据
			self.groupData.length = 0;
			groupList.each(function(){
				self.groupData.push({
					src:$(this).attr("data-source"),
					id:$(this).attr("data-id"),
					caption:$(this).attr("data-caption")
				})
			})
		},
		randerDOM:function(){
			var strDOM = '<div class="lightbox-pic-view">'+
				'<span class="lightbox-btn lightbox-prev-btn"></span>'+
				'<img class = "lightbox-image" src="images/2-2.jpg" alt="">'+
				'<span class="lightbox-btn lightbox-next-btn"></span>'+
			'</div>'+
			'<div class="lightbox-pic-caption">'+
				'<div class="lightbox-caption-area">'+
					'<p class = "lightbox-caption-desc"></p>'+
					'<span class="lightbox-of-index">当前索引：</span>'+
					'<span class="lightbox-close-btn"></span>'+
				'</div>'+
			'</div>';
			// 插入到this.popupWin
			this.popupWin.html(strDOM)
			// 把遮罩层和弹出框插入到body
			this.bodyNode.append(this.popupMask,this.popupWin)
		}
	}
	window['Lightbox'] = Lightbox;
})(jQuery);