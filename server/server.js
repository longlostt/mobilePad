const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const connectDB = require('./config/db'); // db connection
connectDB()

const User = require('./models/User');
const Contact = require('./models/Contact');


// Middleware setup
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key', // Replace with actual secret later
    resave: false,
    saveUninitialized: true
}));

// Serve static files from the client/styles and client/scripts
app.use('/styles', express.static(path.join(__dirname, '../client/styles')));
app.use('/scripts', express.static(path.join(__dirname, '../client/scripts')));
app.use(flash());

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', [
    path.join(__dirname, 'views'), // server/views
    path.join(__dirname, '../client/views') // client/views
]);


// auth middleware
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    } else {
        next()
    }
}

// routes
app.get('/index', requireLogin, async (req, res) => {
    const userId = req.session.user_id;
    const contacts = await Contact.find({ user: userId });
    res.render('index', { contacts });
});


// GET /api/contacts - Fetch contacts and userID
app.get('/api/contacts', requireLogin, async (req, res) => {
    const userID = req.session.user_id;
    const contacts = await Contact.find({ user: userID });
    res.json({ contacts, userID });
});

// POST /api/contacts - Add a new contact
app.post('/api/contacts', requireLogin, async (req, res) => {  
    console.log('Received body:', req.body);
    const { name, phone, userId } = req.body;

    if (!name || !phone || !userId) {
        return res.status(400).json({ error: 'Name, phone, and userId are required' });
    }

    try {
        const contact = new Contact({ name, phone, user: userId });
        await contact.save();
        res.status(201).json(contact);  
    } catch (err) {
        res.status(500).json({ error: 'Failed to save contact' });
    }
});

// DELETE /api/contacts/:id - Delete a contact by ID
app.delete('/api/contacts/:id', requireLogin, async (req, res) => {
    const contactId = req.params.id;

    try {
        const deletedContact = await Contact.findByIdAndDelete(contactId);
        if (!deletedContact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});


app.get('/login', (req, res) => {
    const messages = {
        error: req.flash('error'),
        success: req.flash('success'),
    };
    res.render('users/login', { messages });
});

app.post('/login', async (req, res) => {
    const { password, username } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect('/index');
    } else {
        req.flash('error', 'Invalid username or password!');
        res.status(401).redirect('/login');
    }
});


app.get('/signup', (req, res) => {
    const messages = {
        error: req.flash('error'),
        success: req.flash('success'),
    };
    res.render('users/signup', { messages });
})



app.post('/signup', async (req, res) => {
    const { username, password, passwordConfirm } = req.body;
    // Initialize an empty array to store flash messages
    const messages = [];

    // Validate username length
    if (username.length < 8) {
        messages.push('Username must be at least 8 characters long!');
    }

    // Validate password length
    if (password.length < 8) {
        messages.push('Password must be at least 8 characters long!');
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
        messages.push('Password must contain a special character!');
    }

    if (!/[a-zA-Z]/.test(password)) {
        messages.push('Password must contain a letter!');
    }

    if (!/[0-9]/.test(password)) {
        messages.push('Password must contain a number!');
    }

    if (password !== passwordConfirm) {
        messages.push('Passwords do not match!');
    }

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        messages.push('Username already exists!');
    }

    // If there are messages, store them in flash and redirect to signup page
    if (messages.length > 0) {
        req.flash('error', messages);
        return res.redirect('/signup');
    }

    // If no messages, proceed to save the user
    const user = new User({ username, password });
    await user.save();

    req.session.user_id = user._id;
    req.flash('success', 'Account created successfully!');
    return res.redirect('/login');
});




app.listen(3000, () => {
    console.log(`3000`);
});
