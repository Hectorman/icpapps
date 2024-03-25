module.exports = {

  friendlyName: 'Crear Beneficio',

  description: 'Crea un nuevo beneficio',

  inputs: {

    titulo: {
      type: 'string'
    }

  },
  exits: {

    success: {
      description: 'Beneficio creado exitósamente',
    }

  },

  fn: async function (inputs, exits) {

      var userId = this.req.session.userId;

      var newBeneficio = await Beneficio.create({
         owner: userId,
         titulo: inputs.titulo,
         estado: 'funcionario asignado',
         asignadoA: userId
      }).fetch();

      return exits.success(newBeneficio.id);

  }

};

