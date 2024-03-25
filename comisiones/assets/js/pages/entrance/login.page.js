parasails.registerPage('login', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    formData: {
      rememberMe: true,
    },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // A set of validation rules for our form.
    // > The form will not be submitted if these are invalid.
    formRules: {
      // emailAddress: { required: true, isEmail: true },
      // password: { required: true },
      // registro: { required: true }
    },

    // Server error state for the form
    cloudError: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

    document.body.classList.add('beforeMount');

  },
  mounted: async function() {

     document.body.classList.add('mounted');

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    submittedForm: async function() {

      console.log(globalResponse);

      // Redirect to the logged-in dashboard on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;

      if ( globalResponse.rolComisiones != 'profesional' ) {

        window.location = '/bienvenido';

      } else {

        if ( globalResponse.profileConfirmed ) {

          window.location = '/mis-comisiones';

        } else {

          window.location = '/account';

        }

      }

    },

    handleParsingForm: function() {
       // Clear out any pre-existing error messages.
       this.formErrors = {};

       var argins = this.formData;

       var $idFeedback = document.getElementsByClassName("id-feedback")[0];

       // Validate ID:
       if(!argins.registro) {
           $idFeedback.style.display = 'block';
           this.formErrors.registro = true;
       } else {
           $idFeedback.style.display = 'none';
       }

       if (Object.keys(this.formErrors).length > 0) {
         return;
       }

        return argins;

     }

  }
});
