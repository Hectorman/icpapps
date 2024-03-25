/**
 * FileController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
   
   index: function (req,res){

      res.writeHead(200, {'content-type': 'text/html'});
      res.end(
      '<form action="http://127.0.0.1:49156/file/upload" enctype="multipart/form-data" method="post">'+
      '<input type="text" name="title"><br>'+
      '<input type="file" name="avatar" multiple="multiple"><br>'+
      '<input type="submit" value="Upload">'+
      '</form>'
      )
   },
   upload: function  (req, res) {
      sails.log( 'wat!' );
      req.file('avatar').upload({
         dirname: require('path').resolve(sails.config.appPath, 'assets/files')
      }, function (err, files) {
        if (err)
          return res.serverError(err);
  
        return res.json({
          message: files.length + ' file(s) uploaded successfully!',
          files: files
        });
      });
   }

};

