const Product = require('../models/productsModel');

const getAllProductsStatic = async (req, res) => {
  const products  = await Product.find({price:{$gt: 30}})
  .sort('price name')
  .select('name price')
  // .limit(8)
  // .skip(1)
  res.status(200).json({products, nbHits: products.length})
}

const getAllProducts = async (req, res) => {

  const {featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {}

  if(featured){
    // Tenary Operator to specify the value of featured i.e if featured is set to true in query params, it is set to true. else its set to false
    // condition ? exprIfTrue : exprIfFalse

    queryObject.featured = featured === 'true'? true : false
  }

  if (company) {
    queryObject.company = company;
  }

  // Name
  if (name) {
    // MongoDB regex command the 'i' stands for the case insensitive
    queryObject.name = {$regex: name, $options: 'i'};
  }

  // numericFilters

  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '<': '$lt',
      '=': '$eq',
      '>=': '$gte',
      '<=': '$lte'
    }
    const regEx = /\b(<|>|>=|=|<|<=)\b/g
    let filters = numericFilters.replace(
      regEx,
     (match)=> `-${operatorMap[match]}-`)

     const options = ['price','rating'];
     filters = filters.split(',').forEach(item => {
      //  split based on hyphen used in regex
       const [field, operator, value] = item.split('-')

       if (options.includes(field)) {
         queryObject[field] = {[operator]: Number(value)}
       }
     });

     console.log(filters);
  }

  let result = Product.find(queryObject)

  // Sort Functionality
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList)
  }
  else{
    result = result.sort('createdAt');
  }

  // Selecting Certain Fields

  if (fields) {
    const selectList = fields.split(',').join(' ');
    result = result.select(selectList)
  }

  // Setting Limits
  // if (limit) {
  //   result = result.limit(limit)

  // } else {
    
  // }

  // Skipping, Limit and Page Functionality
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  console.log(req.query);
  console.log(queryObject);


  const products = await result
  res.status(200).json({products, nbHits: products.length})
}

module.exports = {
  getAllProducts,
  getAllProductsStatic
};
