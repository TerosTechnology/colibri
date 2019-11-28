# -*- coding: utf-8 -*-
from os.path import join , dirname, abspath
import subprocess
from vunit.ghdl_interface import GHDLInterface
from vunit.simulator_factory import SIMULATOR_FACTORY
from vunit   import VUnit, VUnitCLI

##############################################################################

#Check simulator.
print ("=============================================")
simulator_class = SIMULATOR_FACTORY.select_simulator()
simname = simulator_class.name
print (simname)
print ("=============================================")

#Check GHDL backend.
code_coverage=False
try:
    if( GHDLInterface.determine_backend("")=="gcc" or  GHDLInterface.determine_backend("")=="GCC"):
      code_coverage=True
    else:
      code_coverage=False
except:
    print("")

##############################################################################

#VUnit instance.
ui = VUnit.from_argv()

##############################################################################

#Add module sources.
test_1_src_lib = ui.add_library("src_lib")
test_1_src_lib.add_source_files("examples/vhdl/exampleRunpy_1.vhd")

#Add tb sources.
test_1_tb_lib = ui.add_library("tb_lib")
test_1_tb_lib.add_source_files("examples/vhdl/tbVhdlVunitRunpy.vhd")

##############################################################################

#Simulators flags.
if(code_coverage==True):
    test_1_src_lib.add_compile_option   ("ghdl.flags"     , [  "-fprofile-arcs","-ftest-coverage" ])
    test_1_tb_lib.add_compile_option    ("ghdl.flags"     , [  "-fprofile-arcs","-ftest-coverage" ])
    ui.set_sim_option("ghdl.elab_flags"      , [ "-Wl,-lgcov" ])

#Run tests.
try:
    ui.main()
except SystemExit as exc:
    all_ok = exc.code == 0

#Code coverage.
if all_ok:
    if(code_coverage==True):
        subprocess.call(["lcov", "--capture", "--directory", "exampleRunpy_1.gcda", "--output-file",  "code_0.info" ])
        subprocess.call(["genhtml","code_0.info","--output-directory", "covHtml"])
    else:
        exit(0)
else:
    exit(1)
