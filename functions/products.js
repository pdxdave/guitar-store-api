require('dotenv').config()
const Airtable = require('airtable-node')

const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE)
  .table('guitarstore')

  exports.handler = async(event, context) => {
    try {
        const {records} = await airtable.list()
        const products = records.map((product) => {
            const {id} = product 
            const {name, brand, type, price, stars, description, features, stock, images, reviews} = product.fields
            const url = images[0].url 
            return {url, id, name, brand, type, price, stars, description, features, stock, images, reviews}
        })
        return {
            headers: {
                'Access-Control-Allow-Origin' : '*'
            },
            statusCode: 200,
            body: JSON.stringify(products)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: 'There was a server error'
        }
    }
}