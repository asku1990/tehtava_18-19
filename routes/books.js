var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// display books page
router.get('/', function(req, res, next) {

    dbConn.query('SELECT * FROM opinto.opiskelija ORDER BY id asc',function(err,rows)     {

        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('books',{data:''});
        } else {
            // render to views/books/index.ejs
            res.render('books',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {
    // render to add.ejs
    res.render('books/add', {
        etunimi: '',
        sukunimi: '',
        osoite: '',
        luokkatunnus: ''
    })
})

// add a new book
router.post('/add', function(req, res, next) {

    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let osoite = req.body.osoite;
    let luokkatunnus = req.body.luokkatunnus;
    let errors = false;

    if(etunimi.length === 0 || sukunimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "anna etunimi ja sukunimi!");
        // render to add.ejs with flash message
        res.render('books/add', {
            etunimi : etunimi,
            sukunimi : sukunimi,
            osoite : osoite,
            luokkatunnus : luokkatunnus
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            etunimi : etunimi,
            sukunimi : sukunimi,
            osoite : osoite,
            luokkatunnus : luokkatunnus
        }

        // insert query
        dbConn.query('INSERT INTO opinto.opiskelija SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('books/add', {
                    etunimi: form_data.etunimi,
                    sukunimi: form_data.sukunimi,
                    osoite: form_data.osoite,
                    luokkatunnus: form_data.luokkatunnus
                })
            } else {
                req.flash('success', 'opiskelija lisätty');
                res.redirect('/books');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM opinto.opiskelija WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Opiskelijaa ei löytynyt id = ' + id)
            res.redirect('/books')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('books/edit', {
                title: 'Edit Book',
                id: rows[0].id,
                etunimi: rows[0].etunimi,
                sukunimi: rows[0].sukunimi,
                osoite: rows[0].osoite,
                luokkatunnus: rows[0].luokkatunnus
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let osoite = req.body.osoite;
    let luokkatunnus = req.body.luokkatunnus;
    let errors = false;

    if(etunimi.length === 0 || sukunimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "anna etunimi ja sukunimi!");
        // render to add.ejs with flash message
        res.render('books/edit', {
            id: req.params.id,
            etunimi: etunimi,
            sukunimi: sukunimi,
            osoite: osoite,
            luokkatunnus: luokkatunnus
        })
    }

    // if no error
    if( !errors ) {

        var form_data = {
            etunimi: etunimi,
            sukunimi: sukunimi,
            osoite: osoite,
            luokkatunnus: luokkatunnus
        }
        // update query
        dbConn.query('UPDATE opiskelija SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('books/edit', {
                    id: req.params.id,
                    etunimi: form_data.etunimi,
                    sukunimi: form_data.sukunimi,
                    osoite: form_data.osoite,
                    luokkatunnus: form_data.luokkatunnus
                })
            } else {
                req.flash('success', 'opiskelija päivitetty onnistuneesti!');
                res.redirect('/books');
            }
        })
    }
})

// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM opinto.opiskelija WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/books')
        } else {
            // set flash message
            req.flash('success', 'opiskelija poistettu onnistuneesti! ID = ' + id)
            // redirect to books page
            res.redirect('/books')
        }
    })
})

module.exports = router;
