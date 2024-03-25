module.exports = {

  friendlyName: 'Consulta una actividad',

  description: 'Devuelve una actividad o falso',

  inputs: {

    idDemo: {
      type: 'string',
      required: true
    },

    ordenActividad: {
      type: 'number',
      required: true
    }

  },

  exits: {

    success: {
      description: 'La actividad existe',
    },

    noActividad: {
      description: 'Sin datos de la actividad'
    },

  },

  fn: async function (inputs, exits) {

    var nestedPop = require('nested-pop');
 
    var activity = await Actividad.findOne({
       owner: inputs.idDemo,
       orden: inputs.ordenActividad
    }).populate('experimentos').populate('avances');

    // Si no existe devolvemos la salida noRegistro
    if(!activity) {
      return exits.success( 'no existe' );
    }

    if ( activity.experimentos ) {

      var expActivity = await Actividad.findOne({
        owner: inputs.idDemo,
        orden: inputs.ordenActividad
      }).populate('experimentos').populate('avances')
      .then(function(actividad) {
    
          return nestedPop(actividad, {
              experimentos: [
                  'notas'
              ]
          }).then(function(actividad) {
              return actividad
          }).catch(function(err) {
              throw err;
          });
          
      }).catch(function(err) {
          throw err;
      });

      return exits.success( expActivity );

    }

    return exits.success( activity );

  }

};
