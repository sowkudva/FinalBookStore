import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  // take token from header
  const header = req.headers['auth']
  const token = header && header.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'token required' })
  }

  try {
    const decoded = jwt.verify(token, 'bookstore123') // secret
    req.user = decoded // this will be available for future requests
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or Expired Token' })
  }
}

export const extractClaims = (authClaims) => {
  const claims = authClaims.reduce((acc, claim) => {
    return { ...acc, ...claim }
  }, {})
  return {
    userId: claims.id,
    userName: claims.name,
    userRole: claims.role,
  }
}
