<template>
  <section class="innerpage-wrap">
    <div class="container">

      <div>
  <h1>Quotes load</h1>
  <ul>
    <li v-for="(quote, index) in quoteCollector" :key="index">{{ quote }}</li>
  </ul>
  <button @click.prevent="getQuotes">Refresh quote</button>
</div>
      <b-alert
      v-if="showAlertNoData"
      :variant="alertType"
      dismissible
      :dismiss-label="dismissLabel"
      @dismissed="dismissAlert"
    >
      {{ alertMessage }}
    </b-alert>
      <b-modal hide-header="1" id="response_model">
        <p class="my-4">{{responsemessage}}</p>
      </b-modal>
      <div class="overflow-auto">
        <div class="banner">

          <div>
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-3" >
          <div class="d-flex align-items-center">
            <label for="search" class="mr-2">Search:</label>
            <input type="text" placeholder="Search by full name" class="form-control" id="search" v-model="searchTerm" />
          </div>
          <button type="button" @click="addContactDataManage" class="btn btn-outline-dark">Click to add contact</button>
          <button type="button" class="btn btn-primary" @click="getList">Search</button>
        </div>          
       
        <div>
            <p class="mt-3">Current Page: {{ currentPage }}</p>
          </div>
        <b-table id="my-table" :items="data_collector" :fields="fields" :per-page="perPage" :current-page="currentPage" small>
          <template #cell(actions)="data">
            <button class="btn btn-dark btn-sm" @click="editContactsDataManage(data.item)" :ref="'btn' + data.index">Edit</button>
            <button class="btn btn-danger btn-sm" @click="deleteContacts(data.item.id)" :ref="'btn' + data.index">Delete</button>
          </template>
        </b-table>
        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" aria-controls="my-table"></b-pagination>
      </div>
      <b-modal id="modal_edit" hide-footer="1" hide-header="1" size="lg" ok-only no-stacking>
        <div>
          <b-card bg-variant="light">
            <b-form-group label-cols-lg="3" label="Add Contact" label-size="lg" label-class="font-weight-bold pt-0" class="mb-0">
              <b-form-group label="Full Name:" label-for="full_name" label-cols-sm="3" label-align-sm="right">
                <b-form-input v-model="Contact_collentor.full_name" id="full_name"></b-form-input>
                <span class="error" v-if="form_errors.full_name_error">{{form_errors.full_name_error}}</span>
              </b-form-group>

              <b-form-group label="Email:" label-for="email" label-cols-sm="3" label-align-sm="right">
                <b-form-input v-model="Contact_collentor.email" id="email"></b-form-input>
                <span class="error" v-if="form_errors.email_error">{{form_errors.email_error}}</span>
              </b-form-group>

              <b-form-group label="Phone:" label-for="phone" label-cols-sm="3" label-align-sm="right" class="d-flex">
                <b-form-input readonly id="phone_country_code" value="+977" class="w-25 mr-3"></b-form-input>
                <b-form-input v-model="Contact_collentor.phone" id="phone" class="w-75"></b-form-input>
                <span class="error" v-if="form_errors.phone_error">{{form_errors.phone_error}}</span>
              </b-form-group>
            </b-form-group>
          </b-card>
        </div>
        <b-container fluid>
          <div class="action-btn text-center mt-4">
            <b-button class="button-brand mx-1" @click="handle_function_call(function_setting)">Submit</b-button>
          </div>
        </b-container>
      </b-modal>
    </div>

  </section>
</template>

<script>
import axios from 'axios'
export default ({
  name: 'ContactIndex',
  data: function () {
    return {
      perPage: 10,
      fields: ['full_name', 'email', 'phone', {key: "actions"}],
      currentPage: 1,
      all_data: [],
      form_errors:{
        full_name_error:'',
        email_error:'',
        phone_error:'',
        end_date_error:'',
      },
      data_collector: [],
      finished_Contact: [],
      upcomming_Contact: [],
      within_week_Contact: [],
      on_going_Contact: [],
      Contact_collentor:{
        id:'',
        full_name:'',
        email:'',
        phone:'',
        end_date:'',
      },
      responsemessage: '',
      response_model: false,
      value:'',
      function_setting:'',
      error:0,
      searchTerm:'',
      showAlertNoData: false,
      alertType: '',
      alertMessage: '',
      dismissLabel: 'Dismiss',
      quoteCollector:[],
    }
  },
  mounted() {
    let app = this;
    // app.getList();
    app.getQuotes();
  },
  methods: {
    getList() {
        let app = this;
        axios.get('/get-contacts?search='+app.searchTerm).then((response) => {
          app.data_collector = response.data.data.data;
          app.currentPage = response.data.data.current_page;
          app.searchTerm = '';
          
          if (!app.data_collector.length) {
            app.addContactDataManage();
            app.showAlertNoData = true;
            app.alertType = 'info';
            app.alertMessage = 'No contacts found! Please add a new contact.';
            setTimeout(() => {
              app.showAlertNoData = false;
            }, 6000);
          }
        })
      },
    
    deleteContacts: function(id){
      let app = this;
      axios.delete('/delete-contact',{
        params: {
          id: id,
        }
      })
      .then(function (response) {
            if (response.data.status == 'success') {
              app.showAlert('Contact has been deleted successfully');
              app.getList();
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    },

    addContactDataManage: function(){
      let app = this;
      app.form_errors =[];
      app.error = 0;
      app.function_setting ='addContact';
      app.$root.$emit('bv::show::modal', 'modal_edit', '#btnShow');
    },

    addContact:function (){
      let app = this;
      if(app.error == 0){
        axios.post('/add-contact',{
          full_name:app.Contact_collentor.full_name,
          email:app.Contact_collentor.email,
          phone:'+977-'+app.Contact_collentor.phone,
      })
      .then(function (response) {
            if (response.data.status == 'success') {
              app.$root.$emit('bv::hide::modal', 'modal_edit', '#btnShow');
              app.showAlert('Contact has been Added successfully');
              app.getList();
            }
          })
          .catch((error) => {
            console.log(error)
          if (error.response.data.status === "error") {
            error.response.data.data.forEach(errorItem => {
              app.form_errors[errorItem.target_element + '_error'] = errorItem.error_message;
            });
          }
        });
      }
    },

    editContactsDataManage: function(editing_data){
      let app = this;
      app.Contact_collentor.id = editing_data.id;
      app.Contact_collentor.full_name = editing_data.full_name;
      app.Contact_collentor.email = editing_data.email;
      app.Contact_collentor.phone = editing_data.phone;
      app.function_setting ='editContact';
      app.$root.$emit('bv::show::modal', 'modal_edit', '#btnShow');
    },

    handle_function_call(function_name) {
      this[function_name]()
},

    editContact: function(){
      let app = this;
      if(app.error == 0){
      axios.post('/edit-contact',{
          id: app.Contact_collentor.id,
          full_name:app.Contact_collentor.full_name,
          email:app.Contact_collentor.email,
          phone:app.Contact_collentor.phone,
      })
      .then(function (response) {
            if (response.data.status == 'success') {
              app.$root.$emit('bv::hide::modal', 'modal_edit', '#btnShow');
              app.showAlert('Contact has been Edited successfully');
              app.getList();
            }
          })
          .catch((error) => {
            console.log(error)
          if (error.response.data.status === "error") {
            error.response.data.data.forEach(errorItem => {
              app.form_errors[errorItem.target_element + '_error'] = errorItem.error_message;
            });
          }
        });
        }
    },

    getQuotes: function() {
  if (this.error == 0) {
    let app = this;
    axios.get('/get-random-quotes')
      .then(function(response) {
        app.quoteCollector = response.data.data; 
      })
      .catch((error) => {
        console.log(error);
      });
  }
},

    showAlert(resmessage) {
      let app = this;
      app.$root.$emit('bv::show::modal', 'response_model', '#btnShow')
      app.responsemessage = resmessage;
      

      }
  },
  computed: {
    rows() {
      return this.data_collector.length
    }
  }
})
</script>

<style>
#my-table button{
  margin: 3px;
}

.banner{
  display: flex;
  justify-content: space-around;
}

.error{
  color: red;
}

.alert {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.24);
}

.info {
  background-color: #1976d2;
  color: #ffffff;
}
</style>
