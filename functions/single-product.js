
require('dotenv').config()
const Airtable = require('airtable-node');
 
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE)
  .table('guitarstore')

  exports.handler = async (event, context) => {
    const {id} = event.queryStringParameters 

    // FLATTEN THE OBJECT
    const flatten = (ob) => {
        let result = {};
        for (const i in ob) {
            if ((typeof ob[i]) === 'object' && !Array.isArray(ob[i])) {
                const temp = flatten(ob[i]);
                for (const j in temp) {
                    result[j] = temp[j];
                }
            }
            else {
                result[i] = ob[i];
            }
        }
        return result;
    };

    if(id){
        try {
            const product = await airtable.retrieve(id)
            if(product.error){
                return {
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    statusCode: 404,
                    body: `No product with id: ${id}`
                }
            }
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                statusCode: 200,
                body: JSON.stringify(flatten(product))
            }
        } catch (error) {
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                statusCode: 500,
                body:  `Server Error`
            }
        }
    }
    return {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        statusCode: 400,
        body:  `Please provide product id`
    }
  }