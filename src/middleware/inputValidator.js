import Joi from 'joi'

const userSchema = Joi.object( {
    name: Joi.string().min(3).max(255).required(), // Matches VARCHAR constraint
    age: Joi.number().integer().min(0).max(150).required(), // Ensures valid age
    address: Joi.object().optional(), // JSONB field (must be an object)
    additional_info: Joi.object().optional(),
} )

export const validateSchema = (req , res , next) => {
    const {error} = userSchema.validate(req.body)

    if(error) {
       return res.status(400).json({
          status : 400,
          message : error.details[0].message
       })
    }

    next()
}