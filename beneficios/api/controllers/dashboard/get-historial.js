module.exports = {


  friendlyName: 'Historial',


  description: 'Muestra las comisiones ya diligenciadas',

  inputs: {

    param: {
      type: 'string'
    }

  },

  exits: {

    success: {
      description: 'Lista de comisiones devuelta'
    },

  },


  fn: async function (inputs, exits) {

    var params = {},
        reqEstado = inputs.param,
        user = await User.findOne({
          id: this.req.session.userId
        }).populate('registro');

    if ( user.isGerente ) {

      if ( reqEstado == 'aprobadas' ) {

        var comisiones = await Comision.find().where({
          gerencia: user.registro[0].gerencia,
          aprobadoDirector: 'aprobado'
        }).sort('createdAt DESC');

      } else if ( reqEstado == 'rechazadas' ) {

        var comisiones = await Comision.find().where({
          or: [
            {
              gerencia: user.registro[0].gerencia,
              aprobadoGerente: 'rechazado'
            },
            {
              gerencia: user.registro[0].gerencia,
              aprobadoGerente: 'aprobado',
              aprobadoDirector: 'rechazado'
            }
          ]
        }).sort('createdAt DESC');

      } else if ( reqEstado == 'pendientes' ) {

        var comisiones = await Comision.find().where({
          gerencia: user.registro[0].gerencia,
          aprobadoDirector: 'pendiente',
          aprobadoGerente: 'aprobado'
        }).sort('createdAt DESC');

      }

    } else if ( user.isDirector ) {

      if ( reqEstado == 'aprobadas' ) {

        var comisiones = await Comision.find().where({
          aprobadoDirector: 'aprobado'
        }).sort('createdAt DESC');

      } else if ( reqEstado == 'rechazadas' ) {

        var comisiones = await Comision.find().where({
          or: [
            {aprobadoGerente: 'rechazado'},
            {aprobadoDirector: 'rechazado'}
          ]
        }).sort('createdAt DESC');

      }

    }

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
