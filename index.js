'use strict';

// match markdown image and covert to asset_img 
hexo.extend.filter.register('before_post_render', function(data){
    /**
     * 如果遇到了img标签, 做如下转换：
     * <img src="./xxxxx/image1.jpg" alt="image1" style="zoom:50%;" />
     * -> 
     * <img src="../xxxxx/image1.jpg" alt="image1" style="zoom:50%;" />  
     * 目的是同时支持hexo和Typora编辑器
     */
    data.content = data.content.replace(/<img.*?src="(.*?)"/g,
        function(match_str, srcAttr){ 
            
            if (srcAttr.startsWith("./")) {
                var oldSrc= srcAttr;
                var newSrc = "."+srcAttr;
                return match_str.replace(oldSrc, newSrc);
            }
            return match_str;
        
        }); 
    /**
     * 将![label](path1.jpg)的markdown语法转换成 {% asset_img path1.jpg label %} 的语法
     */
    data.content = data.content.replace(/!{1}\[([^\[\]]*)\]\((.*)\s?(?:".*")?\)/g,
        function(match_str, label, path){

            // if only one /
            if( (path.split("/")).length == 2){
                console.debug("Markdown Image Path: " + match_str);
                console.debug("asset_img string: " + "{% asset_img " + (path.split("/"))[1] + " " +  label + " %}" );
                return "{% asset_img \"" + (path.split("/"))[1] + "\" \"" +  label + "\" %}" 
            }else if( (path.split("/")).length == 3  && path.substring(0,2) == "./" ){
                console.debug("Markdown Image Path: " + match_str);
                return "{% asset_img \"" + (path.split("/"))[2] + "\" \"" +  label + "\" %}" 
            }else{
                console.debug(match_str);
                console.debug("Label :"+label);
                console.debug(path);
                console.debug("Markdown Image Path does not exists!");
                return match_str;
            }

        });

    return data;
});
