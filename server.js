const express=require('express');const path=require('path');const crypto=require('crypto');
const app=express();app.disable('x-powered-by');app.use(express.json({limit:'1mb'}));app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public'),{extensions:['html']}));
app.get('/health',(req,res)=>res.json({ok:true,service:'dragon-wear'}));
app.post('/api/payments/initialize',(req,res)=>res.status(501).json({ok:false,error:'Payment initialization is not enabled until a server-side catalog and Paystack secret are configured.'}));
app.post('/api/paystack/webhook',(req,res)=>res.status(200).json({ok:true}));
app.get('/api/orders/:reference',(req,res)=>res.status(404).json({ok:false,error:'Order lookup is not connected to a production database yet.',reference:req.params.reference}));
app.get('/{*splat}',(req,res,next)=>{if(req.path.startsWith('/api/'))return next();res.sendFile(path.join(__dirname,'public','index.html'));});
const port=process.env.PORT||3000;app.listen(port,'0.0.0.0',()=>console.log(`DRAGON WEAR listening on port ${port}`));
