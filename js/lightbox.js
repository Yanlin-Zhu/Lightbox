;(function($){
	var Lightbox = function(){
		var self = this;
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
	}
	Lightbox.prototype = {
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
			},function(){

			})
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
			console.log(self.groupData)
		},
		randerDOM:function(){
			var strDOM = '<div class="lightbox-pic-view">'+
				'<span class="lightbox-btn lightbox-prev-btn"></span>'+
				'<img class = "lightbox-image" src="images/2-2.jpg" alt="">'+
				'<span class="lightbox-btn lightbox-next-btn"></span>'+
			'</div>'+
			'<div class="lightbox-pic-caption">'+
				'<div class="lightbox-caption-area">'+
					'<p class = "lightbox-pic-desc"></p>'+
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