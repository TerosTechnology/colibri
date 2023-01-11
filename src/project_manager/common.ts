// Copyright 2022
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
//
// This file is part of colibri2
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with colibri2.  If not, see <https://www.gnu.org/licenses/>.

/** Type of parameter */
export enum e_file_type {
    CMDLINEARG = "cmdlinearg",
    GENERIC = "generic",
    PLUSARG = "plusarg",
    VLOGPARAM = "vlogparam",
    VLOGDEFINE = "vlogdefine"
}

/** Result of action execution in the project manager*/
export type t_action_result = {
    result: any;
    successful: boolean;
    msg: string;
}

/** Project file reduced*/
export type t_file_reduced = {
    /** File name with (absolute or relative) path */
    name: string;
    /** Indicates if this file should be treated as an include file (default false) */
    is_include_file: boolean;
    /** When is_include_file is true, the directory containing the file will be 
     * added to the include path. include_path allows setting an explicit directory to use instead */
    include_path: string;
    /** Logical name (e.g. VHDL/SystemVerilog library) of the file */
    logical_name: string;
}

/** Project file */
export type t_file = {
    /** File name with (absolute or relative) path */
    name: string;
    /** File type */
    file_type: string;
    /** Indicates if this file should be treated as an include file (default false) */
    is_include_file: boolean;
    /** When is_include_file is true, the directory containing the file will be 
     * added to the include path. include_path allows setting an explicit directory to use instead */
    include_path: string;
    /** Logical name (e.g. VHDL/SystemVerilog library) of the file */
    logical_name: string;
}

/** Script */
export type t_script = {
    /** User-friendly name of the script */
    name: string;
    /** Command to execute */
    cmd: string[];
    /** Additional environment variables to set before launching script */
    env: boolean;
}

/** Stages and scripts */
export type t_stage_script = {
    /** Executed before calling build */
    pre_build: t_script[];
    /** Executed after calling build */
    post_build: t_script[];
    /** Executed before calling run */
    pre_run: t_script[];
    /** Executed after calling run */
    post_run: t_script[];
}

/** Script stage */
export enum e_script_stage {
    PRE_BUILD = "pre_build",
    POST_BUILD = "post_build",
    PRE_RUN = "pre_run",
    POST_RUN = "post_run",
}

/** Each Vpi object contains information on how to build the corresponding VPI library */
export type t_vpi = {
    /** Extra include directories */
    include_dirs: string[];
    /** Extra libraries */
    libs: string[];
    /** Name of VPI library */
    name: string;
    /** Source files for VPI library */
    src_files: string[];
}

/** Type of parameter */
export enum e_parameter_type {
    CMDLINEARG = "cmdlinearg",
    GENERIC = "generic",
    PLUSARG = "plusarg",
    VLOGPARAM = "vlogparam",
    VLOGDEFINE = "vlogdefine"
}

/** Data type of the parameter */
export enum e_parameter_data_type {
    BOOL = "bool",
    FILE = "file",
    INT = "int",
    STR = "str",
}

/** A parameter is used for build- and run-time parameters, such as Verilog plusargs, VHDL generics, 
 * Verilog defines, Verilog parameters or any extra command-line options that should be sent to the 
 * simulation model. Different tools support different subsets of parameters. The list below 
 * describes valid parameter types */
export type t_parameter = {
    /** Data type of the parameter. Valid values are bool, file, int, str. file is similar 
     * to str, but the value is treated as a path and converted to an absolute path */
    datatype: e_parameter_data_type;
    /** Default value to use if user does not provide a value during the configure or run stages */
    default: string;
    /** User-friendly description of the parameter */
    description: string;
    /** Type of parameter. Valid values are cmdlinearg, generic, plusarg, vlogparam, vlogdefine */
    paramtype: e_parameter_type;
}