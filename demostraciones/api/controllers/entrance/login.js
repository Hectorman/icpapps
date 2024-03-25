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

   confirmarPassword: {
     description: 'Las contraseñas no coinciden'
   }

  },

  fn: async function (inputs, exits) {

    //buscamos el usuario en el modelo planta por el registro
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

          var newUserRecord = await User.create({
            emailAddress: userRegistro.emailAddress,
            password: await sails.helpers.passwords.hashPassword(inputs.password),
            fullName: userRegistro.fullName,
            isSuperAdmin: userRegistro.isSuperAdmin,
            isDirector: userRegistro.isDirector,
            isGerente: userRegistro.isGerente
          }).fetch();

          await User.addToCollection(newUserRecord.id, 'registro').members([userRegistro.id]);

          // Store the user's new id in their session.
          this.req.session.userId = newUserRecord.id;

          return exits.success(newUserRecord);

      // existing user log in
      } else {

         //If the password doesn't match, then also exit thru "badCombo".
         await sails.helpers.passwords.checkPassword(inputs.password, userRegistro.owner.password)
         .intercept('incorrect', 'badCombo');

         this.req.session.userId = userRegistro.owner.id;

         return exits.success(userRegistro.owner);

      }

    } else {

      if ( userRegistro.owner ) {

         throw 'pedirPassword';

      } else {

         throw 'crearPassword';

      }

    }

  }

};
