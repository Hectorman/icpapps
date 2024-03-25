/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"updateProfile":{"verb":"PUT","url":"/api/v1/account/update-profile","args":["fullName","emailAddress"]},"updateComision":{"verb":"PUT","url":"/api/v1/account/update-comision","args":["idComision","action"]},"updateBillingCard":{"verb":"PUT","url":"/api/v1/account/update-billing-card","args":["stripeToken","billingCardLast4","billingCardBrand","billingCardExpMonth","billingCardExpYear"]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["password","confirmPassword","registro"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","password","fullName"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"deliverContactFormMessage":{"verb":"POST","url":"/api/v1/deliver-contact-form-message","args":["emailAddress","topic","fullName","message"]},"crearConvenio":{"verb":"POST","url":"/api/v1/dashboard/crear-convenio","args":["titulo","campos"]},"confirmProfile":{"verb":"PUT","url":"/api/v1/account/confirm-profile","args":["celular"]},"getHistorial":{"verb":"POST","url":"/api/v1/dashboard/get-historial","args":["param"]},"getComisiones":{"verb":"POST","url":"/api/v1/dashboard/get-comisiones","args":["param"]},"updateUsuario":{"verb":"PUT","url":"/api/v1/dashboard/update-usuario","args":["id","gerencia","isGerente","isDirector"]},"updateConvenio":{"verb":"PUT","url":"/api/v1/dashboard/update-convenio","args":["id","propiedad"]}}
  /* eslint-enable */

});
