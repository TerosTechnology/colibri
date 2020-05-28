# -*- coding: utf-8 -*-
from os.path import join , dirname, abspath
import subprocess
from vunit.sim_if.ghdl import GHDLInterface
from vunit.sim_if.factory import SIMULATOR_FACTORY
from vunit   import VUnit, VUnitCLI

################################################################################
#pre_config func
def pre_config_func():
    """
    Before test.
    """
#post_check func
def post_check_func():
    """
    After test.
    """
    def post_check(output_path):
        check = True
        return check
    return post_check

################################################################################
#Check simulator.
print ("=============================================")
simname = SIMULATOR_FACTORY.select_simulator().name
code_coverage = False
if (simname == "modelsim"):
    f= open("modelsim.do","w+")
    f.write("add wave * \nlog -r /*\nvcd file\nvcd add -r /*\n")
    f.close()
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

#func checks
tb_generated = test_1_tb_lib.test_bench("tbVhdlVunitRunpy")
for test in tb_generated.get_tests():
    test.add_config(name="test_alive", pre_config=pre_config_func(),post_check=post_check_func())

################################################################################
#Simulators flags.
if(code_coverage == True):
    test_1_src_lib.add_compile_option   ("ghdl.flags"     , [  "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules","-fprofile-arcs","-ftest-coverage" ])
    test_1_tb_lib.add_compile_option    ("ghdl.flags"     , [  "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules","-fprofile-arcs","-ftest-coverage" ])
    ui.set_sim_option("ghdl.elab_flags", [ "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules","-Wl,-lgcov" ])
else:
    test_1_src_lib.add_compile_option   ("ghdl.flags"     , [  "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules"])
    test_1_tb_lib.add_compile_option    ("ghdl.flags"     , [  "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules"])
    ui.set_sim_option("ghdl.elab_flags", [ "-fexplicit","--ieee=synopsys","--no-vital-checks","-frelaxed-rules"])

ui.set_sim_option("modelsim.init_files.after_load" ,["modelsim.do"])
ui.set_sim_option("disable_ieee_warnings", True)

################################################################################
def post_run_fcn(results):
    if(code_coverage == True ):
        subprocess.call(["lcov", "--capture", "--directory", "exampleRunpy_1.gcda", "--output-file",  "code_0.info" ])
        subprocess.call(["genhtml","code_0.info","--output-directory", "./coverage"])

################################################################################
#Run tests.
ui.main(post_run=post_run_fcn)
