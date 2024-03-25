module.exports = {

  friendlyName: 'Actualizar Actividad',

  description: 'Actualizar actividad de demostración',

  inputs: {

    nombreActividad: {
       type: 'string'
    },  

    idDemo: {
       type: 'number',
       required: true
    },

    ordenActividad: {
       type: 'number'
    },

    idActividad: {
      type: 'number'
    },

    sistemaPrueba: {
      type: 'string'
    },

    aplica: {
       type: 'boolean'
    },

    descripcion: {
       type: 'string'
    },

    fechaInicial: {
      type: 'string'
    },

    fechaFinal: {
      type: 'string'
    },

    avanceReal: {
      type: 'number'
    },

    observaciones: {
      type: 'string'
    },

    ayudaPaLoQueViene: {
      type: 'string'
    },

    ponerseAlDia: {
      type: 'string'
    },

    notasAvance: {
      type: 'string'
    },

    riesgosyAlertas: {
      type: 'string'
    }

  },

  exits: {

    success: {
      description: 'Actividad creada o actualizada exitósamente',
    }

  },

  fn: async function (inputs, exits) {

    if ( inputs.idActividad ) {

        var updateData = {};

        updateData.sistemaPrueba = inputs.sistemaPrueba;

        updateData.aplica = inputs.aplica;

        updateData.descripcion = inputs.descripcion;

        if ( inputs.fechaInicial ) {

          updateData.fechaInicial = Date.parse( inputs.fechaInicial.replace(new RegExp('/', 'g'), ',') );
          
        }

        if ( inputs.fechaFinal ) {

          updateData.fechaFinal = Date.parse( inputs.fechaFinal.replace(new RegExp('/', 'g'), ',') );
          
        }

        updateData.avanceReal = inputs.avanceReal;

        updateData.observaciones = inputs.observaciones;

        updateData.ayudaPaLoQueViene = inputs.ayudaPaLoQueViene;

        updateData.ponerseAlDia = inputs.ponerseAlDia;

        updateData.notasAvance = inputs.notasAvance;

        updateData.riesgosyAlertas = inputs.riesgosyAlertas;

        sails.log.info( updateData );

        await Actividad.updateOne({ id: inputs.idActividad }).set( updateData );

        var nestedPop = require('nested-pop');
        
        var existentActividad = await Actividad.findOne({
          id: inputs.idActividad
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

        return exits.success( existentActividad );

    } else {

        var createData = {
          nombre: inputs.nombreActividad,
          owner: inputs.idDemo,
          orden: inputs.ordenActividad
        };

        createData.aplica = inputs.aplica;

        if ( inputs.sistemaPrueba ) createData.sistemaPrueba = inputs.sistemaPrueba;

        if ( inputs.notasAvance ) createData.notasAvance = inputs.notasAvance;

        if ( inputs.riesgosyAlertas ) createData.riesgosyAlertas = inputs.riesgosyAlertas;

        if ( inputs.descripcion ) createData.descripcion = inputs.descripcion; 
        
        var newActivity = await Actividad.create( createData ).fetch();

        return exits.success( newActivity );

    }

  }

};
