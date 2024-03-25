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
          gerencia: inputs.param.toUpperCase(),
          rechazada: false
        },
        user = await User.findOne({
          id: this.req.session.userId
        }).populate('registro');

        switch (user.rolComisiones) {
          case 'Jefe Dpto':
  
            params.indexBandeja = 0;
            
            break;
          case 'Gerente':
  
            params.indexBandeja = 1;
              
            break;
  
          case 'Director':
  
            params.indexBandeja = 2;
              
            break;
  
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

