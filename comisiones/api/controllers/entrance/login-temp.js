module.exports = {


    friendlyName: 'Login',
  
  
    description: 'Log in using the provided email and password combination.',
  
  
    extendedDescription:
  `This action attempts to look up the user record in the database with the
  specified email address.  Then, if such a user exists, it uses
  bcrypt to compare the hashed password from the database with the provided
  password attempt.`,
  
  
    inputs: {
      registro: {
        type: 'string',
        required: true
      },
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
  
    },
  
  
    exits: {
  
      success: {
        description: 'The requesting user agent has been successfully logged in.'
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
  
      sails.log(inputs.registro);
  
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
  
             // Hash the new password.
             var hashed = await sails.helpers.passwords.hashPassword(inputs.password);
  
             // Store the user's new password and clear their reset token so it can't be used again.
             await User.updateOne({ id: userRegistro.owner.id })
             .set({
               password: hashed
             });
  
             // Store the user's new id in their session.
             this.req.session.userId = userRegistro.owner.id;
  
             return exits.success(userRegistro.owner);
  
           } else {
  
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
  
           }
  
       // existing user log in
       } else {
  
          //If the password doesn't match, then also exit thru "badCombo".
          await sails.helpers.passwords.checkPassword(inputs.password, userRegistro.owner.password)
          .intercept('incorrect', 'badCombo');
  
          this.req.session.userId = userRegistro.owner.id;
  
          sails.log(this.req.session.userId);
  
          return exits.success(userRegistro.owner);
  
       }
  
     } else {
  
       if ( userRegistro.owner && userRegistro.owner.password !== 'cambio pendiente' ) {
  
          return exits.success( 'pedirPassword' );
  
       } else {
  
          return exits.success( 'crearPassword' );
  
       }
  
     }
  
    }
  
  };
  