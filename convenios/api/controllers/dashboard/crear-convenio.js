module.exports = {

  friendlyName: 'Crear Convenio',

  description: 'Crea un nuevo convenio',

  inputs: {

    titulo: {
      type: 'string'
    },

    campos: {
       type: 'json'
    }

  },
  exits: {

    success: {
      description: 'Convenio creado exitósamente',
    }

  },

  fn: async function (inputs, exits) {

   var userId = this.req.session.userId;

   var userRegistro = await User.findOne({
        id: userId
   }).populate('registro');

    var newConvenio = await Convenio.create({
        owner: userId,
        titulo: inputs.titulo,
        campos: inputs.campos,
        gerencia: userRegistro.registro[0].gerencia
     }).fetch();

     return exits.success(newConvenio.id);

  }

};

