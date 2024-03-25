module.exports = {


  friendlyName: 'Comisiones',


  description: 'Muestra las comisiones a aprobar o rechazar',

  inputs: {

    param: {
      type: 'string'
    }

  },

  exits: {

    success: {
      description: 'Comisiones mostradas.'
    },

  },


  fn: async function ( inputs, exits) {

    var params = {
          gerencia: inputs.param.toUpperCase()
        },
        user = await User.findOne({
          id: this.req.session.userId
        }).populate('registro');

    if ( user.isGerente ) params.aprobadoGerente = 'pendiente';

    if ( user.isDirector ) {

      params.aprobadoGerente = 'aprobado';

      params.aprobadoDirector = 'pendiente';

    }

    var comisiones = await Comision.find( params ).sort('createdAt DESC');

    for( var i = 0; i < comisiones.length; i++ ) {

      if ( !comisiones[i].urgente ) {

        var diasCreado = comisiones[i].createdAt / ( 1000 * 60 * 60 * 24 ),
            diasInicio = comisiones[i].fechaInicial / ( 1000 * 60 * 60 * 24 );

        if ( diasInicio - diasCreado < 8 ) comisiones[i].extemporanea = true;
      
      }  
    
    }

    return exits.success( comisiones );

  }


};
