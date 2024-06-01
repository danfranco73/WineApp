// creo los path absolutos para que no haya problemas con el path de los archivos estáticos
// tener en cuenta que este archivo esta dentro de scr/services/utils

import path from "path";
const __dirname = path.resolve();
export default __dirname;

