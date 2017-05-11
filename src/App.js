import React  from 'react';
import ReactDOM  from 'react-dom';
import PropTypes from 'prop-types';
import './App.css';

var createReactClass = require('create-react-class');

var listContact = createReactClass({
    propTypes: {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        description: PropTypes.string,
    },
    render: function(){
        return(
            React.createElement('li', {},
                React.createElement('a', {href: "#/contacts/"+this.props.id, className: 'ContactItem-name'}, this.props.name),
                React.createElement('a', {href: 'mailto:'+this.props.email}, this.props.email),
                React.createElement('div', {}, this.props.description)
            )
        )
    }
});

var ContactForm = createReactClass({
    propTypes: {
        value: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
    },
    onNameChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.value, {name: e.target.value}));
    },

    onEmailChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.value, {email: e.target.value}));
    },

    onDescriptionChange: function(e) {
        this.props.onChange(Object.assign({}, this.props.value, {description: e.target.value}));
    },
    onSubmit: function(e) {
        e.preventDefault();
        console.log('submit');
        this.props.onSubmit();
    },

    render:function(){
        var errors = this.props.value.errors || {};
        return(
            React.createElement('div', {className: 'ContactForm'},
                React.createElement('h2', {}, "Contact Form",
                    React.createElement('form', {
                            className: 'ContactForm',
                            onSubmit: this.onSubmit,
                            noValidate: true
                        },
                        React.createElement('span',{className: 'error'},errors.name),
                        React.createElement('input', {
                            type:'text',
                            className: errors.name && 'ContactForm-Error',
                            placeholder: 'name',
                            value: this.props.value.name,
                            onChange: this.onNameChange,
                        }),
                        React.createElement('span',{className: 'error'},errors.email),
                        React.createElement('input', {
                            type:'email',
                            className: errors.email && 'ContactForm-Error',
                            placeholder: 'Email',
                            value: this.props.value.email,
                            onChange: this.onEmailChange,
                        }),
                        React.createElement('textarea', {
                            placeholder: 'Description',
                            value: this.props.value.description,
                            onChange: this.onDescriptionChange,
                        }),
                        React.createElement('button', {
                            type: 'Submit',
                            className: 'addContact'
                        }, "Add Contact")
                    )
                )
            )
        );
    }
});

var ContactView = createReactClass({
    propTypes: {
        contacts: PropTypes.array.isRequired,
        newContact: PropTypes.object.isRequired,
        onNewContactChange: PropTypes.func.isRequired,
        onNewContactSubmit: PropTypes.func.isRequired,
    },
    render: function(){
        var contactElements =  this.props.contacts
            .filter(function(contact) {return contact.email})
            .map(function(contact) { return React.createElement(listContact, Object.assign({}, contact, {id: contact.key})); });

        return(
            React.createElement('div', {className: 'ContactView'},
                React.createElement('h2', {}, "Contacts"),
                React.createElement('ul', {}, contactElements),
                React.createElement(ContactForm, {
                    value: this.props.newContact,
                    onChange: this.props.onNewContactChange,
                    onSubmit: this.props.onNewContactSubmit,
                })
            )
        )
    }
});

var EditView = createReactClass({
    propTypes: {
        onChangeContact: PropTypes.func.isRequired,
        onSubmitContact: PropTypes.func.isRequired,
        contacts: PropTypes.array.isRequired,
        id: PropTypes.string.isRequired,
    },
    render: function () {
        var key = this.props.id;
        var contactForm = this.props.contacts.filter(function(contact){ return contact.key == key; })[0];

        return(
            !contactForm
            ? React.createElement('h1', {}, "Not Found")
            : React.createElement('div', {className: 'EditView'},
                React.createElement('h1', {className: 'ContactView-title'}, "Edit Contact"),
                React.createElement(ContactForm, {
                    value: contactForm,
                    onChange: this.props.onChangeContact,
                    onSubmit: this.props.onSubmitContact,
                })
            )
        );
    }
});

/* Constants */
var CONTACT_TEMPLATE = {name: "", email: "", description: "", errors:null};
// The app's complete current state
var state = {};


/* Actions */

function updateNewContact(contact) {
    setState({ newContact: contact });
}

function submitNewContact() {
    var contact = Object.assign({}, state.newContact, {key: state.contacts.length+1, errors: {}});
    if(!contact.name) {
        contact.errors.name = ["Please enter your new contact's name"];
    }
    if(!/.+@.+\..+/.test(contact.email)) {
        contact.errors.email = ["Please enter your new contact's email"];
    }

    setState(
        Object.keys(contact.errors).length === 0
            ? {
                newContact: Object.assign({}, CONTACT_TEMPLATE),
                contacts: state.contacts.slice(0).concat(contact),
            }
            : {
                newContact: contact
            }
    );

}
var Application = createReactClass({
    propTypes: {
        location: PropTypes.array.isRequired,
    },

   render: function(){
       switch(this.props.location[0]) {
           case 'contacts':
               if(this.props.location[1]){
                   return React.createElement(EditView, Object.assign({}, this.props, {
                       id: this.props.location[1],
                       onChangeContact: updateNewContact,
                       onSubmitContact: submitNewContact,
                   }));
               }else {
                   return React.createElement(ContactView, Object.assign({}, this.props, {
                       onNewContactChange: updateNewContact,
                       onNewContactSubmit: submitNewContact,
                   }));
               }
               break;
           default:
               return React.createElement('div', {},
                   React.createElement('h1', {}, "Not Found"),
                   React.createElement('a', {href: '#/contacts'}, "Contacts")
               );
       }
   }
});

function navigated() {
    setState({
        location: window.location.hash.replace(/^#\/?|\/$/g, '').split('/')
    });
}

// Make the given changes to the state and perform any required housekeeping
function setState(changes) {
    Object.assign(state, changes);

    if(!state.transitioning){
        ReactDOM.render(
            React.createElement(Application, state),
            document.getElementById('contact-form')
        );
    }

}

// Set initial data
setState({
    contacts: [
        {key: 1, name: "Foo", email: "foo@bar.com", description: "Lorem ipsum lorem ipsum"},
        {key: 2, name: "Bar", email: "bar@bar.com"},
    ],
    newContact: Object.assign({}, CONTACT_TEMPLATE),
    location: window.location.hash,
    transitioning: false
});

window.addEventListener('hashchange', navigated, false);

navigated();
