import generateUniqueCode from './generateRandom'
import findCodeByValue from './findCodeByValue'

async function generateUniqueReferralCode() {
  const code = generateUniqueCode() // génère un code de parrainage aléatoire
  const existingCode = await findCodeByValue(code) // vérifie si le code existe déjà dans la base de données
  if (existingCode) {
    // si le code existe, on génère un nouveau code
    return generateUniqueCode()
  }

  // si le code n'existe pas, on le retourne

  return code
}

export default generateUniqueReferralCode
