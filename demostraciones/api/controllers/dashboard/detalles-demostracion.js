module.exports = {


  friendlyName: 'Actualizar detalles demostración',


  description: 'Confirm the profile for the logged-in user.',


  inputs: {

    id: {
       type: 'number',
       required: true
    },

    nombreLider: {
      type: 'string',
      required: true
    },

    nombreJefe: {
       type: 'string',
       required: true
    },

    gerencia: {
        type: 'string',
        required: true
     },

     departamento: {
        type: 'string',
        required: true
     },

     areaImplementacion: {
        type: 'string',
        required: true
     },

  },


  exits: {



  },


  fn: async function (inputs) {

    await Demo.updateOne({id: inputs.id })
    .set({
      nombreLider: inputs.nombreLider,
      nombreJefe: inputs.nombreJefe,
      gerencia: inputs.gerencia,
      departamento: inputs.departamento,
      areaImplementacion: inputs.areaImplementacion 
    });

  }

};
