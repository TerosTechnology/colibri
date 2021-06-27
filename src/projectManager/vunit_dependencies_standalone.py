# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2014-2020, Lars Asplund lars.anders.asplund@gmail.com

# pylint: disable=too-many-lines

"""
Test the project functionality
"""
# from graphviz import Digraph
import ntpath
import json
from pathlib import Path
import sys
import os

import vunit.project as pj
from vunit.vhdl_standard import VHDL


def get_direct_dependencies(project):
    dependency_graph = project.create_dependency_graph(True)
    files = project.get_source_files_in_order()
    dependencies = []
    for i in range(0, len(files)):
        dependency_local = []
        dependency = dependency_graph.get_direct_dependencies(files[i])
        for dep in dependency:
            dependency_local.append(str(dep.name))
        dependencies.append(dependency_local)
    return files, dependencies


prj = sys.argv[1]
f = open(prj,)
json_prj = json.load(f)

project_sources = json_prj['files']
project = pj.Project()
libraries = []

for i in range(0, len(project_sources)):
    file_name = project_sources[i]['name']
    file_library = 'src_lib_teroshdl'

    if 'logic_name' in project_sources[i]:
        file_library = project_sources[i]['logic_name']

    if file_library in libraries:
        pass
    else:
        project.add_library(file_library, "work_path")
        libraries.append(file_library)

    suffix = Path(file_name).suffix
    if (suffix == ".v" or suffix == ".vh" or suffix == ".vl"):
        filetype = "verilog"
    elif (suffix == ".sv" or suffix == ".svh"):
        filetype = "systemverilog"
    else:
        filetype = "vhdl"
    project.add_source_file(
        file_name, file_library, file_type=filetype, vhdl_standard=VHDL.STD_2008)

try:
    files, dependencies = get_direct_dependencies(project)
except:
    pass

nodes = []
complete_nodes = []
for i in range(0, len(files)):
    complete_nodes.append(files[i].name)
    name = ntpath.basename(files[i].name)
    if (len(files[i].design_units) >= 1):
        name = files[i].design_units[0].name
    nodes.append(name)

total_dependencies = []
for i in range(0, len(nodes)):
    inst_mod = {'filename': complete_nodes[i], 'entity': nodes[i], 'dependencies': dependencies[i]}
    total_dependencies.append(inst_mod)

json_dependencies = {'root': total_dependencies}

dir_path = os.path.dirname(os.path.realpath(__file__))
output_path = os.path.join(dir_path, 'tree_graph_output.json')
with open(output_path, 'w') as outfile:
    json.dump(json_dependencies, outfile)
exit(0)
