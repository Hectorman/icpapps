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

    var comisiones = await Comision.find().where({
      owner: this.req.session.userId
    }).sort('createdAt DESC');

    if ( !comisiones.length ) {

      throw {redirect: '/nueva-comision'};

    }

     return {
       comisiones: comisiones
     };

  }


};
