const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel")
//@description Get all contacts
//@route GET /api/contacts
//@acces private
const getContacts = asyncHandler( async (req, res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts)
});

//@description Create new contact
//@route POST /api/contacts
//@acces private
const createContact = asyncHandler( async  (req, res) => {
    console.log("The request body is:", req.body)
    const {name, email, phone} = req.body;
    if(!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const contact = await Contact.create({
        name, email, phone, user_id: req.user.id
    })
    res.status(201).json(contact)
});

//@description Get new contact
//@route POST /api/contacts/:id
//@acces private
const getContact = asyncHandler( async  (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found")
    }
    res.status(200).json(contact)
});

//@description Update new contact
//@route PUT /api/contacts/:id
//@acces private
const updateContact = asyncHandler( async  (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found")
    }

    if(contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have a permission to update other user contacts")
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true}
    )

    res.status(200).json(updatedContact)
});

//@description Delete new contact
//@route DELETE /api/contacts/:id
//@acces private
const deleteContact = asyncHandler( async  (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found")
    }
    await Contact.deleteOne();
    res.status(200).json(contact);
});

module.exports = {getContacts, getContact, createContact, updateContact, deleteContact}