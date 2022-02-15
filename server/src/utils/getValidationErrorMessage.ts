import { ValidationError } from 'class-validator'

const getMessage = (err: ValidationError[]) => {
  const errMessages = err
    .map((e) => {
      let msgs = []
      for (let field in e.constraints) {
        msgs.push(
          e.constraints[field].slice(0, 1).toUpperCase() +
            e.constraints[field].slice(1)
        )
      }
      return msgs.join('. ')
    })
    .join('. ')
  return errMessages
}

export default getMessage
