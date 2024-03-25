module.exports = {

  friendlyName: 'Actualiza un beneficio',

  description: 'actualiza un beneficio',

  inputs: {

   id: {
      type: 'number',
      required: true
   },

   asignadoA: {
      type: 'number'
   },

   estado: {
      type: 'string'
   },

   objetivoGeneral: {
      type: 'string'
   },

   objetivosEspecificos: {
      type: 'string'
   },

   tipologia: {
      type: 'string'
   },

   investigacion: {
      type: 'string'
   },

   innovacion: {
      type: 'string'
   },

   desarrollo: {
      type: 'string'
   },

   lider: {
      type: 'string'
   },

   valorVigencias: {
      type: 'json'
   },

   archivoUno: {
      type: 'json'
   },

   filenameUno: {
      type: 'string'
   },

   fechaUno: {
      type: 'string'
   },

   archivoDos: {
      type: 'json'
   },

   filenameDos: {
      type: 'string'
   },

   fechaDos: {
      type: 'string'
   },

   aprobadoGerencia: {
      type: 'boolean'
   },

   aprobadoComite: {
      type: 'boolean'
   },

   aprobadoFinalAutoridad: {
      type: 'boolean'
   },

   aprobadoFinalGerente: {
      type: 'boolean'
   },

   aprobadoFinalDirector: {
      type: 'boolean'
   },

   aprobadoFinalComite: {
      type: 'boolean'
   },

   aprobadoFinal: {
      type: 'boolean'
   },

   observaciones: {
      type: 'string'
   }

  },
  exits: {

    success: {
      description: 'Beneficio actualizado exitósamente',
    }

  },

  fn: async function (inputs, exits) {

      var beneficio = await Beneficio.updateOne({id: inputs.id })
      .set({
         asignadoA: inputs.asignadoA,
         estado: inputs.estado,
         objetivoGeneral: inputs.objetivoGeneral,
         objetivosEspecificos: inputs.objetivosEspecificos,
         tipologia: inputs.tipologia,
         investigacion: inputs.investigacion,
         innovacion: inputs.innovacion,
         desarrollo: inputs.desarrollo,
         lider: inputs.lider,
         valorVigencias: JSON.stringify( inputs.valorVigencias ),
         archivoUno: JSON.stringify( inputs.archivoUno ),
         filenameUno: inputs.filenameUno,
         fechaUno: inputs.fechaUno,
         archivoDos: JSON.stringify( inputs.archivoDos ),
         filenameDos: inputs.filenameDos,
         fechaDos: inputs.fechaDos,
         aprobadoGerencia: inputs.aprobadoGerencia,
         aprobadoComite: inputs.aprobadoComite,
         aprobadoFinalAutoridad: inputs.aprobadoFinalAutoridad,
         aprobadoFinalGerente: inputs.aprobadoFinalGerente,
         aprobadoFinalDirector: inputs.aprobadoFinalDirector,
         aprobadoFinalComite: inputs.aprobadoFinalComite,
         aprobadoFinal: inputs.aprobadoFinal,
         observaciones: inputs.observaciones
      });

      if ( inputs.asignadoA ) {

         var funcionario = await Planta.findOne({
            id: inputs.asignadoA
         });  

         beneficio.nombreFuncionario = funcionario.fullName;

      }

      return exits.success( beneficio );

  }

};

