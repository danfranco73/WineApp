// creo los path absolutos para que no haya problemas con el path de los archivos estáticos
// tener en cuenta que este archivo esta dentro de scr/services/utils

/* import path from 'path';
import {fileURLToPath} from 'url'; // to make it work in nodejs
import {dirname} from 'path';  // to make it work in nodejs

/* const __dirname = path.resolve("src/dao/files/logs");


// creo un path para la raiz antes de public
const __newDirname = path.resolve("./public");

export { __dirname, __newDirname }; 

const __filename = fileURLToPath(import.meta.url); // to make it work in nodejs
const __dirname = dirname(__filename); // to make it work in nodejs

export { __dirname, __filename }; */

// creo un path absoluto desde la raiz de mi proyecto

import path from 'path';

const __dirname = path.resolve();

export { __dirname };


