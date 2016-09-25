var mongoose = require('mongoose');
const { Schema } = mongoose;

var facultySchema = new Schema({
    short: String,
    full: String,
    urlPart: String
});

var Faculty = mongoose.model('Faculty', facultySchema);

var specialitySchema = new Schema({
    short: String,
    faculty: {
        type: Schema.Types.ObjectId,
        ref: 'Faculty'
    }
});

var Speciality = mongoose.model('Speciality', specialitySchema);

var groupSchema = new Schema({
    short: String,
    url: String,
    speciality: {
        type: Schema.Types.ObjectId,
        ref: 'Speciality'
    },
    faculty: {
        type: Schema.Types.ObjectId,
        ref: 'Faculty'
    }
});

var Group = mongoose.model('Group', groupSchema);

var lessonSchema = new Schema({
    number: Number,
    date: Date,
    subject: String,
    teacher: String,
    lesson_type: String,
    sub_group: Number,
    auditory: String,
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }
});

var Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = {
    Faculty,
    Speciality,
    Group,
    Lesson
};
