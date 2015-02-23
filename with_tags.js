$.fn.withTags = function( options ){
  var xToPixels = function(x_percentage, width){
    return x_percentage * width;
  };

  var yToPixels = function(y_percentage, height){
    return y_percentage * height;
  };

  // Extend our default options with those provided.
  var opts = $.extend( {}, $.fn.withTags.defaults, options );
  // The taggable object is wrapped by a div, that
  // will contain the tags.
  var height = this.actual('height');
  var width = this.actual('width');
  this.wrap("<div class='with_tags_wrapper'></div>");

  var with_tags_wrapper = this.parent();
  with_tags_wrapper.css({position: 'relative', display: 'inline-block'});

  var tags = [];

  // Create and insert tags into the container  
  opts.tags.forEach(function(tag){
    var tag_container = $("<div class='tag_container'></div>");
    tag_container.css('display', 'inline-block');
    var tag_label_text = tag.label == null ? '' : tag.label;
    var tag_label = $("<div class='tag_label'>" + tag_label_text + "</div>");
    tag_label.css('display', 'inline-block');

    tag_container.append(tag_label);
    
    // Create and insert tooltip if there is any
    if(tag.tooltip != null){
      var tag_tooltip = $("<div class='tag_tooltip'>" + tag.tooltip + "</div>");
      if(opts.display_tooltip == 'mouseover'){
        tag_tooltip.css('display', 'none');
        tag_label.on('mouseenter', function(){
          tag_tooltip.css('display', 'block');
        });
        tag_container.on('mouseleave', function(){
          tag_tooltip.css('display', 'none');
        });
      };
      tag_container.append(tag_tooltip);
    };

    // Get (x,y) in pixels for positioning
    var x, y;
    if(opts.unit == 'percentage'){
      x = xToPixels(tag.x, width);
      y = yToPixels(tag.y, height);
    }
    else {
      x = tag.x;
      y = tag.y;
    }

    // Position tags
    tag_container.css({
      position: 'absolute',
      left: x,
      top: y
    });
    tags.push(tag_container);
  });

  tags.forEach(function(tag){
    with_tags_wrapper.append(tag);
  });

  if(opts.display_tags == 'mouseover'){
    with_tags_wrapper.on('mouseleave', function(){
      tags.forEach(function(tag){ tag.css('display', 'none'); });
    });

    with_tags_wrapper.on('mouseenter', function(){
      tags.forEach(function(tag){ tag.css('display', 'inline'); });
    });
  }
};
 
// Plugin defaults – added as a property on our plugin function.
$.fn.withTags.defaults = {
    tags: [],
    unit: 'pixel',// pixel, percentage
    display_tags: 'always',// always, mouseover
    display_tooltip: 'mouseover'// always, mouseover
};