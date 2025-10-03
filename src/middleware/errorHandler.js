const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    const message = err.errors.map(error => error.message).join(', ');
    return res.status(400).json({
      success: false,
      message,
      type: 'validation_error'
    });
  }

  // Sequelize Unique Constraint Error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry found',
      type: 'duplicate_error'
    });
  }

  // Sequelize Foreign Key Constraint Error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid reference to related record',
      type: 'foreign_key_error'
    });
  }

  // Custom application errors
  if (err.message === 'Meeting room not found' || 
      err.message === 'Participant not found in this room') {
    return res.status(404).json({
      success: false,
      message: err.message,
      type: 'not_found_error'
    });
  }

  // Default to 500 server error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    type: 'server_error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;