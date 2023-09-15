export const asyncHandler = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch((err) => {
      console.log(err)
      return next(new Error('Fail', { cause: 500 }))
    })
  }
}

export const globalResponse = (err, req, res, next) => {
  if (err) {
    console.log(req.validationErrors)
    if (req.validationErrors) {
      return res
        .status(err['cause'] || 500)
        .json({ error: req.validationErrors })
    }
    return res.status(err['cause'] || 500).json({ message: err.message })
  }
}

