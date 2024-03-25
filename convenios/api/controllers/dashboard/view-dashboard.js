module.exports = {

  friendlyName: 'Dashboard',


  description: 'Mensaje que se muestra al terminar de subir la comisión',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/dashboard',
    },

    redirect: {
      description: 'No tienes comisiones.',
      responseType: 'redirect'
    },

  },


  fn: async function ( exits ) {

    var user = await User.findOne({
      id: this.req.session.userId
    });

    if ( !user.isSuperAdmin ) {
       
      throw {redirect: '/mis-convenios'};

    }

    var convenios = await Convenio.find().sort('createdAt DESC');

     return {
       convenios: convenios
     };

  }


};
