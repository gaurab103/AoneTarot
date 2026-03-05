// Production env - loaded at runtime. Keep repo private.
module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:Trishala369%40%21@db.aorpwpimbtsrckctofbr.supabase.co:5432/postgres?sslmode=require',
  JWT_SECRET: process.env.JWT_SECRET || 'KSnFjqRYCsTNZRSAFaoUkCbLuEsYCqWj1K/0zTK70z4=',
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || 'AQqfMagZqPFIRoaZzKXpi6zppoTixFnbc3vY8RfULQlWPrfO9-aJphGQXXHoNGvbzbZh7RA0ZAefnhFa',
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || 'EMEH1bzIhcPLkucWaAIXZTb1wmqBRNe7Y7hGvwPKAOcysP8AAlr1dTL8XTIWdDlLV02UED5vA2D4FSAB',
  PAYPAL_LIVE: process.env.PAYPAL_LIVE || 'false',
};
