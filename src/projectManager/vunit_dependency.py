# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this file,
# You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2014-2020, Lars Asplund lars.anders.asplund@gmail.com

# pylint: disable=too-many-lines

"""
Test the project functionality
"""
from typing import Set, List, TypeVar, Generic, Dict, Mapping, Callable, Iterable
from os.path import join, exists, dirname
import itertools
# from graphviz import Digraph
import ntpath
from fnmatch import fnmatch
from os.path import exists, abspath, join, basename, normpath, dirname
import sys
from pathlib import Path
from vunit.vhdl_standard import VHDL, VHDLStandard
import json

import project as pj
from source import SourceFile, SourceFileList, simplify_path
from vunit.vhdl_standard import VHDL, VHDLStandard
import sys

prj = '/home/carlos/workspace/colibri/src/projectManager/json_project_dependencies.json'
# prj = sys.argv[1]
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
    files, dependencies = project.get_direct_dependencies()
except:
    pass

nodes = []
complete_nodes = []
for i in range(0, len(files)):
    complete_nodes.append(files[i].name)
    name = ntpath.basename(files[i].name)
    nodes.append(name)

# Add nodes
diagram = """
digraph {
    node [color="#069302" fillcolor=lightgray fontname=helvetica shape=component splines=line style="filled,rounded"]
"""
for i in range(0, len(nodes)):
    diagram += '    "' + \
        str(complete_nodes[i]) + '" [label="' + str(nodes[i]) + '"]\n'

# Add edge node
for i in range(0, len(dependencies)):
    for j in range(0, len(dependencies[i])):
        if (str(complete_nodes[i]) != str(dependencies[i][j])):
            diagram += '    "' + \
                str(complete_nodes[i]) + '" -> "' + \
                str(dependencies[i][j]) + '"\n'
diagram += '}'
print(diagram)
exit(0)
