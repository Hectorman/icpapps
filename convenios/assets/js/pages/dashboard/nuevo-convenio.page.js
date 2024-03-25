parasails.registerPage('nuevo-convenio', {
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

    excelRow: false,

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

  },
  mounted: async function() {
    document.body.classList.add('mounted');
    console.log( this );
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

   uploadChange: function( event ) {

      var vueObj = this;

      var file = event.target.files[0];
      var reader = new FileReader();
      var excelData = [];
      reader.onload = function (event) {
          var data = event.target.result;
          var workbook = XLSX.read(data, {
              type: 'binary'
          });

          workbook.SheetNames.forEach(function (sheetName) {

              var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

              for (var i = 0; i < XL_row_object.length; i++)
              {
                  excelData.push(XL_row_object[i]["convenio"]);

              }

              var json_object = XL_row_object[0];
              if ( json_object ) {

                 vueObj.excelRow = json_object;
                 $('.file-name').val( file.name );

              }

          })

      };

      reader.onerror = function (ex) {
          console.log(ex);
      };

      reader.readAsBinaryString(file);

   },

   fakeUpload: function(e) {

      $('#uploadExcel').trigger('click');

   },

   submittedForm: async function( data ) {
      // Redirect to the account page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;

      console.log( cloudResult );

      window.location = '/convenio/' + cloudResult;

   },

   handleParsingForm: function() {

      this.formErrors = {};

      var argins = this.formData,
          excelErrors = [],
          errors = 0,
          $errorWrapper = $('.attach-wrapper .errores-campos').html('');

      if ( !this.formData.titulo ) {

         this.formErrors.titulo = true;

         errors++;

      }

      if ( !this.excelRow ) {

         this.formErrors.excel = true;

         errors++;

      }

      argins.campos = this.excelRow;

      var testNumber = this.testNumber( argins.campos );

      if ( testNumber ) {

         excelErrors = excelErrors.concat( testNumber );

         errors++;

      }

      var testDate = this.testDate( argins.campos );

      if ( testDate ) {

         excelErrors = excelErrors.concat( testDate );

         errors++;

      }

      if ( excelErrors.length ) {

         $('#uploadExcel').val('');
         $('.file-name').val('');

         for (let index = 0; index < excelErrors.length; index++) {
            const element = excelErrors[index];
            
            $errorWrapper.append('<p class="error">' + element + '</p>');
         }

      }

      if ( errors ) return false;

      return argins;
   },

   testNumber: function( campos ) {

      var camposNumber = [
         'Número de Convenio',
         'Número de Acuerdo Cooperación',
         'Número de Acta de Comité',
         'No. de Suspensiones',
         'No. de Mod. del Conv.',
         'No. de Otrosíes del Conv.',
         'Moneda de Convenio',
         'Valor Inicial del Convenio',
         'Valor Actual del Convenio',
         'Total Aportes ECP Especie',
         'Total Aportes ECP Dinero',
         'Total Aportes ECOPETROL',
         'Total Aportes Aliado Especie',
         'Total Aportes Aliado Dinero',
         'Total Aportes Aliados',
         'Valor de Adicionales Convenio',
         'Valor Desembolsado Ecopetrol',
         'Valor Ejecutado Convenio',
         'Saldo Fiducia,Enc.Fiduc,Cuenta',
         '% Avance Técnico o Ejecución',
         'Rendimientos Financieros',
         'Valor Reintegros Convenio',
         '% ECP',
         '% Aliado',
         'Plazo de Ejecución (Meses)',
         'No. de días suspendido'
      ],
      errors = [];

      for (let index = 0; index < camposNumber.length; index++) {
         const element = camposNumber[index];

         if ( campos[ element ] ) {

            if ( !campos[ element ].match(/^[0-9]+$/) ) {

               errors.push( 'el campo "' + element + '" debe contener únicamente caracteres numéricos' );

            }

         }
         
      }

      return errors.length ? errors : false;

   },

   testDate: function( campos ) {

      var camposDate = [
         'Fecha de Suscripción',
         'Fecha de Inicio',
         'Fecha de Finalización',
         'Fecha de Acta de Finalización',
         'Fecha de Cierre Planeada',
         'Fecha de Acta de Cierre',
         'Fecha Inicio Suspensión',
         'Fecha Inicio de Acción',
         'Fecha Fin de Acción'
      ],
      errors = [];

      for (let index = 0; index < camposDate.length; index++) {
         const element = camposDate[index];

         if ( campos[ element ] ) {

            var momentDate = moment( campos[ element ], 'DD/MM/YYYY' );

            if ( momentDate.isValid() ) {

               campos[ element ] = momentDate.format("DD/MM/YYYY");

            } else {

               errors.push( 'el campo "' + element + '" no es una fecha válida. el formato aceptado es DD/MM/YYYY' );

            }

         }
         
      }

      return errors.length ? errors : false;

   }

  }
});
