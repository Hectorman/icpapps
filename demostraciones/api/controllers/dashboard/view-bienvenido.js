module.exports = {


  friendlyName: 'Bienvenido',


  description: 'Página de bienvenida del director',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/bienvenido',
      description: 'Muestra la página de inicio para directores.'
    },

  },


  fn: async function () {

    if ( !this.req.me.isSuperAdmin ) {
      throw {redirect: '/demostraciones'};
    }

    var actividades = await Actividad.find(),
        demos = await Demo.find().populate('actividades'),
        avanceRealTotal = 0,
        tiempoTranscurrido = 0,
        cumplimientoTotal = 0,
        streams = {
          UP: {
            avanceReal: 0,
            totalActividadesValidas: 0,
            demoCounter: 0,
            cumplimientoTotal: 0
          },
          MID: {
            avanceReal: 0,
            totalActividadesValidas: 0,
            demoCounter: 0,
            cumplimientoTotal: 0
          },
          DOWN: {
            avanceReal: 0,
            totalActividadesValidas: 0,
            demoCounter: 0,
            cumplimientoTotal: 0
          }
        };

    for ( var i = 0; i < demos.length; i++ ) {

      if ( demos[i].areaImplementacion ) {

        var demoTotals = await sails.helpers.getDemoStats( demos[i] );

        sails.log.info( 'demoTotals: ' +  demoTotals );

        if ( demoTotals ) {

          streams[ demos[i].areaImplementacion ].avanceReal += demoTotals.avanceRealTotal ;

          streams[ demos[i].areaImplementacion ].totalActividadesValidas += demoTotals.totalActividadesValidas;

          streams[ demos[i].areaImplementacion ].demoCounter++;

          cumplimientoTotal += demoTotals.cumplimientoTotal;

          sails.log.info( 'avance real demo: ' +  demoTotals.avanceRealTotal );

          tiempoTranscurrido += demoTotals.porcentajeTranscurrido;

          avanceRealTotal += demoTotals.avanceRealTotal;

        }

      }
      
    }

    var totalActividadesCounter = streams.UP.totalActividadesValidas + streams.MID.totalActividadesValidas + streams.DOWN.totalActividadesValidas,
        totalDemoCounter = streams.UP.demoCounter + streams.MID.demoCounter + streams.DOWN.demoCounter,
        avanceRealTotalPercent = totalDemoCounter ? Math.floor( avanceRealTotal / totalDemoCounter ) : 0,
        porcentajeTranscurrido = totalDemoCounter ? Math.floor( tiempoTranscurrido / totalDemoCounter ) : 0;

    var avanceUp = streams.UP.demoCounter ? streams.UP.avanceReal / streams.UP.demoCounter : 0,
        avanceMid = streams.MID.demoCounter ? streams.MID.avanceReal / streams.MID.demoCounter : 0,
        avanceDown = streams.DOWN.demoCounter ? streams.DOWN.avanceReal / streams.DOWN.demoCounter : 0;

    return {
      actividades: actividades,
      actividadesAplican: totalActividadesCounter,
      avanceRealTotalPercent: avanceRealTotalPercent,
      porcentajeTranscurrido: porcentajeTranscurrido,
      cumplimientoTotal: totalDemoCounter ? Math.floor( cumplimientoTotal / totalDemoCounter ) : 0,
      avanceUp: avanceUp,
      avanceMid: avanceMid,
      avanceDown: avanceDown
    };

  }


};
