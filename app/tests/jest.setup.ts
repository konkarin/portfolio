const env = require(`../../env/${process.env.NODE_ENV}`)

process.env = { ...env }
