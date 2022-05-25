const model = require('../models/event');
const rsvpmodel = require('../models/rsvp');



exports.index = (req, res)=>{
    model.find()
    .then(events=>{
        let category = [];
        events.forEach(event =>{
        category.push(event.category);
        });
        let unique = new Set(category);

        res.render("./event/index", {events, unique})
    })
    .catch(err=>next(err));
};


exports.new = (req, res)=>{
    res.render('./event/new');
};

exports.create = (req, res, next)=>{
    let event = new model(req.body);
    event.host = req.session.user;
    event.save()
    .then(event=> {

        req.flash('success', 'Event has been created successfully');
        res.redirect('/events');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
        req.flash('error', err.message);
        return res.redirect('/back');
        }
        next(err);
    });
    
};

exports.show = (req, res, next)=>{
    let id = req.params.id;
    Promise.all([model.findById(id).populate('host', 'firstName lastName'), rsvpmodel.find({event: id, answer: "Yes"})]) //--------
    .then(event=>{
        const [events, rsvp] = event;
        if(event) {       
            return res.render('./event/show', {events, rsvp});
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));

};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(event=>{
        return res.render('./event/edit', {event});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let event = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event=>{
        return res.redirect('/events/'+id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    });
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;
    
    Promise.all([model.findByIdAndDelete(id), rsvpmodel.deleteMany({event:id})]) //---------
    .then(results =>{
        const [event , rsvp] = results;
        if(event){
            req.flash("success", "Event successfully deleted");
            res.redirect('/events');
        }
        
    })
    .catch(err=>next(err));
};

exports.rsvp = (req, res, next)=>{
    let id = req.session.user;
    let eventId = req.params.id;
    let answer = req.params.answer;
    model.findById(eventId)
    .then(event => {
        if(event){
            let eventName = event.title;
            let eventCategory = event.category;
            rsvpmodel.findOneAndUpdate({user: id, event: eventId, eventName: eventName, eventCategory: eventCategory}, {answer: answer}, {upsert:true, new: true})
            .then(result =>{
                if(result){
                    req.flash("success", "RSVP sent");
                    res.redirect("/users/profile");
                }
            })
            .catch(err=>next(err));

        } else {
            let err = new Error("No event with id" + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};