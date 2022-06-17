const express = require('express');
const {Sequelize, DataTypes} =  require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL,{
  dialect: 'postgres',
  dialectOptions:{
    ssl:{
      require:true,
      rejectUnauthorized:false
    }
  }
})

const SensorData = sequelize.define('sensor-data',{
  serial:{
    type:DataTypes.STRING,
    allowNull:false
  },
  name:{
    type:DataTypes.STRING,
    allowNull:false
  },
  temperature:{
    type:DataTypes.FLOAT,
    allowNull:false
  }
})

const app = express();
app.use(express.json());

const dataList = [];

app.get('/data',async (req,res)=>{
  const allData = await SensorData.findAll();
  res.status(200).send(allData);
  return;
})


app.post('/data',async (req,res)=>{
    let data = req.body;
    //dataList.push(data);
    const sensorData = await SensorData.create(data);
    console.log('successfully pushed data into datalist');
    res.status(201).send(sensorData);
    return;
  })

app.listen({port:8080},()=>{
   try{
       sequelize.authenticate();
       console.log('Connected to Database');
       sequelize.sync({alter:true});
       console.log('sync to Database');
   } catch(error){
    console.log('Could not Connected to Database',error);
   }
   console.log('server is running...');
});