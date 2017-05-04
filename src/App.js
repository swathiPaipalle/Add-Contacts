import React  from 'react';
import ReactDOM  from 'react-dom';
import './App.css';

var listContact = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string.isRequired,
        description: React.PropTypes.string,
    },
    render: function(){
        return(
            React.createElement('li', {},
                React.createElement('h2', {}, this.props.name),
                React.createElement('a', {href: 'mailto:'+this.props.email}, this.props.email),
                React.createElement('div', {}, this.props.description)
            )
        )
    }
});


var ContactForm = React.createClass({
    propTypes: {
        value: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onSubmit: React.PropTypes.func.isRequired,
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
var ContactView = React.createClass({
    propTypes: {
        contacts: React.PropTypes.array.isRequired,
        newContact: React.PropTypes.object.isRequired,
        onNewContactChange: React.PropTypes.func.isRequired,
        onNewContactSubmit: React.PropTypes.func.isRequired,
    },
    render: function(){
        var contactElements =  this.props.contacts
            .filter(function(contact) {return contact.email})
            .map(function(contact){return React.createElement(listContact, contact)});

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

var CONTACT_TEMPLATE = {name: "", email: "", description: "", errors:null};
// The app's complete current state
var state = {};

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

function updateNewContact(contact) {
    setState({ newContact: contact });
}

// Make the given changes to the state and perform any required housekeeping
function setState(changes) {
    Object.assign(state, changes);

    ReactDOM.render(
        React.createElement(ContactView, Object.assign({}, state, {
            onNewContactChange: updateNewContact,
            onNewContactSubmit: submitNewContact,
        })),
        document.getElementById('contact-form')
    );
}

// Set initial data
setState({
    contacts: [
        {key: 1, name: "Foo", email: "foo@bar.com", description: "Lorem ipsum lorem ipsum"},
        {key: 2, name: "Bar", email: "bar@bar.com"},
    ],
    newContact: Object.assign({}, CONTACT_TEMPLATE),
});

