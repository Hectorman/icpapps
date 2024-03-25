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

    if ( user.rolComisiones == 'Jefe Dpto' ) {

      if ( reqEstado == 'aprobadas' ) {

        var comisiones = await Comision.find().where({
            gerencia: user.registro[0].gerencia,
            departamento: user.registro[0].departamento,
            indexBandeja: 3
        }).sort('createdAt DESC');

      } else if ( reqEstado == 'rechazadas' ) {

        var comisiones = await Comision.find().where({
          gerencia: user.registro[0].gerencia,
          departamento: user.registro[0].departamento,
          rechazada: true
        }).sort('createdAt DESC');

      } else if ( reqEstado == 'pendientes' ) {

        var comisiones = await Comision.find().where({
            gerencia: user.registro[0].gerencia,
            departamento: user.registro[0].departamento,
            indexBandeja: { in : [1, 2] }
        }).sort('createdAt DESC');

      }

    }

    if ( user.rolComisiones == 'Gerente' ) {

      if ( reqEstado == 'aprobadas' ) {

        var comisiones = await Comision.find().where({
            gerencia: user.registro[0].gerencia,
            indexBandeja: 3
        }).sort('createdAt DESC');

      } else if ( reqEstado == 'rechazadas' ) {

        var comisiones = await Comision.find().where({
          gerencia: user.registro[0].gerencia,
          rechazada: true
        }).sort('createdAt DESC');

      } else if ( reqEstado == 'pendientes' ) {

        var comisiones = await Comision.find().where({
            gerencia: user.registro[0].gerencia,
            indexBandeja: 2
        }).sort('createdAt DESC');

      }

    }

    if ( user.rolComisiones == 'Director' ) {

      if ( reqEstado == 'aprobadas' ) {

        var comisiones = await Comision.find().where({
            indexBandeja: 3
        }).sort('createdAt DESC');

      } else if ( reqEstado == 'rechazadas' ) {

        var comisiones = await Comision.find().where({
          rechazada: true
        }).sort('createdAt DESC');

      } else if ( reqEstado == 'pendientes' ) {

        var comisiones = await Comision.find().where({
            indexBandeja: 2
        }).sort('createdAt DESC');

      }

    }

    if ( comisiones ) {

      for( var i = 0; i < comisiones.length; i++ ) {

        if ( !comisiones[i].urgente ) {

          var diasCreado = comisiones[i].createdAt / ( 1000 * 60 * 60 * 24 ),
              diasInicio = comisiones[i].fechaInicial / ( 1000 * 60 * 60 * 24 );

          if ( diasInicio - diasCreado < 8 ) comisiones[i].extemporanea = true;

        }  

      }

    }

    return exits.success( comisiones );

  }

};

