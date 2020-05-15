# -*- coding: utf-8 -*-
from os.path import join , dirname, abspath
import subprocess
from vunit.sim_if.ghdl import GHDLInterface
from vunit.sim_if.factory import SIMULATOR_FACTORY
from vunit   import VUnit, VUnitCLI

################################################################################

################################################################################
#Check simulator.
print ("=============================================")
simname = SIMULATOR_FACTORY.select_simulator().name
code_coverage = (simname == "ghdl" and \
                (GHDLInterface.determine_backend("")=="gcc" or  \
                GHDLInterface.determine_backend("")=="GCC"))
print ("Simulator = " + simname)
print ("=============================================")

################################################################################
#VUnit instance.
ui = VUnit.from_argv()

#Add module sources.
test_1_src_lib = ui.add_library("src_lib")
test_1_src_lib.add_source_files("exampleRunpy_1.vhd")

#Add tb sources.
test_1_tb_lib = ui.add_library("tb_lib")
test_1_tb_lib.add_source_files("tbVhdlVunitRunpy.vhd")

################################################################################
#Simulators flags.
if(code_coverage == True):
    test_1_src_lib.add_compile_option   ("ghdl.flags"     , [  "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules"])
    test_1_tb_lib.add_compile_option    ("ghdl.flags"     , [  "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules"])
    ui.set_sim_option("ghdl.elab_flags", [ "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules"])
else:
    test_1_src_lib.add_compile_option   ("ghdl.flags"     , [  "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules"])
    test_1_tb_lib.add_compile_option    ("ghdl.flags"     , [  "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules"])
    ui.set_sim_option("ghdl.elab_flags", [ "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules"])

################################################################################
def post_run_fcn(results):
    if(code_coverage == True ):
        subprocess.call(["lcov", "--capture", "--directory", "exampleRunpy_1.gcda", "--output-file",  "code_0.info" ])
        subprocess.call(["genhtml","code_0.info","--output-directory", "./coverage"])

################################################################################
#Run tests.
ui.main(post_run=post_run_fcn)
