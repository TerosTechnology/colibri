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

import project as pj
from source import SourceFile, SourceFileList, simplify_path
from vunit.vhdl_standard import VHDL, VHDLStandard
import sys

files_string = sys.argv[1]
files = files_string.split(',')

project = pj.Project()
project.add_library("src_lib", "work_path")
for i in range(0, len(files)):
    suffix = Path(files[i]).suffix
    if (suffix == ".v" or suffix == ".vh" or suffix == ".vl"):
        filetype = "verilog"
    elif (suffix == ".sv" or suffix == ".svh"):
        filetype = "systemverilog"
    else:
        filetype = "vhdl"
    project.add_source_file(
        files[i], "src_lib", file_type=filetype, vhdl_standard=VHDL.STD_2008)

files, dependencies = project.get_direct_dependencies()

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

print(dependencies)

# Add edge node
for i in range(0, len(dependencies)):
    for j in range(0, len(dependencies[i])):
        if (str(complete_nodes[i]) != str(dependencies[i][j])):
            diagram += '    "' + \
                str(complete_nodes[i]) + '" -> "' + \
                str(dependencies[i][j]) + '"\n'
diagram += '}'
print(diagram)
