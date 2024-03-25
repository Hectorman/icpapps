module.exports = {

   friendlyName: 'Crear Usuario',

   description: 'Crea un nuevo usuario',

   inputs: {

      registro: {
        type: 'string'
      },

      fullName: {
        type: 'string'
      },

      emailAddress: {
        type: 'string'
      },

      gerencia: {
        type: 'string'
      },

      departamento: {
        type: 'string'
      }

   },
   exits: {

      success: {
         description: 'Usuario creado exitósamente',
      }

   },

   fn: async function (inputs, exits) {

      var newUser = await Planta.create({
         registro: inputs.registro,
         fullName: inputs.fullName,
         emailAddress: inputs.emailAddress,
         gerencia: inputs.gerencia,
         departamento: inputs.departamento
      }).fetch();

      return exits.success( newUser );

   }

};

