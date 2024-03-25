// api/helpers/getActivityStats.js
module.exports = {

  friendlyName: 'Get demo stats',


  description: 'Returns an object with demo totals.',


  inputs: {

    demo: {
      type: 'ref',
      description: 'Object of the demo',
      required: true
    }

  },


  fn: async function (inputs, exits) {
    
    var todayTimeStamp = Date.parse( new Date() ),
        avanceRealTotal = 0,
        secsAsignados = 0,
        secsTranscurridos = 0,
        cumplimientoAcumulativo = 0,
        counter = 0,
        diligenciadas = 0,
        validoCumplimiento = 0,
        result = false;

    if ( inputs.demo.actividades ) {

      for ( var j = 0; j < inputs.demo.actividades.length; j++ ) {

        var actividad = inputs.demo.actividades[j];

        if ( actividad.aplica && inputs.demo.areaImplementacion && actividad.fechaInicial && actividad.fechaFinal ) {

          var secsTranscurridosActividad = 0;

          if ( todayTimeStamp > actividad.fechaInicial && todayTimeStamp < actividad.fechaFinal ) {

            secsTranscurridosActividad = todayTimeStamp - actividad.fechaInicial;

          } else if ( todayTimeStamp > actividad.fechaFinal ) {

            secsTranscurridosActividad = actividad.fechaFinal - actividad.fechaInicial;

          }

          var secsAsignadosActividad = actividad.fechaFinal - actividad.fechaInicial;

          avanceRealTotal += actividad.avanceReal;

          counter ++;

          secsAsignados += secsAsignadosActividad;

          secsTranscurridos += secsTranscurridosActividad;

          if ( todayTimeStamp > actividad.fechaInicial ) {

            var porcentajeTranscurridoActividad = Math.floor( ( secsTranscurridosActividad / secsAsignadosActividad ) *100 );

            cumplimientoAcumulativo += ( actividad.avanceReal / porcentajeTranscurridoActividad ) * 100;
            
            validoCumplimiento++;

          }

        }

        //sails.log.info('notas' + actividad.notasAvance);

        if ( !actividad.aplica || ( actividad.fechaInicial && actividad.fechaFinal ) || actividad.sistemaPrueba || actividad.notasAvance || actividad.riesgosyAlertas ) {

          diligenciadas++;

        }

      }

      var result = {};

      var porcentajeTranscurrido = secsAsignados ? Math.floor( ( secsTranscurridos / secsAsignados ) *100 ) : 0,
          cumplimientoTotal = validoCumplimiento ? Math.floor( cumplimientoAcumulativo / validoCumplimiento ) : 0;
      
      

      result.avanceRealTotal = counter ? Math.floor( avanceRealTotal / counter ) : 0;
      result.riesgo = cumplimientoTotal <= 90 ? true : false;
      result.cumplimientoTotal = cumplimientoTotal;
      result.totalActividadesValidas = counter;
      result.porcentajeTranscurrido = porcentajeTranscurrido;

      sails.log.info( 'cumplimiento helper: ' + cumplimientoTotal );
      sails.log.info( 'riesgo helper: ' + result.riesgo );

      if ( cumplimientoTotal >= 100 ) {

        result.colorClass = 'green-graph';

      } else if ( cumplimientoTotal > 95 ) {

        result.colorClass = 'yellow-graph';

      } else if ( cumplimientoTotal > 90 ) {

        result.colorClass = 'orange-graph';

      } else {

        result.colorClass = 'red-graph';

      }

      result.totalActividadesDiligenciadas = diligenciadas;

    }

    return exits.success(result);
  }

};