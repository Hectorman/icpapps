module.exports = {

  friendlyName: 'Ver nueva comisión',

  description: 'Muestra la página de creación de comisiones',

  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/nueva-comision',
    }

  },


  fn: async function () {

     // Get the user ID  out of the session.
     var userId = this.req.session.userId;

     var userRegistro = await User.findOne({
        id: userId
     }).populate('registro');

     var comision = await Comision.findOne( { id: this.req.param('id') } );


    return {
      populatedUser: userRegistro,
      comision: comision
    };

  }


};
