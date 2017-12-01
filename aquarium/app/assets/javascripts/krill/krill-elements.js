/////////////////////////////////////////////////////////////////////////////////////////////////////
// KRILL DISPLAY ELEMENTS
//

Krill.prototype.template = function(name) {
  return _.template($('#'+name+"-template").html());
}

Krill.prototype.fix = function(x) {
  var y = x;
  y.variable = y.var;  // replace default and var with keys that don't
  y.dflt = y.default;  // conflict with javascript keywords
  if ( !("sample" in x)  ) {
    y.sample = null;
  } 
  if ( !("multiple" in x ) ) {
    y.multiple = false;
  }
  return y;
}

Krill.prototype.title = function(x,title_tag) {
    title_tag.html(x);
    return false;
}

Krill.prototype.note      = function(x) { return $(this.template('note')({content: x})); }
Krill.prototype.check     = function(x) { return $(this.template('check')({content: x})); }
Krill.prototype.warning   = function(x) { return $(this.template('warning')({content: x})); }
Krill.prototype.bullet    = function(x) { return $(this.template('bullet')({content: x})); }
Krill.prototype.image     = function(x) { return $(this.template('image')({content: x})); }
Krill.prototype.select    = function(x) { return $(this.template('select')(this.fix(x))); }
Krill.prototype.input     = function(x) { return $(this.template('input')(this.fix(x))); }
Krill.prototype.take      = function(x) { return $(this.template('take')(this.fix(x))); }
Krill.prototype.separator = function(x) { return $(this.template('separator')()); }
Krill.prototype.log       = function(x) { return $("<div class='krill-log-in-show'></div>"); }

Krill.prototype.upload = function(x) {

  var y = this.fix(x);
  y.job = this.job;

  var container = $(this.template('upload')(y));
  var input = $('.krill-upload-input',container);
  var list = $('.krill-upload-list',container);
  var button = $('.krill-upload-button',container);
  var list_heading = $('.krill-upload-list-heading',container);
  var that = this;

  button.click(function() { 
    console.log("clicked")
    input.click();
  })

  $(function(e) {

    var config = {

      dataType: 'json',

      done: function (e, data) {
        data.context.empty().append($(that.template('uploaded-item')({
          name: data.files[0].name,
          id: data.result.upload_id
        })));
        input.fileupload(config);
      },

      add: function (e,data) {
        var el = $(that.template('upload-waiting')({name: data.files[0].name}));
        list_heading.show();        
        data.context = el;
        list.append(el);
        data.submit();
      },

      fail: function(e,data) {
        console.log('failed');
      }

    }

    input.fileupload(config);

  });

  return container;

}

Krill.prototype.table = function(x) {

  var tab = $('<table></table>').addClass('krill-table');

  for( var i=0; i<x.length; i++) {

    var tr = $('<tr></tr>');

    if ( x[i] ) {

      for( var j=0; j<x[i].length; j++ ) {

        if ( typeof x[i][j] != "object" ) {
          var td = $('<td>'+x[i][j]+'</td>');
        } else if ( x[i][j] == null ) {
          var td = $('<td></td>');
        } else if ( x[i][j].type ) {

          var td = $('<td></td>');

          td.append("<span class='krill-table-input-prompt'>&#9656;</span");

          td.append("<input type=" + x[i][j].type 
                                   + " value='"     + x[i][j].default + "'"
                                   + " data-opid="  + x[i][j].operation_id 
                                   + " data-key='"  + x[i][j].key     + "'"
                                   + " data-type='" + x[i][j].type    + "'"
                                   + " class='krill-table-input krill-table-input-large'"
                                   + "></input>");  

        } else {

          var td = $('<td>'+x[i][j].content+'</td>');

          if ( x[i][j].style ) {
            for ( var key in x[i][j].style ) {
              td.css(key,x[i][j].style[key]);
            }
          }

          if ( x[i][j].class ) {
            td.addClass(x[i][j].class);
          }

          if ( x[i][j].check ) {
            td.addClass('krill-td-check');
            (function(td) {
              td.click(function() {
                if ( td.hasClass('krill-td-selected') ) {
                  td.removeClass('krill-td-selected');
                } else {
                  td.addClass('krill-td-selected');
                }
              });
            })(td);

          }
        }
        tr.append(td);
      }
    }
    tab.append(tr);
  }

  return tab;

}