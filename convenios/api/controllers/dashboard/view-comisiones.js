module.exports = {


  friendlyName: 'Comisiones',


  description: 'Página de bienvenida del director',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/comisiones',
      description: 'Muestra la página de inicio para directores.'
    },

  },


  fn: async function () {

    var params = {
          gerencia: this.req.param('gerencia').toUpperCase()
        },
        user = await User.findOne({
          id: this.req.session.userId
        }).populate('registro');

    if ( user.isGerente ) params.aprobadoGerente = 'pendiente';

    if ( user.isDirector ) {

      params.aprobadoGerente = 'aprobado';

      params.aprobadoDirector = 'pendiente';

    }

    var comisiones = await Comision.find( params );

    for( var i = 0; i < comisiones.length; i++ ) {

      if ( !comisiones[i].urgente ) {

        var diasCreado = comisiones[i].createdAt / ( 1000 * 60 * 60 * 24 ),
            diasInicio = comisiones[i].fechaInicial / ( 1000 * 60 * 60 * 24 );

        if ( diasInicio - diasCreado < 8 ) comisiones[i].extemporanea = true;
      
      }  
    
    }

    return {
      comisiones: comisiones,
      gerencia: this.req.param('gerencia').toUpperCase(),
      populatedUser: user
    };

  }


};
