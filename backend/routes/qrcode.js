const express = require('express');
const router = express.Router();
const pool = require('../db')


router.post('/generate',async(req , res) => {
  try {
    const { roll, laptop, books } = req.body

    // We need to encode here please 

    const response = {roll , laptop , books};
    res.status(200).json(response)
  } catch (error) {
    res.status(500).json({message:"Failed to respond during gen"});
  }
})


router.post('/scan' , async(req , res)=>{

  // decode here please 

  try {
    const {roll , laptop , books} = req.body
    


  } catch (error) {
    
  }


})

