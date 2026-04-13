require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req,res)=>res.json({ok:true}));

app.post('/api/poynt/sale', async (req,res)=>{
  try{
    const {amount, referenceId, note} = req.body;

    const response = await axios.post('https://services.poynt.net/cloudMessages',{
      ttl:30,
      businessId:process.env.POYNT_BUSINESS_ID,
      storeId:process.env.POYNT_STORE_ID,
      deviceId:process.env.POYNT_DEVICE_ID,
      data: JSON.stringify({
        callbackUrl: process.env.POYNT_CALLBACK_URL,
        payment: JSON.stringify({
          amount,
          currency: process.env.POYNT_CURRENCY,
          referenceId,
          note
        })
      })
    },{
      headers:{
        "Authorization":`Bearer ${process.env.POYNT_ACCESS_TOKEN}`,
        "Api-Version":process.env.POYNT_API_VERSION
      }
    });

    res.json({ok:true, data:response.data});
  }catch(e){
    res.status(500).json({ok:false, error:e.message});
  }
});

app.listen(process.env.PORT || 10000, ()=>console.log("Server running"));
