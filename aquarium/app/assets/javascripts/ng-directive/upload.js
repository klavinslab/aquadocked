(function() {

  var w = angular.module('aquarium'); 

  w.directive('customOnChange', function() {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var onChangeFunc = scope.$eval(attrs.customOnChange);
        element.bind('change', function(event){
          var files = event.target.files;
          onChangeFunc(files);
        });       
        element.bind('click', function(){
          element.val('');
        });
      }
    }
  });

  w.directive('upload', function() {

    return {

      restrict: 'EA',
      transclude: true,
      scope: { record: '=' },
      replace: true,

      template: "<label>"
              + "  <span ng-if='record.uploading' class='md-body-2'>Busy...</span>"
              + "  <span ng-if='!record.uploading' class='md-body-2'>Upload</span>"              
              + "    <input type=file"
              + "      id='upload'"
              + "      file='upload'"
              + "      data-url='/json/upload.json'"
              + "      multiple"
              + "      style='display: none;'>"
              + "</label>",       

      link: function(scope,element,attrs) {

        $(element).find('#upload').fileupload({
          dataType: "json",
          add: function(e,data) {
            data.submit();
            scope.record.uploading = true;
            AQ.update();
          },        
          done: function(e,data) {
            var da = scope.record.new_data_association();
            delete da.upload;
            da.upload = AQ.Upload.record(data.result);
            da.upload_id = data.result.id;
            da.url = data.result.url;
            scope.record.uploading = false;
            AQ.update();
          }
        });

      }
    }

  });

})();
