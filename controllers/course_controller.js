const course_model = require('../models/course_model');
const student_model = require('../models/student_model');
const mongoose = require('mongoose');
module.exports = {
    create: async (req, res) => {
        try{
        let course = new course_model({
        course_id:req.body.course_id,
        name: req.body.name,
        admin_id: mongoose.Types.ObjectId(req.body.admin_id),
        sessioncount:0,
        session: 0,
        enroll:Math.floor(100000 + Math.random() * 900000)
        })
        const result= await course.save()
        res.status(200).json({ success: true, result: result})
    }
        catch(err) {
          res.status(501).json({ success: false, result: err})
            }
    },
    
    close:async(req, res) => {
      try {
        var c_id= mongoose.Types.ObjectId(req.params.c_id)
        course_model.findByIdAndUpdate(c_id,{$set:{allowEnroll:false}})
        res.status(200).json({success:true,message: "enrollment closed"})
      }
      catch (err)
      {
        res.status(501).json({success: false,message: err.message})
      }
},
   
    get: async (req, res) =>{
        try
        {
        const result= await course_model.find({admin_id:req.params.id})
        res.status(200).json({ success: true, result:result})
    }
          catch(err){
              res.status(501).json({ success: false, result: err})
          }
        },

    start_session: async (req, res) => {
        try{
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              }
            var code=Math.floor(100000 + Math.random() * 900000)
            var id= mongoose.Types.ObjectId(req.params.id)
            await course_model.findByIdAndUpdate(id, {$set:{session:code,"attendance.$[].marked":false}})
            await course_model.findByIdAndUpdate(id, {$inc:{sessioncount:1}})
            res.status(200).json({ success: true, result:code})
            await sleep(50000)
            await course_model.findByIdAndUpdate(id, {$set:{session:0}})
    }
      catch(err) {
          res.status(501).json({ success: false, result: err})
      }
    },


    delete: async (req,res)=> {
        try{
            var id= mongoose.Types.ObjectId(req.params.id)
            const result=await course_model.findByIdAndDelete(id)
            res.status(200).json({ success: true, result: result})
        }
          catch(err){
              res.status(501).json({ success: false, result: err})
        }
        },

    course_home: async (req,res)=> {
      try{
        var c_id= mongoose.Types.ObjectId(req.params.id)
        const all  = await course_model.find({_id:c_id})
        result={}
        var name_arr=[]
        var roll_arr=[]
        var attendance_arr=[]
        for(i in all[0].attendance)
        {
          const stud=await student_model.find({_id:all[0].attendance[i].Id})
          roll_arr.push(stud[0].rollNumber)
          name_arr.push(all[0].attendance[i].name)
          attendance_arr.push(Math.floor(((all[0].attendance[i].attendance)/(all[0].sessioncount))))
        }
          res.status(200).json({name:name_arr,
                                roll:roll_arr,
                                attendance:attendance_arr})
      }
      catch(err){
          res.status(501).json({ success: false, result: err})
    }
    },

}