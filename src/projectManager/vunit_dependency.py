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
from graphviz import Digraph
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
for i in range(0,len(files)):
    if (Path(files[i]).suffix == ".v"):
        filetype = "verilog"
    else:
        filetype = "vhdl"
    project.add_source_file(files[i],"src_lib",file_type=filetype,vhdl_standard=VHDL.STD_2008)

def get_implementation_subset(source_files):
    """
    Get the subset of files which are required to successfully
    elaborate the list of input files without any missing
    dependencies.
    :param source_files: A list of :class:`.SourceFile` objects
    :returns: A list of :class:`.SourceFile` objects which is the implementation subset.
    """
    target_files = [
        source_file._source_file  # pylint: disable=protected-access
        for source_file in source_files
    ]
    source_files = project.get_dependencies_in_compile_order(
        target_files, implementation_dependencies=True
    )
    return SourceFileList(
        [
            SourceFile(source_file, project, "src_lib")
            for source_file in source_files
        ]
    )

def get_file_dependencies(source_file):
    """
    Returns a list of file dependencies, based on the compile order
    """
    allow_empty=False
    pattern = source_file
    library_name = None
    results = []
    for source_file in project.get_source_files_in_order():
        if library_name is not None:
            if source_file.library.name != library_name:
                continue
        if not (
            fnmatch(abspath(source_file.name), pattern)
            or fnmatch(simplify_path(source_file.name), pattern)
        ):
            continue
        results.append(SourceFile(source_file, project, "src_lib"))

    ###
    ui_src_file = results
    dependencies = get_implementation_subset(ui_src_file)
    dependency_list = []
    for dependency in dependencies:
        dependency_list.append((dependency._source_file.name))
    return dependency_list

nodes = []
complete_nodes = []
dependencies = []
for i in range(0,len(files)):
    complete_nodes.append(files[i])
    name = ntpath.basename(files[i])
    nodes.append(name)
    dependencies.append(get_file_dependencies(files[i]))

dot = Digraph(node_attr={'color': '#069302', 'style': 'filled,rounded', 'splines':"line",'shape':'component','fillcolor':'lightgray','fontname':"helvetica"})
# Add nodes
diagram = """
digraph {
    node [color="#069302" fillcolor=lightgray fontname=helvetica shape=component splines=line style="filled,rounded"]
"""
for i in range(0,len(nodes)):
    dot.node(complete_nodes[i], nodes[i])
    diagram += '    "' + complete_nodes[i] + '" [label="' + nodes[i] + '"]\n'

# Add edge node
for i in range(0,len(dependencies)):
    for j in range(0,len(dependencies[i])):
        diagram += '    "' + str(complete_nodes[i]) + '" -> "' + str(dependencies[i][j]) + '"\n'
diagram += '}'
print(diagram)
