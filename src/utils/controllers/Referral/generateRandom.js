import findCodeByValue from './findCodeByValue'

function generateRandom(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

const generateUniqueCode = async () => {
  const code = generateRandom(8) // génère un code de parrainage aléatoire
  const existingCode = await findCodeByValue(code) // vérifie si le code existe déjà dans la base de données
  if (existingCode) {
    // si le code existe, on génère un nouveau code
    return generateUniqueCode()
  }

  // si le code n'existe pas, on le retourne
  return code
}

export default generateUniqueCode
