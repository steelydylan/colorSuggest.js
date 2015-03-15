(function($){
	var rgbToHex = function(r,g,b){
		var rgb = b | (g << 8) | (r << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1);
	};
	var sortUnique = function(arr){
	   	var groups = arr.reduce(function(acc,e){acc[e] = (e in acc ? acc[e]+1 : 1); return acc}, {});
	   	var ret = [];
	   	var t = 0;
	   	for(var i in groups){
	   		ret[t] = {color:i,cnt:groups[i]};
	   		t++;
	   	}
	   	ret.sort(function(a,b){
	   		return a.cnt > b.cnt ? -1 : 1;
	   	});
	   	return ret;
	};
	$.fn.extend({
		colorSuggest:function(){
			var src = $(this).attr("src")
			var ret;
			var deffered = function(def){
				var image = new Image();
				image.onload = function(){
					var suggest = [];
					var cols = [];
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext("2d");
					var width = this.width;
					var height = this.height;
					canvas.width = width;
					canvas.height = height;
					canvas.style.width = width;
					canvas.style.height = height;
					ctx.drawImage(image,0,0,width,height);
					var data = ctx.getImageData(0,0,width,height).data;
	                for(var i=0;i<height;i++){
	                    for(var j=0;j<width;j++){
	                        var t = i*(width*4) + (j*4);
	                        cols.push(rgbToHex(data[t],data[t+1],data[t+2]));
	                    }
	                }
					def.resolve(sortUnique(cols));
				}
				image.src = src;
			};
			return $.Deferred(deffered).promise();
		}
	});
})(jQuery);