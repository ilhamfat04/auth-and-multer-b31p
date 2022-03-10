// import model here
const { user } = require('../../models')

// import package here
const Joi = require('joi')

exports.register = async (req, res) => {
  // code here
  try {
    const data = req.body

    const schema = Joi.object({
      name: Joi.string().min(5).required(),
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(5).required(),
      status: Joi.string().required(),
    })

    const { error } = schema.validate(data)

    if (error) {
      console.log(error);
      return res.status(400).send({
        status: "Bad Request",
        message: error.details[0].message,
      })
    }

    const newData = await user.create({
      name: data.name,
      email: data.email,
      password: data.password,
      status: "seller"
    })

    res.status(201).send({
      status: 'success',
      data: {
        name: newData.name,
        email: newData.email,
      }
    })

  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "Bad Request",
      message: error.details[0].message,
    });
  }
};

exports.login = async (req, res) => {
  // code here
  try {
    const data = req.body

    const schema = Joi.object({
      email: Joi.string().email().min(6).required(),
      password: Joi.string().min(5).required()
    })

    const { error } = schema.validate(data)

    if (error) {
      console.log(error);
      return res.status(400).send({
        status: "Bad Request",
        message: error.details[0].message,
      })
    }

    const userExist = await user.findOne({
      where: {
        email: data.email,
        password: data.password
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    })

    if (!userExist) {
      return res.status(400).send({
        status: "bad request",
        message: 'credential is invalid'
      })
    }

    res.status(200).send({
      status: "success",
      data: {
        name: userExist.name,
        email: userExist.email,
      }
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Internal Server Error",
      message: error.details[0].message,
    });
  }
};
