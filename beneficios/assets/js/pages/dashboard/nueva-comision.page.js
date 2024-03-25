parasails.registerPage('nueva-comision', {
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

    selectedPais: false,

    urgentePrompted: false
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach raw data exposed by the server.
    _.extend(this, SAILS_LOCALS);
    document.body.classList.add('beforeMount');
    document.body.classList.add('nueva-comision-wrapper');

    this.formData.nombres = this.populatedUser.fullName.toLowerCase();
    this.formData.gerencia = this.populatedUser.registro[0].gerencia;
    this.formData.departamento = this.populatedUser.registro[0].departamento;

  },
  mounted: async function() {
    document.body.classList.add('mounted');

    var self = this;

    $('.datepicker-input').datepicker({
      language: 'es',
      autoClose: true,
      dateFormat: 'yyyy/m/d',
      minDate: new Date(),
      onSelect: function(formattedDate, date, inst) {

        self.formData[ inst.$el[0].dataset.name ] = formattedDate;

        self.updateDates();

      }
    });

    $('.autocomplete-ciudad').autocomplete({
      serviceUrl: 'http://agenciatesla.digital/autocomplete/ciudades.php?codigo=CO',
      onSelect: function (suggestion) {
        console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);

        self.formData.ciudad = suggestion.value;
      },
      minChars: 3
    });

    $('.autocomplete-ciudad-origen').autocomplete({
      serviceUrl: 'http://agenciatesla.digital/autocomplete/ciudades.php?codigo=CO',
      onSelect: function (suggestion) {
        console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);

        self.formData.ciudadOrigen = suggestion.value;
      },
      minChars: 3
    });

    $('.autocomplete-pais').autocomplete({
        serviceUrl: 'http://agenciatesla.digital/autocomplete/',
        onSelect: function (suggestion) {

          console.log('You selected: ' +  suggestion.value + ', ' + suggestion.data);
          self.selectedPais = suggestion.data;
          self.formData.ciudad = '';
          self.formData.pais = suggestion.value;

          $('.autocomplete-ciudad').autocomplete().setOptions({
            serviceUrl: 'http://agenciatesla.digital/autocomplete/ciudades.php?codigo=' + self.selectedPais,
            onSearchStart: function() {
              console.log( self.selectedPais );
            },
            onSelect: function (suggestion) {
              console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
              self.formData.ciudad = suggestion.value;
            },
            minChars: 3
          });

        },
        onSearchError: function(query, jqXHR, textStatus, errorThrown) {

          self.selectedPais = query;

        },
        minChars: 3
    });

    // $('.autocomplete-pais').on('input', function(e){

    //   console.log( e.target );

    // });

    console.log( this );
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    prevTab: function() {

      this.formStep--;

    },

    nextTab: function(e) {

      if (e) e.preventDefault();

      var self = this,
          $steps = $('.form-step'),
          $currentStep = $steps.eq( this.formStep );

      this.formErrors = {};

      console.log( $steps );

      $currentStep.find('.form-group').each(function(){

          var $this = $(this),
              thisDataErrror = $this.attr('data-error'); 

          if ( thisDataErrror ) {

            console.log( $this );

            if ( !self.formData[ thisDataErrror ] && $this.css('display') !== 'none' ) {

              self.formErrors[ thisDataErrror ] = true;

            }

          }

      });

      if (Object.keys(this.formErrors).length > 0) {
        console.log(this.formErrors);
        return;
      }

      if ( this.formStep < 3 ) this.formStep++;

      return true;

    },

    updateDates: function(){

      var $fechaInicial = $('.fecha-inicial'),
          $fechaFinal = $('.fecha-final'),
          datepickerFinal = $fechaFinal.datepicker().data('datepicker'),
          datepickerInicial = $fechaInicial.datepicker().data('datepicker');

      if ( this.formData.fechaInicial ) {

        var initTimestamp = Date.parse( this.formData.fechaInicial.replace(new RegExp('/', 'g'), ',') );

        datepickerFinal.update('minDate', 
          new Date( initTimestamp + ( 1000 * 60 * 60  * 24 ) )
        );

      } else {

        datepickerFinal.update('minDate',  new Date());

      }

      if ( this.formData.fechaFinal ) {

        var finalTimestamp = Date.parse( this.formData.fechaFinal.replace(new RegExp('/', 'g'), ',') );

        datepickerInicial.update('maxDate',
          new Date( finalTimestamp - ( 1000 * 60 * 60  * 24 ) )
        );

      } else {

        datepickerInicial.update('maxDate', false);

      }

    },

    destinoChange: function() {

      var self = this;

      if ( this.formData.tipoDestino == 'nacional' ) {

        this.formData.ciudad = '';

        $('.autocomplete-ciudad').autocomplete().setOptions({
          serviceUrl: 'http://agenciatesla.digital/autocomplete/ciudades.php?codigo=CO',
          onSelect: function (suggestion) {
            console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
            self.formData.ciudad = suggestion.value;
          },
          minChars: 3
        });

      } else {

        this.selectedPais = false;  
        this.formData.pais = '';
        this.formData.ciudad = '';

      }

    },

    urgenteClick: function(e) {

      var $this = $(e.target);

      if ( $this.hasClass('si') ) this.formData.urgente = true;

      this.urgentePrompted = true;

      $.magnificPopup.close();

      setTimeout(function(){

        $('#submitComision').trigger('click');

      }, 400);

    },

    graciasClick: function(e) {

      var $this = $(e.target);

      if ( $this.hasClass('no') ) {

        window.location = '/mis-comisiones'

      } else {

        window.location = '/nueva-comision'

      }

    },

    submittedForm: async function() {
      // Redirect to the account page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;

      console.log('wat');

      setTimeout(function(){

        $.magnificPopup.open({
          items: {
            src: '#gracias-popup',
            type: 'inline',
          },
          removalDelay: 500, //delay removal by X to allow out-animation
          callbacks: {
            beforeOpen: function() {
                this.st.mainClass = 'mfp-zoom-out';
            }
          }
        });

      }, 300);

    },

    handleParsingForm: function() {
      // Clear out any pre-existing error messages.
      if ( !this.nextTab() ) return;

      var argins = this.formData;

      var fechaInicialTs = Date.parse( this.formData.fechaInicial.replace(new RegExp('/', 'g'), ',') )
          todayTs = Date.parse( new Date() ),
          fechaInicialDias = fechaInicialTs / ( 1000 * 60 * 60 * 24 ),
          todayDias = todayTs / ( 1000 * 60 * 60 * 24 ),
          anticipacion = fechaInicialDias - todayDias;

      if ( anticipacion < 8 && !this.urgentePrompted ) {

        $.magnificPopup.open({
          items: {
            src: '#urgente-popup',
            type: 'inline',
          },
          removalDelay: 500, //delay removal by X to allow out-animation
          callbacks: {
            beforeOpen: function() {
                this.st.mainClass = 'mfp-zoom-out';
            }
          }
        });

        return;

      }

      console.log( argins );

      return argins;
    },

  }
});
