module.exports = {

  friendlyName: 'Ver nuevo beneficio',


  description: 'Muestra la página de creación de beneficios',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/nuevo-beneficio',
    }

  },


  fn: async function () {

      // Get the user ID  out of the session.
      var userId = this.req.session.userId;

      var userRegistro = await User.findOne({
        id: userId
      }).populate('registro');

      var beneficios = await Beneficio.find().sort('createdAt DESC');

      return {
         populatedUser: userRegistro,
         beneficios: beneficios,
         beneficio: false
      };

  }


};
