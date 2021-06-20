![Tests](https://github.com/TerosTechnology/colibri/workflows/Linux/badge.svg?event=push)
![Tests](https://github.com/TerosTechnology/colibri/workflows/Macos/badge.svg?event=push)
![Tests](https://github.com/TerosTechnology/colibri/workflows/Windows/badge.svg?event=push)
![Test_unit_suites](https://github.com/TerosTechnology/colibri/workflows/Test_unit_suites/badge.svg?event=push)


# TerosHDL backend

## Documenter CI

- Installation:

```
sudo npm install -g .
```
- Commands
```
-f, --file [path]', Path of the YML file for documenter
-e, --edam [path]', Path of the EDAM yml file for documenter
-o, --out [type]', Documentation format: md, html
--dep, --dep', Include dependency graph in the documentation ['none', 'all', 'only_commented']
--fsm, --fsm', Include finite state machines in the documentation ['none', 'all', 'only_commented']
-s, --signals , Include signals/regs/wires in the documentation ['none', 'all', 'only_commented']
-c, --constants , Include constants/types in the documentation ['none', 'all', 'only_commented']
-p, --process , Include process/always in the documentation ['none', 'all', 'only_commented']
--sym-verilog, --symbol_verilog , Special character to parse comments into documentation
--sym-vhdl, --symbol_vhdl , Special character to parse comments into documentation
--pypath, --python_path , Explicit python path
--outpath, --outpath , Explicit outputh documentation path
--self, --self_contained , Documentation generated in a single file for html output
```

### Documenter examples:

**Documenter with yml file**
```
cd /bin/example
teroshdl-hdl-documenter -f example.yml
```

**Documenter with teros project manager file or EDAM file**

Documentation will be generated in `./built_doc`
```
cd /bin/example
teroshdl-hdl-documenter -e example_edam.yml 
teroshdl-hdl-documenter -e example_edam.yml -o html 
```


## Third-party

The `s3sv` formatter is taken from the [SystemVerilog](https://www.github.com/TheClams/SystemVerilog) project. 
See informations about license and changes if any in the corresponding folder `src/formatter/bin/s3sv`.


