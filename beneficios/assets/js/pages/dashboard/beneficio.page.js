parasails.registerPage('beneficio', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    formStep: 0,

    // Form data
    formData: { /* … */ },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // Server error state for the form
    cloudError: '',

    estadoTemp: false,

    contenidoInicial: [
      {
         nombre: 'Objetivo General',
         campo: 'objetivoGeneral'
      },
      {
         nombre: 'Objetivos Específicos',
         campo: 'objetivosEspecificos'
      },
      {
         nombre: 'Tipología del proyecto',
         campo: 'tipologia'
      },
      {
         nombre: 'Líder del Proyecto',
         campo: 'lider'
      },
      {
         nombre: 'Valor Vigencias',
         campo: 'valorVigencias'
      },
      {
         nombre: 'Revisión Autoridad Técnica',
         campo: 'aprobadoGerencia'
      },
      {
         nombre: 'Revisión Comité',
         campo: 'aprobadoComite'
      },
      {
         nombre: 'GTN-F-018 Formato Guía para Postular Proyectos a Obtener Beneficios',
         campo: 'archivoUno'
      },
      {
         nombre: 'GTN-F-020 Formato Guía para Presupuesto del Proyecto a Obtener Beneficios Tributarios',
         campo: 'archivoDos'
      },
      {
         nombre: 'Aprobación final',
         campo: 'aprobadoFinal'
      },
   ]

   },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach raw data exposed by the server.
    _.extend(this, SAILS_LOCALS);
    document.body.classList.add('beforeMount');
    document.body.classList.add('nueva-comision-wrapper');

    moment.locale('es');

    if ( this.beneficio.valorVigencias ) this.beneficio.valorVigencias = JSON.parse( this.beneficio.valorVigencias );
    if ( this.beneficio.archivoUno ) this.beneficio.archivoUno = JSON.parse( this.beneficio.archivoUno );
    if ( this.beneficio.archivoDos ) this.beneficio.archivoDos = JSON.parse( this.beneficio.archivoDos );


   },
   mounted: async function() {
      document.body.classList.add('mounted');
      console.log( this.beneficio );
      console.log( this.me );

      var vueObj = this;

      $('.autocomplete-nombre').autocomplete({
         lookup: function (query, done) {

            var result = vueObj.dataLookup.suggestions.filter(function( item ){

               return item.value.toLowerCase().indexOf( query.toLowerCase() ) > -1;

            });

            done({
               suggestions : result
            });
         },
         onSelect: function (suggestion) {
            console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);

            vueObj.formData.asignadoA = suggestion.data;
         },
         autoSelectFirst: true
      });

   },

   //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
   //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
   //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
   methods: {

      fechaFromNow: function( date ) {

         return moment( date ).fromNow();
   
      },

      submittedForm: async function( data ) {
         // Redirect to the account page on success.
         // > (Note that we re-enable the syncing state here.  This is on purpose--
         // > to make sure the spinner stays there until the page navigation finishes.)

         this.beneficio = cloudResult;
         if ( this.beneficio.valorVigencias ) this.beneficio.valorVigencias = JSON.parse( this.beneficio.valorVigencias );
         if ( this.beneficio.archivoUno ) this.beneficio.archivoUno = JSON.parse( this.beneficio.archivoUno );
         if ( this.beneficio.archivoDos ) this.beneficio.archivoDos = JSON.parse( this.beneficio.archivoDos );
         if ( cloudResult.nombreFuncionario ) this.nombreFuncionario = cloudResult.nombreFuncionario;

      },

      handleParsingForm: function() {

         this.formErrors = {};

         var argins = this.formData,
            errors = 0;

         if ( !this.formData.asignadoA ) {

            this.formErrors.asignadoA = true;
            errors++;

         }

         this.formData.estado = this.estadoTemp || 'pendiente de aprobación gerencia';
         this.formData.id = this.beneficio.id;

         if ( errors ) return false;

         return argins;
      },

      handleGerenciaForm: function() {

         this.formErrors = {};

         var argins = this.formData,
             errors = 0;

         this.formData.estado = 'pendiente de aprobación comité';
         this.formData.id = this.beneficio.id;
         this.formData.aprobadoGerencia = true;

         if ( errors ) return false;

         return argins;

      },

      handleComiteForm: function() {

         this.formErrors = {};

         var argins = this.formData,
             errors = 0;

         this.formData.estado = 'pendiente adjuntar formatos';
         this.formData.id = this.beneficio.id;
         this.formData.aprobadoComite = true;

         if ( errors ) return false;

         return argins;

      },

      handleFinalForm: function() {

         this.formErrors = {};

         var argins = this.formData,
             errors = 0;

         this.formData.id = this.beneficio.id;

         switch ( this.me.rolBeneficios ) {
            case 'Autoridad Técnica':
               
               this.formData.aprobadoFinalAutoridad = true;

               break;
            
            case 'Gerente':
               
               this.formData.aprobadoFinalGerente = true;

               break;

            case 'Director':
               
               this.formData.aprobadoFinalDirector = true;

               break;

            case 'Líder Comité Expertos':
               
               this.formData.aprobadoFinalComite = true;

               break;
         
            default:
               break;
         }

         if ( this.beneficio.aprobadoFinalAutoridad && this.beneficio.aprobadoFinalGerente && this.beneficio.aprobadoFinalDirector && this.formData.aprobadoFinalComite ) {

            this.formData.estado = 'proyecto aprobado';
            this.formData.aprobadoFinal = true;

         }

         if ( errors ) return false;

         return argins;

      },

      abrirRecomendaciones: function(e) {

         e.preventDefault();

         $.magnificPopup.open({
            items: {
              src: '#notas-popup',
              type: 'inline',
            },
            removalDelay: 500, //delay removal by X to allow out-animation
            callbacks: {
              beforeOpen: function() {
                  this.st.mainClass = 'mfp-zoom-out';
              },
              open: function() {
                setTimeout(function(){
                  


                }, 350);
              }
            }
         });

      },

      enviarObservaciones: async function(e) {

         if ( this.syncing ) return;

         this.syncing = true;

         e.preventDefault();

         var estado = 'pendiente observaciones gerencia';

         if ( this.beneficio.estado == 'pendiente de aprobación comité' ) estado = 'pendiente observaciones comité';

         if ( this.beneficio.estado == 'pendiente de aprobación final' ) estado = 'pendiente observaciones finales';

         var $this = $(e.target),
             $form = $this.parents('.nota-form'),
             enviar = {
               observaciones: $form.find('textarea[name="nota"]').val(),
               id: this.beneficio.id,
               estado: estado
             };

         $form.find('.text-danger').hide();

         if ( !enviar.observaciones ) {
        
            $('.nota-error').fadeIn();
    
            return;
    
         };

         var result = await Cloud['updateBeneficio'].with( enviar ).tolerate((err)=>{
          
            if ( err ) $form.find('.server-error').fadeIn();
    
            this.syncing = false;
    
         });
    
         if ( result ) {
    
            this.beneficio = result;
            this.syncing = false;

            $.magnificPopup.close();
    
         }

      },

      editFuncionario: function() {

         this.estadoTemp = this.beneficio.estado;

         this.beneficio.estado = 'pendiente por asignar funcionario';

         this.$forceUpdate();

      }

   }
});
