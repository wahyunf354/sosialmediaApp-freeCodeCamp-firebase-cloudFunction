const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email.match(emailRegEx)) return true
  else return false
}

const isEmpty = (string) => {
  if(string.trim() === '') return true 
  else return false
}

exports.validateSignupData = (data) => {

  let errors = {}

  if(isEmpty(data.email)) errors.email = 'Mush not be empty'
  else if(!isEmail(data.email)) errors.email = 'Mash be a valid email address'
  
  if(isEmpty(data.password)) errors.password = 'Mush not be empty'
  if(isEmpty(data.handle)) errors.handle = 'Mush not be empty'
  if(data.password !== data.confirmPassword) 
    errors.confirmPassword = 'Passwords mush match'

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}

exports.validateLoginData = (data) => {
  let errors = {}
  if (isEmpty(data.email)) errors.email = 'Mush not be empty'
  if (isEmail(data.password)) errors.password = 'Mush not be empty'

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  }
}