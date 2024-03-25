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
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"updateProfile":{"verb":"PUT","url":"/api/v1/account/update-profile","args":["celular"]},"confirmProfile":{"verb":"PUT","url":"/api/v1/account/confirm-profile","args":["celular"]},"updateBillingCard":{"verb":"PUT","url":"/api/v1/account/update-billing-card","args":["stripeToken","billingCardLast4","billingCardBrand","billingCardExpMonth","billingCardExpYear"]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["password","confirmPassword","registro"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","password","fullName"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"deliverContactFormMessage":{"verb":"POST","url":"/api/v1/deliver-contact-form-message","args":["emailAddress","topic","fullName","message"]},"crearDemostracion":{"verb":"POST","url":"/api/v1/dashboard/crear-demostracion","args":["nombre"]},"detallesDemostracion":{"verb":"PUT","url":"/api/v1/account/detalles-demostracion","args":["id","nombreLider","nombreJefe","gerencia","departamento","areaImplementacion"]},"modeloDesarrollo":{"verb":"PUT","url":"/api/v1/account/modelo-desarrollo","args":["id","modelo","nombreAliado"]},"nivelMadurez":{"verb":"PUT","url":"/api/v1/account/nivel-madurez","args":["id","nivel"]},"agregarIntegrante":{"verb":"POST","url":"/api/v1/dashboard/agregar-integrante","args":["nombre","idDemo","idIntegrante"]},"crearExperimento":{"verb":"POST","url":"/api/v1/dashboard/crear-experimento","args":["nombre","fechaInicial","fechaFinal","idActividad"]},"crearNota":{"verb":"POST","url":"/api/v1/dashboard/crear-nota","args":["nota","idExperimento"]},"crearAvance":{"verb":"POST","url":"/api/v1/dashboard/crear-avance","args":["avance","idActividad","idLider"]},"getActivity":{"verb":"POST","url":"/api/v1/dashboard/get-activity","args":["idDemo","ordenActividad"]},"nombresPlanta":{"verb":"POST","url":"/api/v1/dashboard/nombres-planta","args":[]},"actualizarActividad":{"verb":"POST","url":"/api/v1/dashboard/actualizar-actividad","args":["nombreActividad","idDemo","ordenActividad","idActividad","sistemaPrueba","aplica","descripcion","fechaInicial","fechaFinal","avanceReal","observaciones","ayudaPaLoQueViene","ponerseAlDia","notasAvance","riesgosyAlertas"]},"borrarIntegrante":{"verb":"POST","url":"/api/v1/dashboard/borrar-integrante","args":["id"]},"borrarExperimento":{"verb":"PUT","url":"/api/v1/dashboard/borrar-experimento","args":["id"]}}
  /* eslint-enable */

});
