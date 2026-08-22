/**
 * Escribe un secreto en .env.local sin que aparezca en pantalla, en el
 * historial del shell, ni en la conversación con Claude.
 *
 * Uso:
 *   node scripts/set-secret.mjs SMTP_PASS
 *   node scripts/set-secret.mjs RESEND_API_KEY
 *
 * Pide el valor por teclado con la entrada oculta y lo guarda en la variable
 * indicada, respetando el resto del fichero. Si la variable no existe, la añade
 * al final.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = resolve(__dirname, '../.env.local');

const key = process.argv[2];

if (!key || !/^[A-Z][A-Z0-9_]*$/.test(key)) {
  console.error('Uso: node scripts/set-secret.mjs NOMBRE_DE_LA_VARIABLE');
  console.error('Ej.: node scripts/set-secret.mjs SMTP_PASS');
  process.exit(1);
}

if (!existsSync(ENV_PATH)) {
  console.error(`No existe ${ENV_PATH}`);
  process.exit(1);
}

/** Lee una línea sin mostrar lo que se teclea. */
function promptHidden(question) {
  return new Promise((resolveInput) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    // Silencia el eco de los caracteres tecleados
    const onData = (char) => {
      if (['\n', '\r', ''].includes(char.toString())) {
        process.stdin.removeListener('data', onData);
      } else {
        readline.moveCursor(process.stdout, -1000, 0);
        readline.clearLine(process.stdout, 1);
        process.stdout.write(question);
      }
    };

    process.stdin.on('data', onData);

    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolveInput(answer);
    });
  });
}

const value = (await promptHidden(`Valor para ${key} (no se mostrará): `)).trim();

if (!value) {
  console.error('Valor vacío — no se ha cambiado nada.');
  process.exit(1);
}

let content = readFileSync(ENV_PATH, 'utf-8');
const pattern = new RegExp(`^${key}=.*$`, 'm');

if (pattern.test(content)) {
  content = content.replace(pattern, `${key}=${value}`);
  console.log(`✅ ${key} actualizada en .env.local`);
} else {
  content = content.replace(/\n*$/, '\n') + `${key}=${value}\n`;
  console.log(`✅ ${key} añadida al final de .env.local`);
}

writeFileSync(ENV_PATH, content, 'utf-8');

console.log(`   Longitud del valor: ${value.length} caracteres`);
console.log('   El valor no se ha mostrado ni queda en el historial del shell.');
