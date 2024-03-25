module.exports = {

  friendlyName: 'Ver nuevo convenio',


  description: 'Muestra la página de creación de convenios',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/nuevo-convenio',
    }

  },


  fn: async function () {

     // Get the user ID  out of the session.
     var userId = this.req.session.userId;

     var userRegistro = await User.findOne({
        id: userId
     }).populate('registro');


    return {
      populatedUser: userRegistro
    };

  }


};
