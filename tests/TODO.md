# More tests
## Parser
- Diferentes versiones de puertos ANSI y no ANSI.
- State machines.
- Interfaces en entity y package.
## Documenter
- Documenter section test fsm
- Documenter section test custom section
- En documenter revisar todos el svg_path
- Test completos del documenter con casos de prueba





# Bugs
## Linter 
- GHDL linter falla cuando la descripción tiene ":"
```
/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0.vhd:13:19:error: ':' is expected instead of ';'
/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0.vhd:13:19:error: type mark expected in a subtype indication
/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0.vhd:18:1:error: '<=' is expected instead of 'end'
/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0.vhd:18:1:error: primary expression expected
/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0.vhd:16:20:error: ';' expected at end of signal assignment
/home/carlos/repo/colibri2/tests/command/linter/helpers/sample_0.vhd:16:20:error: (found: 'end')
```
- Modelsim linter falla con path con espacio
## Project manager
- Project manager no acepta nombres con espacio?
## Config html
- Que no se rompa según el tamaño de la pantalla





# Features
## Parser
- Itroducir un estado de error en hdl_element
- Doxygen parser debería funcionar con múltiples labels sin que haya un doble \n.
# Templates
- En las templates cuando falla el parser todo continua y se genera una template vacía.
- Custom indent en templates dependiendo del lenguaje.
- Default value para generics con Verilog.
# Documenter
- Mensaje de error en el documentenr si falla el parser
# VSCode
- Project examples como submodulo
- Borrar las carpetas de out de los tests
- Logger para vscode
- console.log en todas las cosas de vscode
- Revisar todos los paths para ficheros para windows
- Comprobar que hay log cuando hay acciones en vscode.
- Comprobar que todo se actualiza cuando cambia la configuración.
- Repasar: 
```
    "activationEvents": [
        "*",
https://code.visualstudio.com/api/references/activation-events#Start-up
```
- Añadir un logger global
# Project manager
- Project documentation
- Schematic con project maanger




(node:157849) [DEP0147] DeprecationWarning: In future versions of Node.js, fs.rmdir(path, { recursive: true }) will be removed. Use fs.rm(path, { recursive: true }) instead
