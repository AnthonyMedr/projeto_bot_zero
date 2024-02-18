import {join} from 'path'
import {readdir, unlink} from 'fs'

async function CleanCache(){
    const path = join(__dirname, '..', '..', 'temp', '/')
    readdir(path, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          unlink(join(path, file), (err) => {
            if (err) throw err;
          });
        }
      });
}

function findMostSimilarString(originalString: string, stringsToCompare: string[]): string | null {
  let minDistance = Number.MAX_SAFE_INTEGER;
  let mostSimilarString: string | null = null;

  for (const comparedString of stringsToCompare) {
    const distance = calculateLevenshteinDistance(originalString, comparedString);
    if (distance < minDistance) {
      minDistance = distance;
      mostSimilarString = comparedString;
    }
  }
  return mostSimilarString;
}

function ChangeString(str: string, palavras: string[], substituicao: string): string {
  let resultado = str;
  for (const palavra of palavras) {
    resultado = resultado.replace(palavra, substituicao);
  }

  return resultado;
}

function calculateLevenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const dp: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    dp[i] = [];
    dp[i][0] = i;
  }

  for (let j = 0; j <= len2; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // Deletion 
        dp[i][j - 1] + 1, // Insertion
        dp[i - 1][j - 1] + cost // Substitution
      );
    }
  }

  return dp[len1][len2];
}

function extractLinks(text:string){
  const regex = /(?:https?:\/\/)?(?:www\.)?\w+\.[a-zA-Z]{2,3}(?:\/\S*)?/g;
  return text.match(regex) || [];
};

export {
    CleanCache,
    findMostSimilarString,
    ChangeString,
    extractLinks
}