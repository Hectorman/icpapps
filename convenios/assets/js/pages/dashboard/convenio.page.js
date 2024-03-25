parasails.registerPage('convenio-single', {

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝

  data: {

    syncing: false,

    // Form data
    formData: { /* … */ },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // Server error state for the form
    cloudError: '',

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝

  beforeMount: function() {

    // Attach any initial data from the server.

    var vueObj = this;

    _.extend(this, SAILS_LOCALS);
    document.body.classList.add('beforeMount');
    document.body.classList.add('darkHeader');

    if ( !this.convenio.campos ) this.convenio.campos = {};
    if ( !this.convenio.propiedad ) this.convenio.propiedad = {};

    this.setUpMultipleInputs();

    Vue.directive('money-format', {
      bind: function(el) {
         vueObj.moneyFormat(el)
      },
      update: function(el) {
         vueObj.moneyFormat(el)
      }
    });

  },

  mounted: async function() {

   document.body.classList.add('mounted');
   console.log( this );

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝

   methods: {

      moneyFormat: function ( el ) {

         var formatter = new Intl.NumberFormat('es-CO', {
             style: 'currency',
             currency: 'COP',
             minimumFractionDigits: 0
         });

         if ( el.value ) el.value = formatter.format( el.value );

      },

      setUpMultipleInputs: function() {

         var multiCampos = [
            'Patente',
            'seminarios',
            'talleres',
            'Productos Tecnológicos',
            'Doctor',
            'Estudiante de Doctorado',
            'Maestria',
            'Estudiante de Maestría',
            'Especialista',
            'Estudiante de Especialista',
            'Profesional',
            'Estudiante de Pregrado',
            'Tecnólogo'
         ];

         for (let index = 0; index < multiCampos.length; index++) {
            const element = multiCampos[index];
   
            if ( !this.convenio.propiedad[element] ) this.convenio.propiedad[element] = [{}];
            
         }

      },

      openList: function(e) {

         var $target = $(e.target),
             $parent = $target.parents('.list-wrapper').length ? $target.parents('.list-wrapper') : $target;

         $('body').removeClass('toggleSidebar');

         $parent.toggleClass('open');

      },

      toggleSidebar: function(e) {

         $('.list-wrapper').removeClass('open');

         $('body').toggleClass('toggleSidebar');

      },

      multiformNav: function(e) {

         if ( e.target.tagName !== 'LI' ) return;
         
         var $target = $(e.target),
             index = $target.index(),
             $pages = $('.multiform-page');

         $target.addClass('active').siblings('.active').removeClass('active');

         $pages.eq( index ).addClass('active').siblings('.active').removeClass('active');

      },

      tabClick: function(e) {

         var $target = $(e.target),
             $parent = $target.parents('.tabs-nav').length ? $target.parents('.tabs-nav') : $target,
             index = $parent.index(),
             $tabs = $parent.parents('.tabs-wrapper').find('.tabs-content > div');

         $parent.addClass('active').siblings('.active').removeClass('active');

         $tabs.eq( index ).addClass('active').siblings('.active').removeClass('active');

      },

      congresoChange: function(e) {

         console.log( this.convenio.propiedad );

         this.$forceUpdate();

      },

      addMultiCampo: function(e) {

         e.preventDefault();

         var campo = $(e.target).data('campo');

         this.convenio.propiedad[campo].push({});

         this.$forceUpdate();

      },

      submittedForm: async function( data ) {

         this.syncing = true;
   
         console.log( cloudResult );
   
         alert('Información actualizada exitósamente');

         this.syncing = false;
   
      },
   
      handleParsingForm: function() {
   
         this.formErrors = {};
   
         var argins = this.convenio,
             errors = 0;
   
         
   
         if ( errors ) return false;
   
         return argins;
      },

   }

});

