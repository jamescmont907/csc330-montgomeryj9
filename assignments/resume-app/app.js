const express = require('express');
const path = require('path');
require('dotenv').config();

const profile = {
    name: 'James Montgomery',
    headline: 'Computer Science Student',
    summary: 'Hardworking Computer Science undergraduate seeking opportunities in Information Technology or Software Engineering. Skilled in troubleshooting, networking, and systems support, with strong customer service experience and the ability to explain technical solutions clearly.',
    keyStrengths: ['Software', 'Problem Solving', 'Coding Tutoring'],
    contactInfo: {
        email: 'jamescmont@gmail.com',
        schoolEmail: 'montgomeryj9@southernct.edu',
        github: 'https://github.com/jamescmont907'
    }
};

const app = express();
const PORT = process.env.PORT || 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home', {
        title: 'Home',
        currentPage: 'home',
        message: 'Welcome to my homepage',
        profile: profile
    })
});
app.get('/education', (req, res) => {
    res.render('education', {
        title: 'Education',
        currentPage: 'education',
        message: 'Where I have been to school',
        education: {
            institution: 'Southern Connecticut State University',
            location: 'New Haven, CT',
            degree: 'B.S. in Computer Science',
            expectedGraduation: 'May 2027',
            coursework: ['Data Structures', 'Web Development', 'Algorithms', 'Databases']
        }
    })
});

app.get('/skills', (req, res) => {
    res.render('skills', {
        title: 'Skills',
        currentPage: 'skills',
        message: 'James` skills',
        skills :[
             {
                name: 'Personal Website',
                description: 'A site built with Node, Express, and EJS.'
            }
        ]
    })
});

app.get('/projects', (req, res) => {
    res.render('projects', {
        title: 'Projects',
        currentPage: 'projects',
        message: 'My projects',
        projects: [
            {
            title: 'Personal Website',
            description: 'A multi-page site built with Node, Express, and EJS.',
            technologies: ['Node.js', 'Express', 'EJS', 'CSS'],
            link: 'https://github.com/jamescmont907'
    }]
    })
});

// 404 Error Handler
app.use((req, res) => {
  res.status(404).render('404', { 
    title: '404 - Page Not Found',
    currentPage: '404'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Personal website running at http://localhost:${PORT}`);
});