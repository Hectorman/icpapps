module.exports = {


  friendlyName: 'Crear Demostración',


  description: 'Crea una nueva demostracion tomando el nombre',

  inputs: {

    nombre: {
      type: 'string',
      required: true
    }

  },

  exits: {

    success: {
      description: 'Demostración creada exitósamente',
    }

  },

  fn: async function (inputs, exits) {

    var userRegistro = await User.findOne({
        id: this.req.session.userId
    }).populate('registro');

     var newDemo = await Demo.create({
        nombre: inputs.nombre,
        lider: this.req.session.userId,
        nombreLider: userRegistro.fullName,
        gerencia: userRegistro.registro[0].gerencia,
        departamento: userRegistro.registro[0].departamento
     }).fetch();

     return exits.success(newDemo.id);

  }

};
