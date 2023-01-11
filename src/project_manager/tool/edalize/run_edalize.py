import shutil
import json
import sys
from distutils.spawn import find_executable
import os
import platform
import subprocess
import edalize

def print_info(working_directory, debug_mode, edam_file, config_exec_file):
    print("")
    print("************************************************************************************************")
    print(f"---> Build directory: {working_directory}")
    if (debug_mode == 'developer'):
        current_cmd = str(os.path.basename(__file__))
        print(f"---> Command: {current_cmd} {edam_file} {config_exec_file}")

################################################################################
# Arguments
################################################################################
# Path to edam file
edam_file = sys.argv[1]
# Path to execution config file
config_exec_file = sys.argv[2]

################################################################################
# Read config
################################################################################
f = open(config_exec_file,)
config_exec = json.load(f)

# Tool name
tool_name = config_exec['tool_name']
# Tool installation path
installation_path = config_exec['installation_path']
# Execution mode
execution_mode = config_exec['execution_mode']
# Debug mode
debug_mode = config_exec['debug_mode']
# Waveform viewer
waveform_viewer = config_exec['waveform_viewer']
# Working directory
working_directory = config_exec['working_directory']

################################################################################
# Configure project
################################################################################
print_info(working_directory,debug_mode, edam_file, config_exec_file)

################################################################################
# Setup
################################################################################
makefile_path = os.path.join(working_directory, 'Makefile')
# Setup working directory
try:
    if (os.path.isdir(working_directory) == True):
        shutil.rmtree(working_directory)
except Exception as e:
    pass
os.makedirs(working_directory)

# Configure installation path
if (installation_path != ''):
    # Check if installation path exists
    check_dir = os.path.isdir(installation_path)
    if (check_dir == True):
        plt = platform.system()
        if (plt.lower() == "windows"):
            os.environ['PATH'] += f";{installation_path}"
        else:
            os.environ['PATH'] += f":{installation_path}"
    else:
        print(f"---> Installation folder path: {installation_path} doesn't exists. It will search in the system path!!")

# Configure ModelSim variables
if (tool_name == 'modelsim'):
    vsim_path = find_executable("vsim")
    if (vsim_path == None):
        print('---> Error ModelSim path is not configured!')
        exit(-1)
    vsim_dir = os.path.dirname(vsim_path).replace("\\", "/")
    os.environ["MODEL_TECH"] = vsim_dir
    print(vsim_dir)

################################################################################
# Configure project
################################################################################
f = open(edam_file,)
edam = json.load(f)
backend = edalize.get_edatool(tool_name)(edam=edam, work_root=working_directory)

################################################################################
# Configure GUI support
################################################################################
build_gui_tools = ['vivado', 'trellis', 'apicula', 'icestorm', 'nextpnr']
simulator_gui_tools = ['modelsim', 'xsim', 'isum', 'spyglass', 'xcelium', 'trellis']
try:
    backend.configure()
    if (execution_mode == 'gui' and (tool_name in build_gui_tools)):
        p = subprocess.Popen(['make', 'build-gui'], cwd=working_directory)
        p.wait()
    elif (execution_mode == 'gui' and (tool_name in simulator_gui_tools)):
        if (tool_name == 'modelsim' and waveform_viewer != 'tool'):
            run_gui_external = "\
run-gui-external: work $(VPI_MODULES)\n\
	$(VSIM) -do \"vcd file waveform.vcd;vcd add -r *;run -all;quit -code [expr [coverage attribute -name TESTSTATUS -concise] >= 2 ? [coverage attribute -name TESTSTATUS -concise] : 0]; exit\" -c $(addprefix -pli ,$(VPI_MODULES)) $(EXTRA_OPTIONS) $(TOPLEVEL)\
"
            make_file = open(makefile_path, "a")
            make_file.write(run_gui_external)
            make_file.close()
            p = subprocess.Popen(['make', 'run-gui-external'], cwd=working_directory)
            p.wait()
        else:
            p = subprocess.Popen(['make', 'run-gui'], cwd=working_directory)
            p.wait()
    else:
        backend.build()
        backend.run()

except Exception as e:
    if (debug_mode == "developer"):
        print('Error: ' + str(e))
    exit(-1)
