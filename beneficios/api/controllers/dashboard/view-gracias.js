module.exports = {

  friendlyName: 'Gracias',


  description: 'Mensaje que se muestra al terminar de subir la comisión',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/gracias',
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

    var params = {}

    if ( !user.isSuperAdmin ) params.owner = this.req.session.userId;

    var convenios = await Convenio.find().where( params ).sort('createdAt DESC');

    if ( !convenios.length ) {

      throw {redirect: '/nuevo-beneficio'};

    }

     return {
       convenios: convenios
     };

  }


};
