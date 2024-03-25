module.exports = {

  friendlyName: 'Ver detalle convenio',


  description: 'Muestra la página de creación de convenios',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/convenio',
    }

  },


  fn: async function () {

      // Get the user ID  out of the session.
      var userId = this.req.session.userId;

      var user = await User.findOne({
         id: userId
       });
   
      var params = {
         id: this.req.param('id')
      }

      if ( !user.isSuperAdmin ) params.owner = userId;

      var convenio = await Convenio.findOne( params );

      var paramsb = {}; 

      if ( !user.isSuperAdmin ) paramsb.owner = userId;

      var convenios = await Convenio.find().where( paramsb ).sort('createdAt DESC');

      return {
        convenio: convenio,
        convenios: convenios
      };

  }


};
