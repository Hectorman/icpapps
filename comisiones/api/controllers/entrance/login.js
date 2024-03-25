module.exports = {


  friendlyName: 'Login',


  description: 'Log in using the provided email and password combination.',


  extendedDescription:
`This action attempts to look up the user record in the database with the
specified email address.  Then, if such a user exists, it uses
bcrypt to compare the hashed password from the database with the provided
password attempt.`,


  inputs: {

    password: {
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      maxLength: 200
      // required: true
    },
    confirmPassword: {
      description: 'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      // required: true
    },
//
//     rememberMe: {
//       description: 'Whether to extend the lifetime of the user\'s session.',
//       extendedDescription:
// `Note that this is NOT SUPPORTED when using virtual requests (e.g. sending
// requests over WebSockets instead of HTTP).`,
//       type: 'boolean'
//     }

    registro: {
      type: 'string',
      required: true
    },

    passwordResetToken: {
      type: 'string'
    }

  },


  exits: {

    success: {
      description: 'The requesting user agent has been successfully logged in.',
      extendedDescription:
`Under the covers, this stores the id of the logged-in user in the session
as the \`userId\` key.  The next time this user agent sends a request, assuming
it includes a cookie (like a web browser), Sails will automatically make this
user id available as req.session.userId in the corresponding action.  (Also note
that, thanks to the included "custom" hook, when a relevant request is received
from a logged-in user, that user's entire record from the database will be fetched
and exposed as \`req.me\`.)`
    },

    badCombo: {
      description: 'ID and password doesnt match',
      responseType: 'unauthorized'
    },

    noRegistro: {
      description: 'El ID ingresado no existe en la base de datos.',
      responseType: 'unauthorized'
    },

    crearPassword: {
      description: 'Crear contraseña'
    },

    pedirPassword: {
     description: 'Pedir contraseña'
    },

    crearPasswordToken: {
      description: 'Pedir contraseña con token'
    },

    invalidToken: {
      description: 'Token inválido'
    },

   confirmarPassword: {
     description: 'Las contraseñas no coinciden'
   }

  },

  fn: async function (inputs, exits) {

    sails.log('entra al login');

    // buscamos el usuario en el modelo planta por el registro
    var userRegistro = await Planta.findOne({
       registro: inputs.registro
    }).populate('owner');

    // Si no existe devolvemos la salida noRegistro
    if(!userRegistro) {
      throw 'noRegistro';
    }

    // si el usuario digita contraseña
    if ( inputs.password ) {

      // new user register
      if ( inputs.confirmPassword ) {

          //If the password doesn't match, then also exit thru "confirmPassword".
          if (inputs.password !== inputs.confirmPassword ) {
            throw 'confirmarPassword';
          }

          if ( userRegistro.owner ) {

            if ( inputs.passwordResetToken && inputs.passwordResetToken != userRegistro.owner.passwordResetToken ) {

              throw 'invalidToken';

            }

            // Hash the new password.
            var hashed = await sails.helpers.passwords.hashPassword(inputs.password);

            // Store the user's new password and clear their reset token so it can't be used again.
            await User.updateOne({ id: userRegistro.owner.id })
            .set({
              password: hashed,
              passwordResetToken: ''
            });

            // Store the user's new id in their session.
            this.req.session.userId = userRegistro.owner.id;

            return exits.success(userRegistro.owner);

          } else {

            var newUserRecord = await User.create({
              emailAddress: userRegistro.emailAddress,
              password: await sails.helpers.passwords.hashPassword(inputs.password),
              fullName: userRegistro.fullName,
              gerencia: userRegistro.gerencia,
              departamento: userRegistro.departamento,
              rolComisiones: userRegistro.rolComisiones,
              rolBeneficios: userRegistro.rolBeneficios,
              rolConvenios: userRegistro.rolConvenios,
              rolDemostraciones: userRegistro.rolDemostraciones,
              isAdmin: userRegistro.isAdmin,
              isSuperAdmin: userRegistro.isSuperAdmin,
            }).fetch();

            await User.addToCollection(newUserRecord.id, 'registro').members([userRegistro.id]);

            // Store the user's new id in their session.
            this.req.session.userId = newUserRecord.id;

            return exits.success(newUserRecord);

          }

      // existing user log in
      } else {

        //If the password doesn't match, then also exit thru "badCombo".
        await sails.helpers.passwords.checkPassword(inputs.password, userRegistro.owner.password)
        .intercept('incorrect', 'badCombo');

        this.req.session.userId = userRegistro.owner.id;
         
        return exits.success(userRegistro.owner);

      }

    } else {

      if ( userRegistro.owner && userRegistro.owner.password !== 'cambio pendiente' ) {

         throw 'pedirPassword';

      } else {

        if ( userRegistro.owner && userRegistro.owner.passwordResetToken ) {

          throw 'crearPasswordToken';

        } else {

          throw 'crearPassword';

        }

      }

    }

  }

};
