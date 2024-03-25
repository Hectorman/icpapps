module.exports = {

  friendlyName: 'Historial',

  description: 'Muestra las comisiones ya diligenciadas',

  exits: {

    success: {

      viewTemplatePath: 'pages/dashboard/historial',

      description: 'Muestra la página de inicio para directores.'

    },

  },

  fn: async function () {

    var params = {},
        reqEstado = this.req.param('estado'),
        user = await User.findOne({
          id: this.req.session.userId
        });

    if ( user.isGerente ) {

      if ( reqEstado == 'aprobadas' ) {

        var comisiones = await Comision.find().where({

          gerencia: user.gerencia,

          aprobadoDirector: 'aprobado'

        }).sort('createdAt DESC');

      } else if ( reqEstado == 'rechazadas' ) {

        var comisiones = await Comision.find().where({
          or: [
            {
              gerencia: user.gerencia,
              aprobadoGerente: 'rechazado'
            },
            {
              gerencia: user.gerencia,
              aprobadoGerente: 'aprobado',
              aprobadoDirector: 'rechazado'
            }
          ]
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

    return {

      comisiones: comisiones,
      estado: this.req.param('estado')

    };

  }

};

