const express = require('express')
const app = express()
const port = 3001

const merchant_model = require('./merchantModel')

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/', (req, res) => {
  merchant_model.getMerchants()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send('Error fetching merchants: ' + error.message);
  })
})

app.post('/merchants', (req, res) => {
  console.log("req.body", req.body);
  merchant_model.createMerchant(req.body)
  .then(response => {
    const successMessage = `Merchant "${req.body.name}" has been successfully added.`;
    res.status(201).send(successMessage);
  })
  .catch(error => {
    res.status(500).send('Error adding merchant: ' + error.message);
  });
});


app.delete('/merchants/:id', (req, res) => {
  merchant_model.deleteMerchant(req.params.id)
  .then(response => {
    res.status(200).send('Merchant with ID ' + req.params.id + ' has been deleted successfully.');
  })
  .catch(error => {
    res.status(500).send('Error deleting merchant: ' + error.message);
  })
})

app.put("/merchants/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  merchant_model
    .updateMerchant(id, body)
    .then((response) => {
      res.status(200).send('Merchant with ID ' + id + ' has been updated successfully.');
    })
    .catch((error) => {
      res.status(500).send('Error updating merchant: ' + error.message);
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})