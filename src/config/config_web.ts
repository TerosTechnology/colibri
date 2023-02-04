/* eslint-disable max-len */
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

export const WEB_CONFIG = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>

body {
  font-family: 'Open Sans', sans-serif;
  background-color: white;
  color: black;
  
}

h3 {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/*style the items (options), including the selected item:*/
select{
  width:50%;
  padding: 8px 16px;
  cursor: pointer;
  padding-right: 29px;
  margin-top: 8px;
}

input[type='input'] {
  width:60%;
  margin-top: 8px;
  padding: 8px 16px;
  padding-right: 29px;
}

/* Style the sidenav links and the dropdown button */
.dropdown-btn {
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  font-size: 20px;
  display: block;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  outline: none;
  margin-top: 10px;
}
/* Dropdown container (hidden by default). Optional: add a lighter background color and some left padding to change the design of the dropdown content */
.dropdown-container {
  display: none;
  background-color: #ccc;
  padding-left: 8px;
}

/* Fixed sidenav, full height */
.sidenav {
  height: 100%;
  width: 250px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #f1f1f1;
  overflow-x: hidden;
  padding-top: 20px;
  border: 3px solid #ccc;
}

.sidenav a {
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  font-size: 20px;
  display: block;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  outline: none;
}

/* On mouse-over */
.sidenav a:hover {
  background: #fcffd9;
}

.main {
  float: left;
  padding: 0px 12px;
  border: 3px solid #ccc;
  width: 70%;
  border-left: none;
  height: 500px;
  border-left: 20px;
  overflow-y: scroll;

  border-right: 3px solid #ccc;
  margin-left: 300px; /* Same as the width of the sidenav */
  font-size: 20px; /* Increased text to enable scrolling */
  padding: 0px 10px;
  position: absolute;
  top: 0;
  left: 0 !important;
}

/* Add an active class to the active dropdown button */
.active {
  background-color: grey;
  color: white;
}

/* Optional: Style the caret down icon */
.fa-caret-down {
  float: right;
  padding-right: 8px;
}

/* Some media queries for responsiveness */
@media screen and (max-height: 450px) {
  .sidenav {padding-top: 15px;}
  .sidenav a {font-size: 18px;}
}

#div_button {
  height: 200px;
  position: relative;
  margin-top: 520px;
  width: 70%;
  margin-left: 300px;
}

.button {
  border: none;
  color: white;
  padding: 11px 25px;
  text-align: center;
  text-decoration: none;
  font-size: 13px;
  margin: 4px 2px;
  cursor: pointer;
  float: right;
}

#button_load {
  background-color: #B0BEC5; 
  margin-right: 15px;
}

#button_export {
  background-color: #B0BEC5;
}

#button_apply {
  background-color: #4CAF50; 
}

#button_apply_close {
  background-color: #4c7aaf; 
}

#button_cancel {
  background-color: #ff5a31;
}

#button_load:hover { 
    background-color: grey!important;
}

#button_export:hover { 
    background-color: grey!important;
}

#button_apply:hover { 
    background-color: green!important;
}

#button_apply_close:hover { 
    background-color: blue!important;
}

#button_cancel:hover { 
    background-color: red!important;
}

.container {
  display: inline-block;
  cursor: pointer;
  float: right;
}

.bar1,
.bar2,
.bar3 {
  width: 20px;
  height: 3px;
  background-color: #333;
  margin: 2px 0;
  transition: 0.4s;
}

.change .bar1 {
  transform: translate(0, 5px) rotate(-45deg);
}

.change .bar2 {
  opacity: 0;
}

.change .bar3 {
  transform: translate(0, -5px) rotate(45deg);
}

</style>
</head>
<body>

<div class="sidenav">
    <button class="dropdown-btn" onclick="open_submenu_icon(this)">General 
      <div class="container" onclick="open_submenu_icon(this)">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
    </button>
    <div class="dropdown-container">
        <a style="color:black" id="btn-general-general">General</a>
    </div>
    <button class="dropdown-btn" onclick="open_submenu_icon(this)">Documentation 
      <div class="container" onclick="open_submenu_icon(this)">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
    </button>
    <div class="dropdown-container">
        <a style="color:black" id="btn-documentation-general">General</a>
    </div>
    <button class="dropdown-btn" onclick="open_submenu_icon(this)">Editor 
      <div class="container" onclick="open_submenu_icon(this)">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
    </button>
    <div class="dropdown-container">
        <a style="color:black" id="btn-editor-general">General</a>
    </div>
    <button class="dropdown-btn" onclick="open_submenu_icon(this)">Formatter 
      <div class="container" onclick="open_submenu_icon(this)">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
    </button>
    <div class="dropdown-container">
        <a style="color:black" id="btn-formatter-general">General</a>
        <a style="color:black" id="btn-formatter-istyle">iStyle</a>
        <a style="color:black" id="btn-formatter-s3sv">s3sv</a>
        <a style="color:black" id="btn-formatter-verible">Verible</a>
        <a style="color:black" id="btn-formatter-standalone">VHDL standalone</a>
        <a style="color:black" id="btn-formatter-svg">VHDL VSG</a>
    </div>
    <button class="dropdown-btn" onclick="open_submenu_icon(this)">Linter settings 
      <div class="container" onclick="open_submenu_icon(this)">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
    </button>
    <div class="dropdown-container">
        <a style="color:black" id="btn-linter-general">General</a>
        <a style="color:black" id="btn-linter-ghdl">GHDL linter</a>
        <a style="color:black" id="btn-linter-icarus">Icarus linter</a>
        <a style="color:black" id="btn-linter-modelsim">ModelSim linter</a>
        <a style="color:black" id="btn-linter-verible">Verible linter</a>
        <a style="color:black" id="btn-linter-verilator">Verilator linter</a>
        <a style="color:black" id="btn-linter-vivado">Vivado linter</a>
        <a style="color:black" id="btn-linter-vsg">VSG linter</a>
    </div>
    <button class="dropdown-btn" onclick="open_submenu_icon(this)">Schematic viewer 
      <div class="container" onclick="open_submenu_icon(this)">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
    </button>
    <div class="dropdown-container">
        <a style="color:black" id="btn-schematic-general">General</a>
    </div>
    <button class="dropdown-btn" onclick="open_submenu_icon(this)">Templates 
      <div class="container" onclick="open_submenu_icon(this)">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
    </button>
    <div class="dropdown-container">
        <a style="color:black" id="btn-templates-general">General</a>
    </div>
    <button class="dropdown-btn" onclick="open_submenu_icon(this)">Tools 
      <div class="container" onclick="open_submenu_icon(this)">
        <div class="bar1"></div>
        <div class="bar2"></div>
        <div class="bar3"></div>
      </div>
    </button>
    <div class="dropdown-container">
        <a style="color:black" id="btn-tools-general">General</a>
        <a style="color:black" id="btn-tools-osvvm">OSVVM</a>
        <a style="color:black" id="btn-tools-ascenlint">Ascenlint</a>
        <a style="color:black" id="btn-tools-cocotb">Cocotb</a>
        <a style="color:black" id="btn-tools-diamond">Diamond</a>
        <a style="color:black" id="btn-tools-ghdl">GHDL</a>
        <a style="color:black" id="btn-tools-icarus">Icarus</a>
        <a style="color:black" id="btn-tools-icestorm">Icestorm</a>
        <a style="color:black" id="btn-tools-ise">ISE</a>
        <a style="color:black" id="btn-tools-isem">ISIM</a>
        <a style="color:black" id="btn-tools-modelsim">ModelSim</a>
        <a style="color:black" id="btn-tools-morty">Morty</a>
        <a style="color:black" id="btn-tools-quartus">Quartus</a>
        <a style="color:black" id="btn-tools-radiant">Radiant</a>
        <a style="color:black" id="btn-tools-rivierapro">Rivierapro</a>
        <a style="color:black" id="btn-tools-siliconcompiler">SiliconCompiler</a>
        <a style="color:black" id="btn-tools-spyglass">Spyglass</a>
        <a style="color:black" id="btn-tools-symbiyosys">SymbiYosys</a>
        <a style="color:black" id="btn-tools-symbiflow">Symbiflow</a>
        <a style="color:black" id="btn-tools-trellis">Trellis</a>
        <a style="color:black" id="btn-tools-vcs">VCS</a>
        <a style="color:black" id="btn-tools-veriblelint">VeribleLint</a>
        <a style="color:black" id="btn-tools-verilator">Verilator</a>
        <a style="color:black" id="btn-tools-vivado">Vivado</a>
        <a style="color:black" id="btn-tools-vunit">VUnit</a>
        <a style="color:black" id="btn-tools-xcelium">Xcelium</a>
        <a style="color:black" id="btn-tools-xsim">XSIM</a>
        <a style="color:black" id="btn-tools-yosys">Yosys</a>
        <a style="color:black" id="btn-tools-openfpga">OpenFPGA</a>
        <a style="color:black" id="btn-tools-activehdl">Active-HDL</a>
        <a style="color:black" id="btn-tools-nvc">NVC</a>
        <a style="color:black" id="btn-tools-questa">Questa Advanced Simulator</a>
    </div>
</div>

<article class="markdown-body">
  <div id="general-general" class='main'>
    <h3>General: General</h3>
    <hr></hr>
    <p><i></i></p>
    <label>Enable show TerosHDL console with each message.</label>
      <input class='radio-button' id='general-general-logging' type='checkbox'>
      <br><br>
    <label>Python3 binary path (e.g.: /usr/bin/python3). Empty if you want to use the system path. <strong>Install teroshdl. E.g: pip3 install teroshdl</strong></label>
      <br>
      <input type='input' id='general-general-pypath' class='radio-button'>
      <br><br>
    <label>Activate go to definition feature for VHDL (you need to restart VSCode).</label>
      <input class='radio-button' id='general-general-go_to_definition_vhdl' type='checkbox'>
      <br><br>
    <label>Activate go to definition feature for Verilog/SV (you need to restart VSCode).</label>
      <input class='radio-button' id='general-general-go_to_definition_verilog' type='checkbox'>
      <br><br>
    <label>Developer mode: be careful!!</label>
      <input class='radio-button' id='general-general-developer_mode' type='checkbox'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="documentation-general" class='main'>
    <h3>Documentation: General</h3>
    <hr></hr>
    <p><i></i></p>
    <label>Documentation language:</label>
        <br>
        <select name='select' id='documentation-general-language'>
                <option value='english'>English</option>
                <option value='russian'>Russian</option>
        </select>
      <br><br>
    <label>Special VHDL symbol at the begin of the comment to extract documentation. Example: <code>--! Code comment</code></label>
      <br>
      <input type='input' id='documentation-general-symbol_vhdl' class='radio-button'>
      <br><br>
    <label>Special Verilog symbol at the begin of the comment to extract documentation. Example: <code>//! Code comment</code></label>
      <br>
      <input type='input' id='documentation-general-symbol_verilog' class='radio-button'>
      <br><br>
    <label>Include dependency graph:</label>
      <input class='radio-button' id='documentation-general-dependency_graph' type='checkbox'>
      <br><br>
    <label>HTML documentation self contained:</label>
      <input class='radio-button' id='documentation-general-self_contained' type='checkbox'>
      <br><br>
    <label>Include FSM:</label>
      <input class='radio-button' id='documentation-general-fsm' type='checkbox'>
      <br><br>
    <label>Include ports:</label>
        <br>
        <select name='select' id='documentation-general-ports'>
                <option value='all'>All</option>
                <option value='only_commented'>Only commented</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>Include generics:</label>
        <br>
        <select name='select' id='documentation-general-generics'>
                <option value='all'>All</option>
                <option value='only_commented'>Only commented</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>Include instantiations:</label>
        <br>
        <select name='select' id='documentation-general-instantiations'>
                <option value='all'>All</option>
                <option value='only_commented'>Only commented</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>Include signals:</label>
        <br>
        <select name='select' id='documentation-general-signals'>
                <option value='all'>All</option>
                <option value='only_commented'>Only commented</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>Include consants:</label>
        <br>
        <select name='select' id='documentation-general-constants'>
                <option value='all'>All</option>
                <option value='only_commented'>Only commented</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>Include types:</label>
        <br>
        <select name='select' id='documentation-general-types'>
                <option value='all'>All</option>
                <option value='only_commented'>Only commented</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>Include always/processes:</label>
        <br>
        <select name='select' id='documentation-general-process'>
                <option value='all'>All</option>
                <option value='only_commented'>Only commented</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>Include functions:</label>
        <br>
        <select name='select' id='documentation-general-functions'>
                <option value='all'>All</option>
                <option value='only_commented'>Only commented</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>Magic config file path</label>
      <br>
      <input type='input' id='documentation-general-magic_config_path' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="editor-general" class='main'>
    <h3>Editor: General</h3>
    <hr></hr>
    <p><i></i></p>
    <label>An enter keypress at the end of a line that contains a non-empty comment will continue the comment on the next line. This can be cancelled by pressing enter again. You must also set <code>"editor.formatOnType": true"</code></label>
      <input class='radio-button' id='editor-general-continue_comment' type='checkbox'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="formatter-general" class='main'>
    <h3>Formatter: General</h3>
    <hr></hr>
    <p><i></i></p>
    <label>Verilog/SV formatter:</label>
        <br>
        <select name='select' id='formatter-general-formatter_verilog'>
                <option value='istyle'>iStyle</option>
                <option value='s3sv'>s3sv</option>
                <option value='verible'>Verible</option>
        </select>
      <br><br>
    <label>VHDL formatter:</label>
        <br>
        <select name='select' id='formatter-general-formatter_vhdl'>
                <option value='standalone'>Standalone</option>
                <option value='vsg'>VSG</option>
        </select>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="formatter-istyle" class='main'>
    <h3>Formatter: iStyle</h3>
    <hr></hr>
    <p><i>Verilog/SV iStyle formatter</i></p>
    <label>Predefined Styling options.</label>
        <br>
        <select name='select' id='formatter-istyle-style'>
                <option value='ansi'>ANSI</option>
                <option value='kr'>Kernighan&Ritchie</option>
                <option value='gnu'>GNU</option>
                <option value='indent_only'>Indent only</option>
        </select>
      <br><br>
    <label>Indentation size in number of characters.</label>
      <input type='number' id='formatter-istyle-indentation_size' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="formatter-s3sv" class='main'>
    <h3>Formatter: s3sv</h3>
    <hr></hr>
    <p><i>Verilog/SV S3SV formatter</i></p>
    <label>Force one binding per line in instanciations statements.</label>
      <input class='radio-button' id='formatter-s3sv-one_bind_per_line' type='checkbox'>
      <br><br>
    <label>Force one declaration per line.</label>
      <input class='radio-button' id='formatter-s3sv-one_declaration_per_line' type='checkbox'>
      <br><br>
    <label>Use tabs instead of spaces for indentation.</label>
      <input class='radio-button' id='formatter-s3sv-use_tabs' type='checkbox'>
      <br><br>
    <label>Indentation size in number of characters.</label>
      <input type='number' id='formatter-s3sv-indentation_size' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="formatter-verible" class='main'>
    <h3>Formatter: Verible</h3>
    <hr></hr>
    <p><i>Verilog/SV Verible formatter</i></p>
    <label>Verible formatter binary path. E.g: /home/user/Downloads/verible-v0.0-1296/bin/verible-verilog-format</label>
      <br>
      <input type='input' id='formatter-verible-path' class='radio-button'>
      <br><br>
    <label>Extra command line arguments passed to the Verible tool</label>
      <br>
      <input type='input' id='formatter-verible-format_args' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="formatter-standalone" class='main'>
    <h3>Formatter: VHDL standalone</h3>
    <hr></hr>
    <p><i>VHDL standalone formatter</i></p>
    <label>Keyword case. e.g. begin, case, when </label>
        <br>
        <select name='select' id='formatter-standalone-keyword_case'>
                <option value='lowercase'>LowerCase</option>
                <option value='uppercase'>UpperCase</option>
        </select>
      <br><br>
    <label>Type name case. e.g. boolean, natural, string </label>
        <br>
        <select name='select' id='formatter-standalone-name_case'>
                <option value='lowercase'>LowerCase</option>
                <option value='uppercase'>UpperCase</option>
        </select>
      <br><br>
    <label>Indentation.</label>
      <br>
      <input type='input' id='formatter-standalone-indentation' class='radio-button'>
      <br><br>
    <label>Align signs in ports and generics.</label>
      <input class='radio-button' id='formatter-standalone-align_port_generic' type='checkbox'>
      <br><br>
    <label>Align comments.</label>
      <input class='radio-button' id='formatter-standalone-align_comment' type='checkbox'>
      <br><br>
    <label>Remove comments.</label>
      <input class='radio-button' id='formatter-standalone-remove_comments' type='checkbox'>
      <br><br>
    <label>Remove reports.</label>
      <input class='radio-button' id='formatter-standalone-remove_reports' type='checkbox'>
      <br><br>
    <label>All long names will be replaced by ALIAS names.</label>
      <input class='radio-button' id='formatter-standalone-check_alias' type='checkbox'>
      <br><br>
    <label>New line after THEN.</label>
        <br>
        <select name='select' id='formatter-standalone-new_line_after_then'>
                <option value='new_line'>New line</option>
                <option value='no_new_line'>No new line</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>New line after semicolon ';'.</label>
        <br>
        <select name='select' id='formatter-standalone-new_line_after_semicolon'>
                <option value='new_line'>New line</option>
                <option value='no_new_line'>No new line</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>New line after ELSE.</label>
        <br>
        <select name='select' id='formatter-standalone-new_line_after_else'>
                <option value='new_line'>New line</option>
                <option value='no_new_line'>No new line</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>New line after PORT | PORT MAP.</label>
        <br>
        <select name='select' id='formatter-standalone-new_line_after_port'>
                <option value='new_line'>New line</option>
                <option value='no_new_line'>No new line</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label>New line after GENERIC.</label>
        <br>
        <select name='select' id='formatter-standalone-new_line_after_generic'>
                <option value='new_line'>New line</option>
                <option value='no_new_line'>No new line</option>
                <option value='none'>None</option>
        </select>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="formatter-svg" class='main'>
    <h3>Formatter: VHDL VSG</h3>
    <hr></hr>
    <p><i>VHDL Style Guide. Analyzes VHDL files for style guide violations.</i></p>
    <label>JSON or YAML configuration file.</label>
      <br>
      <input type='input' id='formatter-svg-configuration' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="linter-general" class='main'>
    <h3>Linter settings: General</h3>
    <hr></hr>
    <p><i></i></p>
    <label>VHDL linter: disable VHDL-LS needs restart VSCode.</label>
        <br>
        <select name='select' id='linter-general-linter_vhdl'>
                <option value='disabled'>Disabled</option>
                <option value='ghdl'>GHDL</option>
                <option value='modelsim'>Modelsim</option>
                <option value='vivado'>Vivado (xvhdl)</option>
                <option value='none'>VHDL-LS</option>
        </select>
      <br><br>
    <label>Verilog/SV linter:</label>
        <br>
        <select name='select' id='linter-general-linter_verilog'>
                <option value='disabled'>Disabled</option>
                <option value='icarus'>Icarus</option>
                <option value='modelsim'>Modelsim</option>
                <option value='verilator'>Verilator</option>
                <option value='vivado'>Vivado (xvlog)</option>
        </select>
      <br><br>
    <label>Verilog/SV style checker:</label>
        <br>
        <select name='select' id='linter-general-lstyle_verilog'>
                <option value='verible'>Verible</option>
                <option value='disabled'>Disabled</option>
        </select>
      <br><br>
    <label>VHDL style checker:</label>
        <br>
        <select name='select' id='linter-general-lstyle_vhdl'>
                <option value='vsg'>VSG</option>
                <option value='disabled'>Disabled</option>
        </select>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="linter-ghdl" class='main'>
    <h3>Linter settings: GHDL linter</h3>
    <hr></hr>
    <p><i></i></p>
    <label>Arguments.</label>
      <br>
      <input type='input' id='linter-ghdl-arguments' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="linter-icarus" class='main'>
    <h3>Linter settings: Icarus linter</h3>
    <hr></hr>
    <p><i></i></p>
    <label>Arguments.</label>
      <br>
      <input type='input' id='linter-icarus-arguments' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="linter-modelsim" class='main'>
    <h3>Linter settings: ModelSim linter</h3>
    <hr></hr>
    <p><i></i></p>
    <label>VHDL linter arguments.</label>
      <br>
      <input type='input' id='linter-modelsim-vhdl_arguments' class='radio-button'>
      <br><br>
    <label>Verilog linter arguments.</label>
      <br>
      <input type='input' id='linter-modelsim-verilog_arguments' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="linter-verible" class='main'>
    <h3>Linter settings: Verible linter</h3>
    <hr></hr>
    <p><i></i></p>
    <label>Arguments.</label>
      <br>
      <input type='input' id='linter-verible-arguments' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="linter-verilator" class='main'>
    <h3>Linter settings: Verilator linter</h3>
    <hr></hr>
    <p><i></i></p>
    <label>Arguments.</label>
      <br>
      <input type='input' id='linter-verilator-arguments' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="linter-vivado" class='main'>
    <h3>Linter settings: Vivado linter</h3>
    <hr></hr>
    <p><i></i></p>
    <label>VHDL linter arguments.</label>
      <br>
      <input type='input' id='linter-vivado-vhdl_arguments' class='radio-button'>
      <br><br>
    <label>Verilog linter arguments.</label>
      <br>
      <input type='input' id='linter-vivado-verilog_arguments' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="linter-vsg" class='main'>
    <h3>Linter settings: VSG linter</h3>
    <hr></hr>
    <p><i></i></p>
    <label>Arguments.</label>
      <br>
      <input type='input' id='linter-vsg-arguments' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="schematic-general" class='main'>
    <h3>Schematic viewer: General</h3>
    <hr></hr>
    <p><i></i></p>
    <label>Select the backend:</label>
        <br>
        <select name='select' id='schematic-general-backend'>
                <option value='yowasp'>YoWASP</option>
                <option value='yosys'>Yosys</option>
                <option value='yosys_ghdl'>GHDL + Yosys</option>
                <option value='yosys_ghdl_module'>GHDL (module) + Yosys</option>
        </select>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="templates-general" class='main'>
    <h3>Templates: General</h3>
    <hr></hr>
    <p><i></i></p>
    <label>File path with your configurable header. E.g. your company license. It will be inserted at the beginning of the template</label>
      <br>
      <input type='input' id='templates-general-header_file_path' class='radio-button'>
      <br><br>
    <label>Indent</label>
      <br>
      <input type='input' id='templates-general-indent' class='radio-button'>
      <br><br>
    <label>Clock generation style:</label>
        <br>
        <select name='select' id='templates-general-clock_generation_style'>
                <option value='inline'>Inline</option>
                <option value='ifelse'>if/else</option>
        </select>
      <br><br>
    <label>Instantiation style:</label>
        <br>
        <select name='select' id='templates-general-instance_style'>
                <option value='inline'>Inline</option>
                <option value='separate'>Separate</option>
        </select>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-general" class='main'>
    <h3>Tools: General</h3>
    <hr></hr>
    <p><i></i></p>
    <label>Select a tool, framework, simulator...</label>
        <br>
        <select name='select' id='tools-general-select_tool'>
                <option value='osvvm'>OSVVM</option>
                <option value='vunit'>VUnit</option>
                <option value='ghdl'>GHDL</option>
                <option value='cocotb'>cocotb</option>
                <option value='icarus'>Icarus</option>
                <option value='icestorm'>Icestorm</option>
                <option value='ise'>ISE</option>
                <option value='isim'>ISIM</option>
                <option value='modelsim'>ModelSim</option>
                <option value='openfpga'>OpenFPGA</option>
                <option value='quartus'>Quartus</option>
                <option value='rivierapro'>Riviera-PRO</option>
                <option value='spyglass'>SpyGlass</option>
                <option value='trellis'>Trellis</option>
                <option value='vcs'>VCS</option>
                <option value='verilator'>Verilator</option>
                <option value='vivado'>Vivado</option>
                <option value='xcelium'>Xcelium</option>
                <option value='xsim'>XSIM</option>
        </select>
      <br><br>
    <label>Select the execution mode.</label>
        <br>
        <select name='select' id='tools-general-execution_mode'>
                <option value='gui'>GUI</option>
                <option value='cmd'>Command line</option>
        </select>
      <br><br>
    <label>Select the waveform viewer. For GTKWave you need to install it.</label>
        <br>
        <select name='select' id='tools-general-waveform_viewer'>
                <option value='tool'>Tool GUI</option>
                <option value='vcdrom'>VCDrom</option>
                <option value='gtkwave'>GTKWave</option>
        </select>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-osvvm" class='main'>
    <h3>Tools: OSVVM</h3>
    <hr></hr>
    <p><i>OSVVM is an advanced verification methodology that defines a VHDL verification framework, verification utility library, verification component library, and a scripting flow that simplifies your FPGA or ASIC verification project from start to finish. Using these libraries you can create a simple, readable, and powerful testbench that is suitable for either a simple FPGA block or a complex ASIC.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-osvvm-installation_path' class='radio-button'>
      <br><br>
    <label>tclsh binary path. E.g: /usr/bin/tclsh8.6</label>
      <br>
      <input type='input' id='tools-osvvm-tclsh_binary' class='radio-button'>
      <br><br>
    <label>Selects which simulator to use.</label>
        <br>
        <select name='select' id='tools-osvvm-simulator_name'>
                <option value='activehdl'>Aldec Active-HDL</option>
                <option value='ghdl'>GHDL</option>
                <option value='nvc'>NVC</option>
                <option value='rivierapro'>Aldec Riviera-PRO</option>
                <option value='questa'>Mentor/Siemens EDA Questa</option>
                <option value='modelsim'>Mentor/Siemens EDA ModelSim</option>
                <option value='vcs'>VCS</option>
                <option value='xsim'>XSIM</option>
                <option value='xcelium'>Xcelium</option>
        </select>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-ascenlint" class='main'>
    <h3>Tools: Ascenlint</h3>
    <hr></hr>
    <p><i>Ascent Lint performs static source code analysis on HDL code and checks for common coding errors or coding style violations.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-ascenlint-installation_path' class='radio-button'>
      <br><br>
    <label>Additional run options for ascentlint.</label>
      <input type='input' id='tools-ascenlint-ascentlint_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-cocotb" class='main'>
    <h3>Tools: Cocotb</h3>
    <hr></hr>
    <p><i></i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-cocotb-installation_path' class='radio-button'>
      <br><br>
    <label>Selects which simulator Makefile to use. Attempts to include a simulator specific makefile from cocotb/share/makefiles/simulators/makefile.$(SIM)</label>
        <br>
        <select name='select' id='tools-cocotb-simulator_name'>
                <option value='icarus'>icarus</option>
                <option value='verilator'>Verilator</option>
                <option value='vcs'>Synopsys VCS</option>
                <option value='riviera'>Aldec Riviera-PRO</option>
                <option value='activehdl'>Aldec Active-HDL</option>
                <option value='questa'>Mentor/Siemens EDA Questa</option>
                <option value='modelsim'>Mentor/Siemens EDA ModelSim</option>
                <option value='ius'>Cadence Incisive</option>
                <option value='xcelium'>Cadence Xcelium</option>
                <option value='ghdl'>GHDL</option>
                <option value='cvc'>Tachyon DA CVC</option>
        </select>
      <br><br>
    <label>Any arguments or flags to pass to the compile stage of the simulation.</label>
      <br>
      <input type='input' id='tools-cocotb-compile_args' class='radio-button'>
      <br><br>
    <label>Any argument to be passed to the “first” invocation of a simulator that runs via a TCL script. One motivating usage is to pass -noautoldlibpath to Questa to prevent it from loading the out-of-date libraries it ships with. Used by Aldec Riviera-PRO and Mentor Graphics Questa simulator.</label>
      <br>
      <input type='input' id='tools-cocotb-run_args' class='radio-button'>
      <br><br>
    <label>They are options that are starting with a plus (+) sign. They are passed to the simulator and are also available within cocotb as cocotb.plusargs. In the simulator, they can be read by the Verilog/SystemVerilog system functions $test$plusargs and $value$plusargs. The special plusargs +ntb_random_seed and +seed, if present, are evaluated to set the random seed value if RANDOM_SEED is not set. If both +ntb_random_seed and +seed are set, +ntb_random_seed is used.</label>
      <br>
      <input type='input' id='tools-cocotb-plusargs' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-diamond" class='main'>
    <h3>Tools: Diamond</h3>
    <hr></hr>
    <p><i>Backend for Lattice Diamond.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-diamond-installation_path' class='radio-button'>
      <br><br>
    <label>FPGA part number (e.g. LFE5U-45F-6BG381C).</label>
      <br>
      <input type='input' id='tools-diamond-part' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-ghdl" class='main'>
    <h3>Tools: GHDL</h3>
    <hr></hr>
    <p><i>GHDL is an open source VHDL simulator, which fully supports IEEE 1076-1987, IEEE 1076-1993, IEE 1076-2002 and partially the 1076-2008 version of VHDL.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-ghdl-installation_path' class='radio-button'>
      <br><br>
    <label>Waveform output format:</label>
        <br>
        <select name='select' id='tools-ghdl-waveform'>
                <option value='vcd'>VCD</option>
                <option value='ghw'>GHW</option>
        </select>
      <br><br>
    <label>analyze options. Extra options used for the GHDL analyze stage (ghdl -a).</label>
      <input type='input' id='tools-ghdl-analyze_options' class='radio-button'>
      <br><br>
    <label>Run options. Extra options used when running GHDL simulations (ghdl -r).</label>
      <input type='input' id='tools-ghdl-run_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-icarus" class='main'>
    <h3>Tools: Icarus</h3>
    <hr></hr>
    <p><i>Icarus Verilog is a Verilog simulation and synthesis tool. It operates as a compiler, compiling source code written in Verilog (IEEE-1364) into some target format.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-icarus-installation_path' class='radio-button'>
      <br><br>
    <label>Default timescale.</label>
      <br>
      <input type='input' id='tools-icarus-timescale' class='radio-button'>
      <br><br>
    <label>Additional options for iverilog.</label>
      <input type='input' id='tools-icarus-iverilog_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-icestorm" class='main'>
    <h3>Tools: Icestorm</h3>
    <hr></hr>
    <p><i>Open source toolchain for Lattice iCE40 FPGAs. Uses yosys for synthesis and arachne-pnr or nextpnr for Place & Route.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-icestorm-installation_path' class='radio-button'>
      <br><br>
    <label>Select P&R tool. Valid values are arachne and next. Default is arachne.</label>
        <br>
        <select name='select' id='tools-icestorm-pnr'>
                <option value='arachne'>Arachne-pnr</option>
                <option value='next'>nextpnr</option>
                <option value='none'>Only perform synthesis</option>
        </select>
      <br><br>
    <label>Target architecture.</label>
        <br>
        <select name='select' id='tools-icestorm-arch'>
                <option value='xilinx'>Xilinx</option>
                <option value='ice40'>ICE40</option>
                <option value='ecp5'>ECP5</option>
        </select>
      <br><br>
    <label>Output file format.</label>
        <br>
        <select name='select' id='tools-icestorm-output_format'>
                <option value='json'>JSON</option>
                <option value='edif'>EDIF</option>
                <option value='blif'>BLIF</option>
        </select>
      <br><br>
    <label>Determines if Yosys is run as a part of bigger toolchain, or as a standalone tool.</label>
      <input class='radio-button' id='tools-icestorm-yosys_as_subtool' type='checkbox'>
      <br><br>
    <label>Generated makefile name, defaults to $name.mk</label>
      <br>
      <input type='input' id='tools-icestorm-makefile_name' class='radio-button'>
      <br><br>
    <label>Options for ArachnePNR Place & Route.</label>
      <input type='input' id='tools-icestorm-arachne_pnr_options' class='radio-button'>
      <br><br>
    <label>Options for NextPNR Place & Route.</label>
      <input type='input' id='tools-icestorm-nextpnr_options' class='radio-button'>
      <br><br>
    <label>Additional options for the synth_ice40 command.</label>
      <input type='input' id='tools-icestorm-yosys_synth_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-ise" class='main'>
    <h3>Tools: ISE</h3>
    <hr></hr>
    <p><i>Xilinx ISE Design Suite.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-ise-installation_path' class='radio-button'>
      <br><br>
    <label>FPGA family (e.g. spartan6).</label>
      <br>
      <input type='input' id='tools-ise-family' class='radio-button'>
      <br><br>
    <label>FPGA device (e.g. xc6slx45).</label>
      <br>
      <input type='input' id='tools-ise-device' class='radio-button'>
      <br><br>
    <label>FPGA package (e.g. csg324).</label>
      <br>
      <input type='input' id='tools-ise-package' class='radio-button'>
      <br><br>
    <label>FPGA speed grade (e.g. -2).</label>
      <br>
      <input type='input' id='tools-ise-speed' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-isem" class='main'>
    <h3>Tools: ISIM</h3>
    <hr></hr>
    <p><i>Xilinx ISim simulator from ISE design suite.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-isem-installation_path' class='radio-button'>
      <br><br>
    <label>Additional options for compilation with FUSE.</label>
      <input type='input' id='tools-isem-fuse_options' class='radio-button'>
      <br><br>
    <label>Additional run options for ISim.</label>
      <input type='input' id='tools-isem-isim_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-modelsim" class='main'>
    <h3>Tools: ModelSim</h3>
    <hr></hr>
    <p><i>ModelSim simulator from Mentor Graphics.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-modelsim-installation_path' class='radio-button'>
      <br><br>
    <label>Additional options for compilation with vcom.</label>
      <input type='input' id='tools-modelsim-vcom_options' class='radio-button'>
      <br><br>
    <label>Additional options for compilation with vlog.</label>
      <input type='input' id='tools-modelsim-vlog_options' class='radio-button'>
      <br><br>
    <label>Additional run options for vsim.</label>
      <input type='input' id='tools-modelsim-vsim_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-morty" class='main'>
    <h3>Tools: Morty</h3>
    <hr></hr>
    <p><i>Run the (System-) Verilog pickle tool called morty.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-morty-installation_path' class='radio-button'>
      <br><br>
    <label>Run-time options passed to morty..</label>
      <input type='input' id='tools-morty-morty_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-quartus" class='main'>
    <h3>Tools: Quartus</h3>
    <hr></hr>
    <p><i>The Quartus backend supports Intel Quartus Std and Pro editions to build systems and program the FPGA.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-quartus-installation_path' class='radio-button'>
      <br><br>
    <label>FPGA family (e.g. Cyclone V).</label>
      <br>
      <input type='input' id='tools-quartus-family' class='radio-button'>
      <br><br>
    <label>FPGA device (e.g. 5CSXFC6D6F31C8ES).</label>
      <br>
      <input type='input' id='tools-quartus-device' class='radio-button'>
      <br><br>
    <label>Specifies the FPGA’s JTAG programming cable. Use the tool jtagconfig to determine the available cables.</label>
      <br>
      <input type='input' id='tools-quartus-cable' class='radio-button'>
      <br><br>
    <label>Specifies the FPGA’s device number in the JTAG chain. The device index specifies the device where the flash programmer looks for the Nios® II JTAG debug module. JTAG devices are numbered relative to the JTAG chain, starting at 1. Use the tool jtagconfig to determine the index.</label>
      <br>
      <input type='input' id='tools-quartus-board_device_index' class='radio-button'>
      <br><br>
    <label>P&R tool. one (to just run synthesis).</label>
        <br>
        <select name='select' id='tools-quartus-pnr'>
                <option value='default'>Default</option>
                <option value='dse'>Run Design Space Explorer</option>
                <option value='none'>Run synthesis</option>
        </select>
      <br><br>
    <label>Command-line options for Design Space Explorer.</label>
      <input type='input' id='tools-quartus-dse_options' class='radio-button'>
      <br><br>
    <label>Extra command-line options for Quartus.</label>
      <input type='input' id='tools-quartus-quartus_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-radiant" class='main'>
    <h3>Tools: Radiant</h3>
    <hr></hr>
    <p><i>Backend for Lattice Radiant.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-radiant-installation_path' class='radio-button'>
      <br><br>
    <label>FPGA part number (e.g. LIFCL-40-9BG400C).</label>
      <br>
      <input type='input' id='tools-radiant-part' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-rivierapro" class='main'>
    <h3>Tools: Rivierapro</h3>
    <hr></hr>
    <p><i>Riviera Pro simulator from Aldec.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-rivierapro-installation_path' class='radio-button'>
      <br><br>
    <label>Common or separate compilation, sep - for separate compilation, common - for common compilation.</label>
      <br>
      <input type='input' id='tools-rivierapro-compilation_mode' class='radio-button'>
      <br><br>
    <label>Additional options for compilation with vlog.</label>
      <input type='input' id='tools-rivierapro-vlog_options' class='radio-button'>
      <br><br>
    <label>Additional run options for vsim.</label>
      <input type='input' id='tools-rivierapro-vsim_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-siliconcompiler" class='main'>
    <h3>Tools: SiliconCompiler</h3>
    <hr></hr>
    <p><i>SiliconCompiler is an open source compiler framework that automates translation from source code to silicon. Check the project documentation: <a href="https://docs.siliconcompiler.com/en/latest/">https://docs.siliconcompiler.com/en/latest/</a></i></p>
    <label></label>
      <br>
      <input type='input' id='tools-siliconcompiler-installation_path' class='radio-button'>
      <br><br>
    <label>Compilation target separated by a single underscore, specified as '<process>_<edaflow>' for ASIC compilation and '<partname>_<edaflow>'' for FPGA compilation. The process, edaflow, partname fields must be alphanumeric and cannot contain underscores. E.g: asicflow_freepdk45</label>
      <br>
      <input type='input' id='tools-siliconcompiler-target' class='radio-button'>
      <br><br>
    <label>Enable remote server.</label>
      <input class='radio-button' id='tools-siliconcompiler-server_enable' type='checkbox'>
      <br><br>
    <label>Remote server address (e.g: https://server.siliconcompiler.com):</label>
      <br>
      <input type='input' id='tools-siliconcompiler-server_address' class='radio-button'>
      <br><br>
    <label>Remote server user:</label>
      <br>
      <input type='input' id='tools-siliconcompiler-server_username' class='radio-button'>
      <br><br>
    <label>Remote server password:</label>
      <br>
      <input type='input' id='tools-siliconcompiler-server_password' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-spyglass" class='main'>
    <h3>Tools: Spyglass</h3>
    <hr></hr>
    <p><i>Synopsys (formerly Atrenta) Spyglass Backend. Spyglass performs static source code analysis on HDL code and checks for common coding errors or coding style violations.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-spyglass-installation_path' class='radio-button'>
      <br><br>
    <label></label>
      <br>
      <input type='input' id='tools-spyglass-methodology' class='radio-button'>
      <br><br>
    <label></label>
      <input type='input' id='tools-spyglass-goals' class='radio-button'>
      <br><br>
    <label></label>
      <input type='input' id='tools-spyglass-spyglass_options' class='radio-button'>
      <br><br>
    <label></label>
      <input type='input' id='tools-spyglass-rule_parameters' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-symbiyosys" class='main'>
    <h3>Tools: SymbiYosys</h3>
    <hr></hr>
    <p><i>SymbiYosys formal verification wrapper for Yosys.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-symbiyosys-installation_path' class='radio-button'>
      <br><br>
    <label>A list of the .sby file’s tasks to run. Passed on the sby command line..</label>
      <input type='input' id='tools-symbiyosys-tasknames' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-symbiflow" class='main'>
    <h3>Tools: Symbiflow</h3>
    <hr></hr>
    <p><i>VHDL Style Guide. Analyzes VHDL files for style guide violations.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-symbiflow-installation_path' class='radio-button'>
      <br><br>
    <label>FPGA chip package (e.g. clg400-1).</label>
      <br>
      <input type='input' id='tools-symbiflow-package' class='radio-button'>
      <br><br>
    <label>FPGA part type (e.g. xc7a50t).</label>
      <br>
      <input type='input' id='tools-symbiflow-part' class='radio-button'>
      <br><br>
    <label>Target architecture. Currently only “xilinx” is supported.</label>
      <br>
      <input type='input' id='tools-symbiflow-vendor' class='radio-button'>
      <br><br>
    <label>Place and Route tool. Currently only “vpr” is supported.</label>
        <br>
        <select name='select' id='tools-symbiflow-pnr'>
                <option value='vpr'>VPR</option>
        </select>
      <br><br>
    <label>Additional vpr tool options. If not used, default options for the tool will be used.</label>
      <br>
      <input type='input' id='tools-symbiflow-vpr_options' class='radio-button'>
      <br><br>
    <label>Optional bash script that will be sourced before each build step..</label>
      <br>
      <input type='input' id='tools-symbiflow-environment_script' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-trellis" class='main'>
    <h3>Tools: Trellis</h3>
    <hr></hr>
    <p><i>Project Trellis enables a fully open-source flow for ECP5 FPGAs using Yosys for Verilog synthesis and nextpnr for place and route.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-trellis-installation_path' class='radio-button'>
      <br><br>
    <label>Target architecture.</label>
        <br>
        <select name='select' id='tools-trellis-arch'>
                <option value='xilinx'>Xilinx</option>
                <option value='ice40'>ICE40</option>
                <option value='ecp5'>ECP5</option>
        </select>
      <br><br>
    <label>Output file format.</label>
        <br>
        <select name='select' id='tools-trellis-output_format'>
                <option value='json'>JSON</option>
                <option value='edif'>EDIF</option>
                <option value='blif'>BLIF</option>
        </select>
      <br><br>
    <label>Determines if Yosys is run as a part of bigger toolchain, or as a standalone tool.</label>
      <input class='radio-button' id='tools-trellis-yosys_as_subtool' type='checkbox'>
      <br><br>
    <label>Generated makefile name, defaults to $name.mk</label>
      <br>
      <input type='input' id='tools-trellis-makefile_name' class='radio-button'>
      <br><br>
    <label>Generated tcl script filename, defaults to $name.mk</label>
      <br>
      <input type='input' id='tools-trellis-script_name' class='radio-button'>
      <br><br>
    <label>Options for NextPNR Place & Route.</label>
      <input type='input' id='tools-trellis-nextpnr_options' class='radio-button'>
      <br><br>
    <label>Additional options for the synth_ice40 command.</label>
      <input type='input' id='tools-trellis-yosys_synth_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-vcs" class='main'>
    <h3>Tools: VCS</h3>
    <hr></hr>
    <p><i>Synopsys VCS Backend</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-vcs-installation_path' class='radio-button'>
      <br><br>
    <label>Compile time options passed to vcs</label>
      <input type='input' id='tools-vcs-vcs_options' class='radio-button'>
      <br><br>
    <label>Runtime options passed to the simulation</label>
      <input type='input' id='tools-vcs-run_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-veriblelint" class='main'>
    <h3>Tools: VeribleLint</h3>
    <hr></hr>
    <p><i>Verible lint backend (verible-verilog-lint).</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-veriblelint-installation_path' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-verilator" class='main'>
    <h3>Tools: Verilator</h3>
    <hr></hr>
    <p><i>Verible lint backend (verible-verilog-lint).</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-verilator-installation_path' class='radio-button'>
      <br><br>
    <label>Select compilation mode. Legal values are cc for C++ testbenches, sc for SystemC testbenches or lint-only to only perform linting on the Verilog code.</label>
        <br>
        <select name='select' id='tools-verilator-mode'>
                <option value='cc'>cc</option>
                <option value='sc'>sc</option>
                <option value='lint-only'>lint-only</option>
        </select>
      <br><br>
    <label>Extra libraries for the verilated model to link against.</label>
      <input type='input' id='tools-verilator-libs' class='radio-button'>
      <br><br>
    <label>Additional options for verilator.</label>
      <input type='input' id='tools-verilator-verilator_options' class='radio-button'>
      <br><br>
    <label>Additional arguments passed to make when compiling the simulation. This is commonly used to set OPT/OPT_FAST/OPT_SLOW.</label>
      <input type='input' id='tools-verilator-make_options' class='radio-button'>
      <br><br>
    <label>Additional arguments directly passed to the verilated model.</label>
      <input type='input' id='tools-verilator-run_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-vivado" class='main'>
    <h3>Tools: Vivado</h3>
    <hr></hr>
    <p><i>The Vivado backend executes Xilinx Vivado to build systems and program the FPGA.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-vivado-installation_path' class='radio-button'>
      <br><br>
    <label>Part. Device identifier. e.g. xc7a35tcsg324-1.</label>
      <br>
      <input type='input' id='tools-vivado-part' class='radio-button'>
      <br><br>
    <label>Synthesis tool. Allowed values are vivado (default) and yosys..</label>
      <br>
      <input type='input' id='tools-vivado-synth' class='radio-button'>
      <br><br>
    <label>Choose only synthesis or place and route and bitstream generation:</label>
        <br>
        <select name='select' id='tools-vivado-pnr'>
                <option value='vivado'>Place and route</option>
                <option value='none'>Only synthesis</option>
        </select>
      <br><br>
    <label>The frequency for jtag communication.</label>
      <input type='number' id='tools-vivado-jtag_freq' class='radio-button'>
      <br><br>
    <label>Board identifier (e.g. */xilinx_tcf/Digilent/123456789123A.</label>
      <br>
      <input type='input' id='tools-vivado-hw_target' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-vunit" class='main'>
    <h3>Tools: VUnit</h3>
    <hr></hr>
    <p><i>VUnit testing framework.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-vunit-installation_path' class='radio-button'>
      <br><br>
    <label>VUnit simulator:</label>
        <br>
        <select name='select' id='tools-vunit-simulator_name'>
                <option value='rivierapro'>Aldec Riviera-PRO</option>
                <option value='activehdl'>Aldec Active-HDL</option>
                <option value='ghdl'>GHDL</option>
                <option value='modelsim'>Mentor Graphics ModelSim/Questa</option>
                <option value='xsim'>XSIM (Not supported in official VUnit)</option>
        </select>
      <br><br>
    <label>runpy mode:</label>
        <br>
        <select name='select' id='tools-vunit-runpy_mode'>
                <option value='standalone'>Standalone</option>
                <option value='creation'>Creation</option>
        </select>
      <br><br>
    <label>VUnit options. Extra options for the VUnit test runner.</label>
      <input type='input' id='tools-vunit-extra_options' class='radio-button'>
      <br><br>
    <label>Enable array util library in non standalone mode</label>
      <input class='radio-button' id='tools-vunit-enable_array_util_lib' type='checkbox'>
      <br><br>
    <label>Enable com library in non standalone mode</label>
      <input class='radio-button' id='tools-vunit-enable_com_lib' type='checkbox'>
      <br><br>
    <label>Enable json4vhdl library in non standalone mode</label>
      <input class='radio-button' id='tools-vunit-enable_json4vhdl_lib' type='checkbox'>
      <br><br>
    <label>Enable OSVVM library in non standalone mode</label>
      <input class='radio-button' id='tools-vunit-enable_osvvm_lib' type='checkbox'>
      <br><br>
    <label>Enable random library in non standalone mode</label>
      <input class='radio-button' id='tools-vunit-enable_random_lib' type='checkbox'>
      <br><br>
    <label>Enable verification components library in non standalone mode</label>
      <input class='radio-button' id='tools-vunit-enable_verification_components_lib' type='checkbox'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-xcelium" class='main'>
    <h3>Tools: Xcelium</h3>
    <hr></hr>
    <p><i>Xcelium simulator from Cadence Design Systems.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-xcelium-installation_path' class='radio-button'>
      <br><br>
    <label>Additional options for compilation with xmvhdl.</label>
      <input type='input' id='tools-xcelium-xmvhdl_options' class='radio-button'>
      <br><br>
    <label>Additional options for compilation with xmvlog.</label>
      <input type='input' id='tools-xcelium-xmvlog_options' class='radio-button'>
      <br><br>
    <label>Additional run options for xmsim.</label>
      <input type='input' id='tools-xcelium-xmsim_options' class='radio-button'>
      <br><br>
    <label>Additional run options for xrun.</label>
      <input type='input' id='tools-xcelium-xrun_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-xsim" class='main'>
    <h3>Tools: XSIM</h3>
    <hr></hr>
    <p><i>XSim simulator from the Xilinx Vivado suite.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-xsim-installation_path' class='radio-button'>
      <br><br>
    <label>Additional options for compilation with xelab.</label>
      <input type='input' id='tools-xsim-xelab_options' class='radio-button'>
      <br><br>
    <label>Additional run options for XSim.</label>
      <input type='input' id='tools-xsim-xsim_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-yosys" class='main'>
    <h3>Tools: Yosys</h3>
    <hr></hr>
    <p><i>Open source synthesis tool targeting many different FPGAs.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-yosys-installation_path' class='radio-button'>
      <br><br>
    <label>Target architecture.</label>
        <br>
        <select name='select' id='tools-yosys-arch'>
                <option value='xilinx'>Xilinx</option>
                <option value='ice40'>ICE40</option>
                <option value='ecp5'>ECP5</option>
        </select>
      <br><br>
    <label>Output file format.</label>
        <br>
        <select name='select' id='tools-yosys-output_format'>
                <option value='json'>JSON</option>
                <option value='edif'>EDIF</option>
                <option value='blif'>BLIF</option>
        </select>
      <br><br>
    <label>Determines if Yosys is run as a part of bigger toolchain, or as a standalone tool.</label>
      <input class='radio-button' id='tools-yosys-yosys_as_subtool' type='checkbox'>
      <br><br>
    <label>Generated makefile name, defaults to $name.mk</label>
      <br>
      <input type='input' id='tools-yosys-makefile_name' class='radio-button'>
      <br><br>
    <label>Generated tcl script filename, defaults to $name.mk</label>
      <br>
      <input type='input' id='tools-yosys-script_name' class='radio-button'>
      <br><br>
    <label>Additional options for the synth_ice40 command.</label>
      <input type='input' id='tools-yosys-yosys_synth_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-openfpga" class='main'>
    <h3>Tools: OpenFPGA</h3>
    <hr></hr>
    <p><i>The award-winning OpenFPGA framework is the first open-source FPGA IP generator with silicon proofs supporting highly-customizable FPGA architectures.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-openfpga-installation_path' class='radio-button'>
      <br><br>
    <label>Target architecture.</label>
        <br>
        <select name='select' id='tools-openfpga-arch'>
                <option value='xilinx'>Xilinx</option>
                <option value='ice40'>ICE40</option>
                <option value='ecp5'>ECP5</option>
        </select>
      <br><br>
    <label>Output file format.</label>
        <br>
        <select name='select' id='tools-openfpga-output_format'>
                <option value='json'>JSON</option>
                <option value='edif'>EDIF</option>
                <option value='blif'>BLIF</option>
        </select>
      <br><br>
    <label>Determines if Yosys is run as a part of bigger toolchain, or as a standalone tool.</label>
      <input class='radio-button' id='tools-openfpga-yosys_as_subtool' type='checkbox'>
      <br><br>
    <label>Generated makefile name, defaults to $name.mk</label>
      <br>
      <input type='input' id='tools-openfpga-makefile_name' class='radio-button'>
      <br><br>
    <label>Generated tcl script filename, defaults to $name.mk</label>
      <br>
      <input type='input' id='tools-openfpga-script_name' class='radio-button'>
      <br><br>
    <label>Additional options for the synth_ice40 command.</label>
      <input type='input' id='tools-openfpga-yosys_synth_options' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-activehdl" class='main'>
    <h3>Tools: Active-HDL</h3>
    <hr></hr>
    <p><i>Active-HDL™ is a Windows based, integrated FPGA Design Creation and Simulation solution for team-based environments.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-activehdl-installation_path' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-nvc" class='main'>
    <h3>Tools: NVC</h3>
    <hr></hr>
    <p><i>NVC is a VHDL compiler and simulator. NVC supports almost all of VHDL-2002 and it has been successfully used to simulate several real-world designs.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-nvc-installation_path' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>
  <div id="tools-questa" class='main'>
    <h3>Tools: Questa Advanced Simulator</h3>
    <hr></hr>
    <p><i>The Questa advanced simulator is the core simulation and debug engine of the Questa verification solution.</i></p>
    <label>Installation path:</label>
      <br>
      <input type='input' id='tools-questa-installation_path' class='radio-button'>
      <br><br>
    <label></label>
      <br><br>
    <label></label>
      <br><br>
  </div>

</article> 

<div id="div_button">
  <button id="button_cancel" class="button" type="button" onclick="close_panel(event)">Close</button>
  <button id="button_apply" class="button" type="button" onclick="send_config(event)">Apply</button>
  <button id="button_apply_close" class="button" type="button" onclick="send_config_and_close(event)">Apply and close</button>
  
  
</div>

<script>
  
  function enable_tab(tp0, tp1){
    const complete = tp0 + "-" + tp1;
  if ("general" == tp0 && "general" == tp1){
    document.getElementById("general-general").style.visibility = "visible"; 
  }
  else{
    document.getElementById("general-general").style.visibility = "hidden"; 
  }
  if ("documentation" == tp0 && "general" == tp1){
    document.getElementById("documentation-general").style.visibility = "visible"; 
  }
  else{
    document.getElementById("documentation-general").style.visibility = "hidden"; 
  }
  if ("editor" == tp0 && "general" == tp1){
    document.getElementById("editor-general").style.visibility = "visible"; 
  }
  else{
    document.getElementById("editor-general").style.visibility = "hidden"; 
  }
  if ("formatter" == tp0 && "general" == tp1){
    document.getElementById("formatter-general").style.visibility = "visible"; 
  }
  else{
    document.getElementById("formatter-general").style.visibility = "hidden"; 
  }
  if ("formatter" == tp0 && "istyle" == tp1){
    document.getElementById("formatter-istyle").style.visibility = "visible"; 
  }
  else{
    document.getElementById("formatter-istyle").style.visibility = "hidden"; 
  }
  if ("formatter" == tp0 && "s3sv" == tp1){
    document.getElementById("formatter-s3sv").style.visibility = "visible"; 
  }
  else{
    document.getElementById("formatter-s3sv").style.visibility = "hidden"; 
  }
  if ("formatter" == tp0 && "verible" == tp1){
    document.getElementById("formatter-verible").style.visibility = "visible"; 
  }
  else{
    document.getElementById("formatter-verible").style.visibility = "hidden"; 
  }
  if ("formatter" == tp0 && "standalone" == tp1){
    document.getElementById("formatter-standalone").style.visibility = "visible"; 
  }
  else{
    document.getElementById("formatter-standalone").style.visibility = "hidden"; 
  }
  if ("formatter" == tp0 && "svg" == tp1){
    document.getElementById("formatter-svg").style.visibility = "visible"; 
  }
  else{
    document.getElementById("formatter-svg").style.visibility = "hidden"; 
  }
  if ("linter" == tp0 && "general" == tp1){
    document.getElementById("linter-general").style.visibility = "visible"; 
  }
  else{
    document.getElementById("linter-general").style.visibility = "hidden"; 
  }
  if ("linter" == tp0 && "ghdl" == tp1){
    document.getElementById("linter-ghdl").style.visibility = "visible"; 
  }
  else{
    document.getElementById("linter-ghdl").style.visibility = "hidden"; 
  }
  if ("linter" == tp0 && "icarus" == tp1){
    document.getElementById("linter-icarus").style.visibility = "visible"; 
  }
  else{
    document.getElementById("linter-icarus").style.visibility = "hidden"; 
  }
  if ("linter" == tp0 && "modelsim" == tp1){
    document.getElementById("linter-modelsim").style.visibility = "visible"; 
  }
  else{
    document.getElementById("linter-modelsim").style.visibility = "hidden"; 
  }
  if ("linter" == tp0 && "verible" == tp1){
    document.getElementById("linter-verible").style.visibility = "visible"; 
  }
  else{
    document.getElementById("linter-verible").style.visibility = "hidden"; 
  }
  if ("linter" == tp0 && "verilator" == tp1){
    document.getElementById("linter-verilator").style.visibility = "visible"; 
  }
  else{
    document.getElementById("linter-verilator").style.visibility = "hidden"; 
  }
  if ("linter" == tp0 && "vivado" == tp1){
    document.getElementById("linter-vivado").style.visibility = "visible"; 
  }
  else{
    document.getElementById("linter-vivado").style.visibility = "hidden"; 
  }
  if ("linter" == tp0 && "vsg" == tp1){
    document.getElementById("linter-vsg").style.visibility = "visible"; 
  }
  else{
    document.getElementById("linter-vsg").style.visibility = "hidden"; 
  }
  if ("schematic" == tp0 && "general" == tp1){
    document.getElementById("schematic-general").style.visibility = "visible"; 
  }
  else{
    document.getElementById("schematic-general").style.visibility = "hidden"; 
  }
  if ("templates" == tp0 && "general" == tp1){
    document.getElementById("templates-general").style.visibility = "visible"; 
  }
  else{
    document.getElementById("templates-general").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "general" == tp1){
    document.getElementById("tools-general").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-general").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "osvvm" == tp1){
    document.getElementById("tools-osvvm").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-osvvm").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "ascenlint" == tp1){
    document.getElementById("tools-ascenlint").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-ascenlint").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "cocotb" == tp1){
    document.getElementById("tools-cocotb").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-cocotb").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "diamond" == tp1){
    document.getElementById("tools-diamond").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-diamond").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "ghdl" == tp1){
    document.getElementById("tools-ghdl").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-ghdl").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "icarus" == tp1){
    document.getElementById("tools-icarus").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-icarus").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "icestorm" == tp1){
    document.getElementById("tools-icestorm").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-icestorm").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "ise" == tp1){
    document.getElementById("tools-ise").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-ise").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "isem" == tp1){
    document.getElementById("tools-isem").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-isem").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "modelsim" == tp1){
    document.getElementById("tools-modelsim").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-modelsim").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "morty" == tp1){
    document.getElementById("tools-morty").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-morty").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "quartus" == tp1){
    document.getElementById("tools-quartus").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-quartus").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "radiant" == tp1){
    document.getElementById("tools-radiant").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-radiant").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "rivierapro" == tp1){
    document.getElementById("tools-rivierapro").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-rivierapro").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "siliconcompiler" == tp1){
    document.getElementById("tools-siliconcompiler").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-siliconcompiler").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "spyglass" == tp1){
    document.getElementById("tools-spyglass").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-spyglass").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "symbiyosys" == tp1){
    document.getElementById("tools-symbiyosys").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-symbiyosys").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "symbiflow" == tp1){
    document.getElementById("tools-symbiflow").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-symbiflow").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "trellis" == tp1){
    document.getElementById("tools-trellis").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-trellis").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "vcs" == tp1){
    document.getElementById("tools-vcs").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-vcs").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "veriblelint" == tp1){
    document.getElementById("tools-veriblelint").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-veriblelint").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "verilator" == tp1){
    document.getElementById("tools-verilator").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-verilator").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "vivado" == tp1){
    document.getElementById("tools-vivado").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-vivado").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "vunit" == tp1){
    document.getElementById("tools-vunit").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-vunit").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "xcelium" == tp1){
    document.getElementById("tools-xcelium").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-xcelium").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "xsim" == tp1){
    document.getElementById("tools-xsim").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-xsim").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "yosys" == tp1){
    document.getElementById("tools-yosys").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-yosys").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "openfpga" == tp1){
    document.getElementById("tools-openfpga").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-openfpga").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "activehdl" == tp1){
    document.getElementById("tools-activehdl").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-activehdl").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "nvc" == tp1){
    document.getElementById("tools-nvc").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-nvc").style.visibility = "hidden"; 
  }
  if ("tools" == tp0 && "questa" == tp1){
    document.getElementById("tools-questa").style.visibility = "visible"; 
  }
  else{
    document.getElementById("tools-questa").style.visibility = "hidden"; 
  }
  }

  enable_tab('general', 'general');

  document.getElementById("btn-general-general").addEventListener("click", function() {
    enable_tab("general","general")
  });

  document.getElementById("btn-documentation-general").addEventListener("click", function() {
    enable_tab("documentation","general")
  });

  document.getElementById("btn-editor-general").addEventListener("click", function() {
    enable_tab("editor","general")
  });

  document.getElementById("btn-formatter-general").addEventListener("click", function() {
    enable_tab("formatter","general")
  });

  document.getElementById("btn-formatter-istyle").addEventListener("click", function() {
    enable_tab("formatter","istyle")
  });

  document.getElementById("btn-formatter-s3sv").addEventListener("click", function() {
    enable_tab("formatter","s3sv")
  });

  document.getElementById("btn-formatter-verible").addEventListener("click", function() {
    enable_tab("formatter","verible")
  });

  document.getElementById("btn-formatter-standalone").addEventListener("click", function() {
    enable_tab("formatter","standalone")
  });

  document.getElementById("btn-formatter-svg").addEventListener("click", function() {
    enable_tab("formatter","svg")
  });

  document.getElementById("btn-linter-general").addEventListener("click", function() {
    enable_tab("linter","general")
  });

  document.getElementById("btn-linter-ghdl").addEventListener("click", function() {
    enable_tab("linter","ghdl")
  });

  document.getElementById("btn-linter-icarus").addEventListener("click", function() {
    enable_tab("linter","icarus")
  });

  document.getElementById("btn-linter-modelsim").addEventListener("click", function() {
    enable_tab("linter","modelsim")
  });

  document.getElementById("btn-linter-verible").addEventListener("click", function() {
    enable_tab("linter","verible")
  });

  document.getElementById("btn-linter-verilator").addEventListener("click", function() {
    enable_tab("linter","verilator")
  });

  document.getElementById("btn-linter-vivado").addEventListener("click", function() {
    enable_tab("linter","vivado")
  });

  document.getElementById("btn-linter-vsg").addEventListener("click", function() {
    enable_tab("linter","vsg")
  });

  document.getElementById("btn-schematic-general").addEventListener("click", function() {
    enable_tab("schematic","general")
  });

  document.getElementById("btn-templates-general").addEventListener("click", function() {
    enable_tab("templates","general")
  });

  document.getElementById("btn-tools-general").addEventListener("click", function() {
    enable_tab("tools","general")
  });

  document.getElementById("btn-tools-osvvm").addEventListener("click", function() {
    enable_tab("tools","osvvm")
  });

  document.getElementById("btn-tools-ascenlint").addEventListener("click", function() {
    enable_tab("tools","ascenlint")
  });

  document.getElementById("btn-tools-cocotb").addEventListener("click", function() {
    enable_tab("tools","cocotb")
  });

  document.getElementById("btn-tools-diamond").addEventListener("click", function() {
    enable_tab("tools","diamond")
  });

  document.getElementById("btn-tools-ghdl").addEventListener("click", function() {
    enable_tab("tools","ghdl")
  });

  document.getElementById("btn-tools-icarus").addEventListener("click", function() {
    enable_tab("tools","icarus")
  });

  document.getElementById("btn-tools-icestorm").addEventListener("click", function() {
    enable_tab("tools","icestorm")
  });

  document.getElementById("btn-tools-ise").addEventListener("click", function() {
    enable_tab("tools","ise")
  });

  document.getElementById("btn-tools-isem").addEventListener("click", function() {
    enable_tab("tools","isem")
  });

  document.getElementById("btn-tools-modelsim").addEventListener("click", function() {
    enable_tab("tools","modelsim")
  });

  document.getElementById("btn-tools-morty").addEventListener("click", function() {
    enable_tab("tools","morty")
  });

  document.getElementById("btn-tools-quartus").addEventListener("click", function() {
    enable_tab("tools","quartus")
  });

  document.getElementById("btn-tools-radiant").addEventListener("click", function() {
    enable_tab("tools","radiant")
  });

  document.getElementById("btn-tools-rivierapro").addEventListener("click", function() {
    enable_tab("tools","rivierapro")
  });

  document.getElementById("btn-tools-siliconcompiler").addEventListener("click", function() {
    enable_tab("tools","siliconcompiler")
  });

  document.getElementById("btn-tools-spyglass").addEventListener("click", function() {
    enable_tab("tools","spyglass")
  });

  document.getElementById("btn-tools-symbiyosys").addEventListener("click", function() {
    enable_tab("tools","symbiyosys")
  });

  document.getElementById("btn-tools-symbiflow").addEventListener("click", function() {
    enable_tab("tools","symbiflow")
  });

  document.getElementById("btn-tools-trellis").addEventListener("click", function() {
    enable_tab("tools","trellis")
  });

  document.getElementById("btn-tools-vcs").addEventListener("click", function() {
    enable_tab("tools","vcs")
  });

  document.getElementById("btn-tools-veriblelint").addEventListener("click", function() {
    enable_tab("tools","veriblelint")
  });

  document.getElementById("btn-tools-verilator").addEventListener("click", function() {
    enable_tab("tools","verilator")
  });

  document.getElementById("btn-tools-vivado").addEventListener("click", function() {
    enable_tab("tools","vivado")
  });

  document.getElementById("btn-tools-vunit").addEventListener("click", function() {
    enable_tab("tools","vunit")
  });

  document.getElementById("btn-tools-xcelium").addEventListener("click", function() {
    enable_tab("tools","xcelium")
  });

  document.getElementById("btn-tools-xsim").addEventListener("click", function() {
    enable_tab("tools","xsim")
  });

  document.getElementById("btn-tools-yosys").addEventListener("click", function() {
    enable_tab("tools","yosys")
  });

  document.getElementById("btn-tools-openfpga").addEventListener("click", function() {
    enable_tab("tools","openfpga")
  });

  document.getElementById("btn-tools-activehdl").addEventListener("click", function() {
    enable_tab("tools","activehdl")
  });

  document.getElementById("btn-tools-nvc").addEventListener("click", function() {
    enable_tab("tools","nvc")
  });

  document.getElementById("btn-tools-questa").addEventListener("click", function() {
    enable_tab("tools","questa")
  });

  /* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - 
  This allows the user to have multiple dropdowns without any conflict */
  var dropdown = document.getElementsByClassName("dropdown-btn");
  var i;

  for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var dropdownContent = this.nextElementSibling;
      if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
      } else {
        dropdownContent.style.display = "block";
      }
    });
  }
  
  const vscode = acquireVsCodeApi();

  function send_config_and_close(){
    const config = get_config();

    vscode.postMessage({
        command: 'set_config_and_close',
        config : config
    });
  }

  function send_config(){
    const config = get_config();

    vscode.postMessage({
        command: 'set_config',
        config : config
    });
  }

  function close_panel(){
    vscode.postMessage({
        command: 'close'
    });
  }

  function export_config(){
    vscode.postMessage({
        command: 'export'
    });
  }

  function load_config(){
    vscode.postMessage({
        command: 'load'
    });
  }

  window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
          case 'set_config':
              set_config(message.config);
              break;
      }
  });

  function get_config(){
    const config = {};
    let element_value;
    config["general"] = {}
    config["general"]["general"] = {}
    element_value = document.getElementById("general-general-logging").checked;
    config["general"]["general"]["logging"] = element_value
    element_value = document.getElementById("general-general-pypath").value;
    config["general"]["general"]["pypath"] = element_value
    element_value = document.getElementById("general-general-go_to_definition_vhdl").checked;
    config["general"]["general"]["go_to_definition_vhdl"] = element_value
    element_value = document.getElementById("general-general-go_to_definition_verilog").checked;
    config["general"]["general"]["go_to_definition_verilog"] = element_value
    element_value = document.getElementById("general-general-developer_mode").checked;
    config["general"]["general"]["developer_mode"] = element_value
    config["documentation"] = {}
    config["documentation"]["general"] = {}
    element_value = document.getElementById("documentation-general-language").value;
    config["documentation"]["general"]["language"] = element_value
    element_value = document.getElementById("documentation-general-symbol_vhdl").value;
    config["documentation"]["general"]["symbol_vhdl"] = element_value
    element_value = document.getElementById("documentation-general-symbol_verilog").value;
    config["documentation"]["general"]["symbol_verilog"] = element_value
    element_value = document.getElementById("documentation-general-dependency_graph").checked;
    config["documentation"]["general"]["dependency_graph"] = element_value
    element_value = document.getElementById("documentation-general-self_contained").checked;
    config["documentation"]["general"]["self_contained"] = element_value
    element_value = document.getElementById("documentation-general-fsm").checked;
    config["documentation"]["general"]["fsm"] = element_value
    element_value = document.getElementById("documentation-general-ports").value;
    config["documentation"]["general"]["ports"] = element_value
    element_value = document.getElementById("documentation-general-generics").value;
    config["documentation"]["general"]["generics"] = element_value
    element_value = document.getElementById("documentation-general-instantiations").value;
    config["documentation"]["general"]["instantiations"] = element_value
    element_value = document.getElementById("documentation-general-signals").value;
    config["documentation"]["general"]["signals"] = element_value
    element_value = document.getElementById("documentation-general-constants").value;
    config["documentation"]["general"]["constants"] = element_value
    element_value = document.getElementById("documentation-general-types").value;
    config["documentation"]["general"]["types"] = element_value
    element_value = document.getElementById("documentation-general-process").value;
    config["documentation"]["general"]["process"] = element_value
    element_value = document.getElementById("documentation-general-functions").value;
    config["documentation"]["general"]["functions"] = element_value
    element_value = document.getElementById("documentation-general-magic_config_path").value;
    config["documentation"]["general"]["magic_config_path"] = element_value
    config["editor"] = {}
    config["editor"]["general"] = {}
    element_value = document.getElementById("editor-general-continue_comment").checked;
    config["editor"]["general"]["continue_comment"] = element_value
    config["formatter"] = {}
    config["formatter"]["general"] = {}
    element_value = document.getElementById("formatter-general-formatter_verilog").value;
    config["formatter"]["general"]["formatter_verilog"] = element_value
    element_value = document.getElementById("formatter-general-formatter_vhdl").value;
    config["formatter"]["general"]["formatter_vhdl"] = element_value
    config["formatter"]["istyle"] = {}
    element_value = document.getElementById("formatter-istyle-style").value;
    config["formatter"]["istyle"]["style"] = element_value
    element_value = document.getElementById("formatter-istyle-indentation_size").value;
    config["formatter"]["istyle"]["indentation_size"] = element_value
    config["formatter"]["s3sv"] = {}
    element_value = document.getElementById("formatter-s3sv-one_bind_per_line").checked;
    config["formatter"]["s3sv"]["one_bind_per_line"] = element_value
    element_value = document.getElementById("formatter-s3sv-one_declaration_per_line").checked;
    config["formatter"]["s3sv"]["one_declaration_per_line"] = element_value
    element_value = document.getElementById("formatter-s3sv-use_tabs").checked;
    config["formatter"]["s3sv"]["use_tabs"] = element_value
    element_value = document.getElementById("formatter-s3sv-indentation_size").value;
    config["formatter"]["s3sv"]["indentation_size"] = element_value
    config["formatter"]["verible"] = {}
    element_value = document.getElementById("formatter-verible-path").value;
    config["formatter"]["verible"]["path"] = element_value
    element_value = document.getElementById("formatter-verible-format_args").value;
    config["formatter"]["verible"]["format_args"] = element_value
    config["formatter"]["standalone"] = {}
    element_value = document.getElementById("formatter-standalone-keyword_case").value;
    config["formatter"]["standalone"]["keyword_case"] = element_value
    element_value = document.getElementById("formatter-standalone-name_case").value;
    config["formatter"]["standalone"]["name_case"] = element_value
    element_value = document.getElementById("formatter-standalone-indentation").value;
    config["formatter"]["standalone"]["indentation"] = element_value
    element_value = document.getElementById("formatter-standalone-align_port_generic").checked;
    config["formatter"]["standalone"]["align_port_generic"] = element_value
    element_value = document.getElementById("formatter-standalone-align_comment").checked;
    config["formatter"]["standalone"]["align_comment"] = element_value
    element_value = document.getElementById("formatter-standalone-remove_comments").checked;
    config["formatter"]["standalone"]["remove_comments"] = element_value
    element_value = document.getElementById("formatter-standalone-remove_reports").checked;
    config["formatter"]["standalone"]["remove_reports"] = element_value
    element_value = document.getElementById("formatter-standalone-check_alias").checked;
    config["formatter"]["standalone"]["check_alias"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_then").value;
    config["formatter"]["standalone"]["new_line_after_then"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_semicolon").value;
    config["formatter"]["standalone"]["new_line_after_semicolon"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_else").value;
    config["formatter"]["standalone"]["new_line_after_else"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_port").value;
    config["formatter"]["standalone"]["new_line_after_port"] = element_value
    element_value = document.getElementById("formatter-standalone-new_line_after_generic").value;
    config["formatter"]["standalone"]["new_line_after_generic"] = element_value
    config["formatter"]["svg"] = {}
    element_value = document.getElementById("formatter-svg-configuration").value;
    config["formatter"]["svg"]["configuration"] = element_value
    config["linter"] = {}
    config["linter"]["general"] = {}
    element_value = document.getElementById("linter-general-linter_vhdl").value;
    config["linter"]["general"]["linter_vhdl"] = element_value
    element_value = document.getElementById("linter-general-linter_verilog").value;
    config["linter"]["general"]["linter_verilog"] = element_value
    element_value = document.getElementById("linter-general-lstyle_verilog").value;
    config["linter"]["general"]["lstyle_verilog"] = element_value
    element_value = document.getElementById("linter-general-lstyle_vhdl").value;
    config["linter"]["general"]["lstyle_vhdl"] = element_value
    config["linter"]["ghdl"] = {}
    element_value = document.getElementById("linter-ghdl-arguments").value;
    config["linter"]["ghdl"]["arguments"] = element_value
    config["linter"]["icarus"] = {}
    element_value = document.getElementById("linter-icarus-arguments").value;
    config["linter"]["icarus"]["arguments"] = element_value
    config["linter"]["modelsim"] = {}
    element_value = document.getElementById("linter-modelsim-vhdl_arguments").value;
    config["linter"]["modelsim"]["vhdl_arguments"] = element_value
    element_value = document.getElementById("linter-modelsim-verilog_arguments").value;
    config["linter"]["modelsim"]["verilog_arguments"] = element_value
    config["linter"]["verible"] = {}
    element_value = document.getElementById("linter-verible-arguments").value;
    config["linter"]["verible"]["arguments"] = element_value
    config["linter"]["verilator"] = {}
    element_value = document.getElementById("linter-verilator-arguments").value;
    config["linter"]["verilator"]["arguments"] = element_value
    config["linter"]["vivado"] = {}
    element_value = document.getElementById("linter-vivado-vhdl_arguments").value;
    config["linter"]["vivado"]["vhdl_arguments"] = element_value
    element_value = document.getElementById("linter-vivado-verilog_arguments").value;
    config["linter"]["vivado"]["verilog_arguments"] = element_value
    config["linter"]["vsg"] = {}
    element_value = document.getElementById("linter-vsg-arguments").value;
    config["linter"]["vsg"]["arguments"] = element_value
    config["schematic"] = {}
    config["schematic"]["general"] = {}
    element_value = document.getElementById("schematic-general-backend").value;
    config["schematic"]["general"]["backend"] = element_value
    config["templates"] = {}
    config["templates"]["general"] = {}
    element_value = document.getElementById("templates-general-header_file_path").value;
    config["templates"]["general"]["header_file_path"] = element_value
    element_value = document.getElementById("templates-general-indent").value;
    config["templates"]["general"]["indent"] = element_value
    element_value = document.getElementById("templates-general-clock_generation_style").value;
    config["templates"]["general"]["clock_generation_style"] = element_value
    element_value = document.getElementById("templates-general-instance_style").value;
    config["templates"]["general"]["instance_style"] = element_value
    config["tools"] = {}
    config["tools"]["general"] = {}
    element_value = document.getElementById("tools-general-select_tool").value;
    config["tools"]["general"]["select_tool"] = element_value
    element_value = document.getElementById("tools-general-execution_mode").value;
    config["tools"]["general"]["execution_mode"] = element_value
    element_value = document.getElementById("tools-general-waveform_viewer").value;
    config["tools"]["general"]["waveform_viewer"] = element_value
    config["tools"]["osvvm"] = {}
    element_value = document.getElementById("tools-osvvm-installation_path").value;
    config["tools"]["osvvm"]["installation_path"] = element_value
    element_value = document.getElementById("tools-osvvm-tclsh_binary").value;
    config["tools"]["osvvm"]["tclsh_binary"] = element_value
    element_value = document.getElementById("tools-osvvm-simulator_name").value;
    config["tools"]["osvvm"]["simulator_name"] = element_value
    config["tools"]["ascenlint"] = {}
    element_value = document.getElementById("tools-ascenlint-installation_path").value;
    config["tools"]["ascenlint"]["installation_path"] = element_value
    element_value = document.getElementById("tools-ascenlint-ascentlint_options").value.split(',');
    config["tools"]["ascenlint"]["ascentlint_options"] = element_value
    config["tools"]["cocotb"] = {}
    element_value = document.getElementById("tools-cocotb-installation_path").value;
    config["tools"]["cocotb"]["installation_path"] = element_value
    element_value = document.getElementById("tools-cocotb-simulator_name").value;
    config["tools"]["cocotb"]["simulator_name"] = element_value
    element_value = document.getElementById("tools-cocotb-compile_args").value;
    config["tools"]["cocotb"]["compile_args"] = element_value
    element_value = document.getElementById("tools-cocotb-run_args").value;
    config["tools"]["cocotb"]["run_args"] = element_value
    element_value = document.getElementById("tools-cocotb-plusargs").value;
    config["tools"]["cocotb"]["plusargs"] = element_value
    config["tools"]["diamond"] = {}
    element_value = document.getElementById("tools-diamond-installation_path").value;
    config["tools"]["diamond"]["installation_path"] = element_value
    element_value = document.getElementById("tools-diamond-part").value;
    config["tools"]["diamond"]["part"] = element_value
    config["tools"]["ghdl"] = {}
    element_value = document.getElementById("tools-ghdl-installation_path").value;
    config["tools"]["ghdl"]["installation_path"] = element_value
    element_value = document.getElementById("tools-ghdl-waveform").value;
    config["tools"]["ghdl"]["waveform"] = element_value
    element_value = document.getElementById("tools-ghdl-analyze_options").value.split(',');
    config["tools"]["ghdl"]["analyze_options"] = element_value
    element_value = document.getElementById("tools-ghdl-run_options").value.split(',');
    config["tools"]["ghdl"]["run_options"] = element_value
    config["tools"]["icarus"] = {}
    element_value = document.getElementById("tools-icarus-installation_path").value;
    config["tools"]["icarus"]["installation_path"] = element_value
    element_value = document.getElementById("tools-icarus-timescale").value;
    config["tools"]["icarus"]["timescale"] = element_value
    element_value = document.getElementById("tools-icarus-iverilog_options").value.split(',');
    config["tools"]["icarus"]["iverilog_options"] = element_value
    config["tools"]["icestorm"] = {}
    element_value = document.getElementById("tools-icestorm-installation_path").value;
    config["tools"]["icestorm"]["installation_path"] = element_value
    element_value = document.getElementById("tools-icestorm-pnr").value;
    config["tools"]["icestorm"]["pnr"] = element_value
    element_value = document.getElementById("tools-icestorm-arch").value;
    config["tools"]["icestorm"]["arch"] = element_value
    element_value = document.getElementById("tools-icestorm-output_format").value;
    config["tools"]["icestorm"]["output_format"] = element_value
    element_value = document.getElementById("tools-icestorm-yosys_as_subtool").checked;
    config["tools"]["icestorm"]["yosys_as_subtool"] = element_value
    element_value = document.getElementById("tools-icestorm-makefile_name").value;
    config["tools"]["icestorm"]["makefile_name"] = element_value
    element_value = document.getElementById("tools-icestorm-arachne_pnr_options").value.split(',');
    config["tools"]["icestorm"]["arachne_pnr_options"] = element_value
    element_value = document.getElementById("tools-icestorm-nextpnr_options").value.split(',');
    config["tools"]["icestorm"]["nextpnr_options"] = element_value
    element_value = document.getElementById("tools-icestorm-yosys_synth_options").value.split(',');
    config["tools"]["icestorm"]["yosys_synth_options"] = element_value
    config["tools"]["ise"] = {}
    element_value = document.getElementById("tools-ise-installation_path").value;
    config["tools"]["ise"]["installation_path"] = element_value
    element_value = document.getElementById("tools-ise-family").value;
    config["tools"]["ise"]["family"] = element_value
    element_value = document.getElementById("tools-ise-device").value;
    config["tools"]["ise"]["device"] = element_value
    element_value = document.getElementById("tools-ise-package").value;
    config["tools"]["ise"]["package"] = element_value
    element_value = document.getElementById("tools-ise-speed").value;
    config["tools"]["ise"]["speed"] = element_value
    config["tools"]["isem"] = {}
    element_value = document.getElementById("tools-isem-installation_path").value;
    config["tools"]["isem"]["installation_path"] = element_value
    element_value = document.getElementById("tools-isem-fuse_options").value.split(',');
    config["tools"]["isem"]["fuse_options"] = element_value
    element_value = document.getElementById("tools-isem-isim_options").value.split(',');
    config["tools"]["isem"]["isim_options"] = element_value
    config["tools"]["modelsim"] = {}
    element_value = document.getElementById("tools-modelsim-installation_path").value;
    config["tools"]["modelsim"]["installation_path"] = element_value
    element_value = document.getElementById("tools-modelsim-vcom_options").value.split(',');
    config["tools"]["modelsim"]["vcom_options"] = element_value
    element_value = document.getElementById("tools-modelsim-vlog_options").value.split(',');
    config["tools"]["modelsim"]["vlog_options"] = element_value
    element_value = document.getElementById("tools-modelsim-vsim_options").value.split(',');
    config["tools"]["modelsim"]["vsim_options"] = element_value
    config["tools"]["morty"] = {}
    element_value = document.getElementById("tools-morty-installation_path").value;
    config["tools"]["morty"]["installation_path"] = element_value
    element_value = document.getElementById("tools-morty-morty_options").value.split(',');
    config["tools"]["morty"]["morty_options"] = element_value
    config["tools"]["quartus"] = {}
    element_value = document.getElementById("tools-quartus-installation_path").value;
    config["tools"]["quartus"]["installation_path"] = element_value
    element_value = document.getElementById("tools-quartus-family").value;
    config["tools"]["quartus"]["family"] = element_value
    element_value = document.getElementById("tools-quartus-device").value;
    config["tools"]["quartus"]["device"] = element_value
    element_value = document.getElementById("tools-quartus-cable").value;
    config["tools"]["quartus"]["cable"] = element_value
    element_value = document.getElementById("tools-quartus-board_device_index").value;
    config["tools"]["quartus"]["board_device_index"] = element_value
    element_value = document.getElementById("tools-quartus-pnr").value;
    config["tools"]["quartus"]["pnr"] = element_value
    element_value = document.getElementById("tools-quartus-dse_options").value.split(',');
    config["tools"]["quartus"]["dse_options"] = element_value
    element_value = document.getElementById("tools-quartus-quartus_options").value.split(',');
    config["tools"]["quartus"]["quartus_options"] = element_value
    config["tools"]["radiant"] = {}
    element_value = document.getElementById("tools-radiant-installation_path").value;
    config["tools"]["radiant"]["installation_path"] = element_value
    element_value = document.getElementById("tools-radiant-part").value;
    config["tools"]["radiant"]["part"] = element_value
    config["tools"]["rivierapro"] = {}
    element_value = document.getElementById("tools-rivierapro-installation_path").value;
    config["tools"]["rivierapro"]["installation_path"] = element_value
    element_value = document.getElementById("tools-rivierapro-compilation_mode").value;
    config["tools"]["rivierapro"]["compilation_mode"] = element_value
    element_value = document.getElementById("tools-rivierapro-vlog_options").value.split(',');
    config["tools"]["rivierapro"]["vlog_options"] = element_value
    element_value = document.getElementById("tools-rivierapro-vsim_options").value.split(',');
    config["tools"]["rivierapro"]["vsim_options"] = element_value
    config["tools"]["siliconcompiler"] = {}
    element_value = document.getElementById("tools-siliconcompiler-installation_path").value;
    config["tools"]["siliconcompiler"]["installation_path"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-target").value;
    config["tools"]["siliconcompiler"]["target"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_enable").checked;
    config["tools"]["siliconcompiler"]["server_enable"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_address").value;
    config["tools"]["siliconcompiler"]["server_address"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_username").value;
    config["tools"]["siliconcompiler"]["server_username"] = element_value
    element_value = document.getElementById("tools-siliconcompiler-server_password").value;
    config["tools"]["siliconcompiler"]["server_password"] = element_value
    config["tools"]["spyglass"] = {}
    element_value = document.getElementById("tools-spyglass-installation_path").value;
    config["tools"]["spyglass"]["installation_path"] = element_value
    element_value = document.getElementById("tools-spyglass-methodology").value;
    config["tools"]["spyglass"]["methodology"] = element_value
    element_value = document.getElementById("tools-spyglass-goals").value.split(',');
    config["tools"]["spyglass"]["goals"] = element_value
    element_value = document.getElementById("tools-spyglass-spyglass_options").value.split(',');
    config["tools"]["spyglass"]["spyglass_options"] = element_value
    element_value = document.getElementById("tools-spyglass-rule_parameters").value.split(',');
    config["tools"]["spyglass"]["rule_parameters"] = element_value
    config["tools"]["symbiyosys"] = {}
    element_value = document.getElementById("tools-symbiyosys-installation_path").value;
    config["tools"]["symbiyosys"]["installation_path"] = element_value
    element_value = document.getElementById("tools-symbiyosys-tasknames").value.split(',');
    config["tools"]["symbiyosys"]["tasknames"] = element_value
    config["tools"]["symbiflow"] = {}
    element_value = document.getElementById("tools-symbiflow-installation_path").value;
    config["tools"]["symbiflow"]["installation_path"] = element_value
    element_value = document.getElementById("tools-symbiflow-package").value;
    config["tools"]["symbiflow"]["package"] = element_value
    element_value = document.getElementById("tools-symbiflow-part").value;
    config["tools"]["symbiflow"]["part"] = element_value
    element_value = document.getElementById("tools-symbiflow-vendor").value;
    config["tools"]["symbiflow"]["vendor"] = element_value
    element_value = document.getElementById("tools-symbiflow-pnr").value;
    config["tools"]["symbiflow"]["pnr"] = element_value
    element_value = document.getElementById("tools-symbiflow-vpr_options").value;
    config["tools"]["symbiflow"]["vpr_options"] = element_value
    element_value = document.getElementById("tools-symbiflow-environment_script").value;
    config["tools"]["symbiflow"]["environment_script"] = element_value
    config["tools"]["trellis"] = {}
    element_value = document.getElementById("tools-trellis-installation_path").value;
    config["tools"]["trellis"]["installation_path"] = element_value
    element_value = document.getElementById("tools-trellis-arch").value;
    config["tools"]["trellis"]["arch"] = element_value
    element_value = document.getElementById("tools-trellis-output_format").value;
    config["tools"]["trellis"]["output_format"] = element_value
    element_value = document.getElementById("tools-trellis-yosys_as_subtool").checked;
    config["tools"]["trellis"]["yosys_as_subtool"] = element_value
    element_value = document.getElementById("tools-trellis-makefile_name").value;
    config["tools"]["trellis"]["makefile_name"] = element_value
    element_value = document.getElementById("tools-trellis-script_name").value;
    config["tools"]["trellis"]["script_name"] = element_value
    element_value = document.getElementById("tools-trellis-nextpnr_options").value.split(',');
    config["tools"]["trellis"]["nextpnr_options"] = element_value
    element_value = document.getElementById("tools-trellis-yosys_synth_options").value.split(',');
    config["tools"]["trellis"]["yosys_synth_options"] = element_value
    config["tools"]["vcs"] = {}
    element_value = document.getElementById("tools-vcs-installation_path").value;
    config["tools"]["vcs"]["installation_path"] = element_value
    element_value = document.getElementById("tools-vcs-vcs_options").value.split(',');
    config["tools"]["vcs"]["vcs_options"] = element_value
    element_value = document.getElementById("tools-vcs-run_options").value.split(',');
    config["tools"]["vcs"]["run_options"] = element_value
    config["tools"]["veriblelint"] = {}
    element_value = document.getElementById("tools-veriblelint-installation_path").value;
    config["tools"]["veriblelint"]["installation_path"] = element_value
    config["tools"]["verilator"] = {}
    element_value = document.getElementById("tools-verilator-installation_path").value;
    config["tools"]["verilator"]["installation_path"] = element_value
    element_value = document.getElementById("tools-verilator-mode").value;
    config["tools"]["verilator"]["mode"] = element_value
    element_value = document.getElementById("tools-verilator-libs").value.split(',');
    config["tools"]["verilator"]["libs"] = element_value
    element_value = document.getElementById("tools-verilator-verilator_options").value.split(',');
    config["tools"]["verilator"]["verilator_options"] = element_value
    element_value = document.getElementById("tools-verilator-make_options").value.split(',');
    config["tools"]["verilator"]["make_options"] = element_value
    element_value = document.getElementById("tools-verilator-run_options").value.split(',');
    config["tools"]["verilator"]["run_options"] = element_value
    config["tools"]["vivado"] = {}
    element_value = document.getElementById("tools-vivado-installation_path").value;
    config["tools"]["vivado"]["installation_path"] = element_value
    element_value = document.getElementById("tools-vivado-part").value;
    config["tools"]["vivado"]["part"] = element_value
    element_value = document.getElementById("tools-vivado-synth").value;
    config["tools"]["vivado"]["synth"] = element_value
    element_value = document.getElementById("tools-vivado-pnr").value;
    config["tools"]["vivado"]["pnr"] = element_value
    element_value = document.getElementById("tools-vivado-jtag_freq").value;
    config["tools"]["vivado"]["jtag_freq"] = element_value
    element_value = document.getElementById("tools-vivado-hw_target").value;
    config["tools"]["vivado"]["hw_target"] = element_value
    config["tools"]["vunit"] = {}
    element_value = document.getElementById("tools-vunit-installation_path").value;
    config["tools"]["vunit"]["installation_path"] = element_value
    element_value = document.getElementById("tools-vunit-simulator_name").value;
    config["tools"]["vunit"]["simulator_name"] = element_value
    element_value = document.getElementById("tools-vunit-runpy_mode").value;
    config["tools"]["vunit"]["runpy_mode"] = element_value
    element_value = document.getElementById("tools-vunit-extra_options").value.split(',');
    config["tools"]["vunit"]["extra_options"] = element_value
    element_value = document.getElementById("tools-vunit-enable_array_util_lib").checked;
    config["tools"]["vunit"]["enable_array_util_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_com_lib").checked;
    config["tools"]["vunit"]["enable_com_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_json4vhdl_lib").checked;
    config["tools"]["vunit"]["enable_json4vhdl_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_osvvm_lib").checked;
    config["tools"]["vunit"]["enable_osvvm_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_random_lib").checked;
    config["tools"]["vunit"]["enable_random_lib"] = element_value
    element_value = document.getElementById("tools-vunit-enable_verification_components_lib").checked;
    config["tools"]["vunit"]["enable_verification_components_lib"] = element_value
    config["tools"]["xcelium"] = {}
    element_value = document.getElementById("tools-xcelium-installation_path").value;
    config["tools"]["xcelium"]["installation_path"] = element_value
    element_value = document.getElementById("tools-xcelium-xmvhdl_options").value.split(',');
    config["tools"]["xcelium"]["xmvhdl_options"] = element_value
    element_value = document.getElementById("tools-xcelium-xmvlog_options").value.split(',');
    config["tools"]["xcelium"]["xmvlog_options"] = element_value
    element_value = document.getElementById("tools-xcelium-xmsim_options").value.split(',');
    config["tools"]["xcelium"]["xmsim_options"] = element_value
    element_value = document.getElementById("tools-xcelium-xrun_options").value.split(',');
    config["tools"]["xcelium"]["xrun_options"] = element_value
    config["tools"]["xsim"] = {}
    element_value = document.getElementById("tools-xsim-installation_path").value;
    config["tools"]["xsim"]["installation_path"] = element_value
    element_value = document.getElementById("tools-xsim-xelab_options").value.split(',');
    config["tools"]["xsim"]["xelab_options"] = element_value
    element_value = document.getElementById("tools-xsim-xsim_options").value.split(',');
    config["tools"]["xsim"]["xsim_options"] = element_value
    config["tools"]["yosys"] = {}
    element_value = document.getElementById("tools-yosys-installation_path").value;
    config["tools"]["yosys"]["installation_path"] = element_value
    element_value = document.getElementById("tools-yosys-arch").value;
    config["tools"]["yosys"]["arch"] = element_value
    element_value = document.getElementById("tools-yosys-output_format").value;
    config["tools"]["yosys"]["output_format"] = element_value
    element_value = document.getElementById("tools-yosys-yosys_as_subtool").checked;
    config["tools"]["yosys"]["yosys_as_subtool"] = element_value
    element_value = document.getElementById("tools-yosys-makefile_name").value;
    config["tools"]["yosys"]["makefile_name"] = element_value
    element_value = document.getElementById("tools-yosys-script_name").value;
    config["tools"]["yosys"]["script_name"] = element_value
    element_value = document.getElementById("tools-yosys-yosys_synth_options").value.split(',');
    config["tools"]["yosys"]["yosys_synth_options"] = element_value
    config["tools"]["openfpga"] = {}
    element_value = document.getElementById("tools-openfpga-installation_path").value;
    config["tools"]["openfpga"]["installation_path"] = element_value
    element_value = document.getElementById("tools-openfpga-arch").value;
    config["tools"]["openfpga"]["arch"] = element_value
    element_value = document.getElementById("tools-openfpga-output_format").value;
    config["tools"]["openfpga"]["output_format"] = element_value
    element_value = document.getElementById("tools-openfpga-yosys_as_subtool").checked;
    config["tools"]["openfpga"]["yosys_as_subtool"] = element_value
    element_value = document.getElementById("tools-openfpga-makefile_name").value;
    config["tools"]["openfpga"]["makefile_name"] = element_value
    element_value = document.getElementById("tools-openfpga-script_name").value;
    config["tools"]["openfpga"]["script_name"] = element_value
    element_value = document.getElementById("tools-openfpga-yosys_synth_options").value.split(',');
    config["tools"]["openfpga"]["yosys_synth_options"] = element_value
    config["tools"]["activehdl"] = {}
    element_value = document.getElementById("tools-activehdl-installation_path").value;
    config["tools"]["activehdl"]["installation_path"] = element_value
    config["tools"]["nvc"] = {}
    element_value = document.getElementById("tools-nvc-installation_path").value;
    config["tools"]["nvc"]["installation_path"] = element_value
    config["tools"]["questa"] = {}
    element_value = document.getElementById("tools-questa-installation_path").value;
    config["tools"]["questa"]["installation_path"] = element_value
    return config;
  }

  function set_config(config){
    document.getElementById("general-general-logging").checked = config["general"]["general"]["logging"];
    document.getElementById("general-general-pypath").value = config["general"]["general"]["pypath"];
    document.getElementById("general-general-go_to_definition_vhdl").checked = config["general"]["general"]["go_to_definition_vhdl"];
    document.getElementById("general-general-go_to_definition_verilog").checked = config["general"]["general"]["go_to_definition_verilog"];
    document.getElementById("general-general-developer_mode").checked = config["general"]["general"]["developer_mode"];
    document.getElementById("documentation-general-language").value = config["documentation"]["general"]["language"];
    document.getElementById("documentation-general-symbol_vhdl").value = config["documentation"]["general"]["symbol_vhdl"];
    document.getElementById("documentation-general-symbol_verilog").value = config["documentation"]["general"]["symbol_verilog"];
    document.getElementById("documentation-general-dependency_graph").checked = config["documentation"]["general"]["dependency_graph"];
    document.getElementById("documentation-general-self_contained").checked = config["documentation"]["general"]["self_contained"];
    document.getElementById("documentation-general-fsm").checked = config["documentation"]["general"]["fsm"];
    document.getElementById("documentation-general-ports").value = config["documentation"]["general"]["ports"];
    document.getElementById("documentation-general-generics").value = config["documentation"]["general"]["generics"];
    document.getElementById("documentation-general-instantiations").value = config["documentation"]["general"]["instantiations"];
    document.getElementById("documentation-general-signals").value = config["documentation"]["general"]["signals"];
    document.getElementById("documentation-general-constants").value = config["documentation"]["general"]["constants"];
    document.getElementById("documentation-general-types").value = config["documentation"]["general"]["types"];
    document.getElementById("documentation-general-process").value = config["documentation"]["general"]["process"];
    document.getElementById("documentation-general-functions").value = config["documentation"]["general"]["functions"];
    document.getElementById("documentation-general-magic_config_path").value = config["documentation"]["general"]["magic_config_path"];
    document.getElementById("editor-general-continue_comment").checked = config["editor"]["general"]["continue_comment"];
    document.getElementById("formatter-general-formatter_verilog").value = config["formatter"]["general"]["formatter_verilog"];
    document.getElementById("formatter-general-formatter_vhdl").value = config["formatter"]["general"]["formatter_vhdl"];
    document.getElementById("formatter-istyle-style").value = config["formatter"]["istyle"]["style"];
    document.getElementById("formatter-istyle-indentation_size").value = config["formatter"]["istyle"]["indentation_size"];
    document.getElementById("formatter-s3sv-one_bind_per_line").checked = config["formatter"]["s3sv"]["one_bind_per_line"];
    document.getElementById("formatter-s3sv-one_declaration_per_line").checked = config["formatter"]["s3sv"]["one_declaration_per_line"];
    document.getElementById("formatter-s3sv-use_tabs").checked = config["formatter"]["s3sv"]["use_tabs"];
    document.getElementById("formatter-s3sv-indentation_size").value = config["formatter"]["s3sv"]["indentation_size"];
    document.getElementById("formatter-verible-path").value = config["formatter"]["verible"]["path"];
    document.getElementById("formatter-verible-format_args").value = config["formatter"]["verible"]["format_args"];
    document.getElementById("formatter-standalone-keyword_case").value = config["formatter"]["standalone"]["keyword_case"];
    document.getElementById("formatter-standalone-name_case").value = config["formatter"]["standalone"]["name_case"];
    document.getElementById("formatter-standalone-indentation").value = config["formatter"]["standalone"]["indentation"];
    document.getElementById("formatter-standalone-align_port_generic").checked = config["formatter"]["standalone"]["align_port_generic"];
    document.getElementById("formatter-standalone-align_comment").checked = config["formatter"]["standalone"]["align_comment"];
    document.getElementById("formatter-standalone-remove_comments").checked = config["formatter"]["standalone"]["remove_comments"];
    document.getElementById("formatter-standalone-remove_reports").checked = config["formatter"]["standalone"]["remove_reports"];
    document.getElementById("formatter-standalone-check_alias").checked = config["formatter"]["standalone"]["check_alias"];
    document.getElementById("formatter-standalone-new_line_after_then").value = config["formatter"]["standalone"]["new_line_after_then"];
    document.getElementById("formatter-standalone-new_line_after_semicolon").value = config["formatter"]["standalone"]["new_line_after_semicolon"];
    document.getElementById("formatter-standalone-new_line_after_else").value = config["formatter"]["standalone"]["new_line_after_else"];
    document.getElementById("formatter-standalone-new_line_after_port").value = config["formatter"]["standalone"]["new_line_after_port"];
    document.getElementById("formatter-standalone-new_line_after_generic").value = config["formatter"]["standalone"]["new_line_after_generic"];
    document.getElementById("formatter-svg-configuration").value = config["formatter"]["svg"]["configuration"];
    document.getElementById("linter-general-linter_vhdl").value = config["linter"]["general"]["linter_vhdl"];
    document.getElementById("linter-general-linter_verilog").value = config["linter"]["general"]["linter_verilog"];
    document.getElementById("linter-general-lstyle_verilog").value = config["linter"]["general"]["lstyle_verilog"];
    document.getElementById("linter-general-lstyle_vhdl").value = config["linter"]["general"]["lstyle_vhdl"];
    document.getElementById("linter-ghdl-arguments").value = config["linter"]["ghdl"]["arguments"];
    document.getElementById("linter-icarus-arguments").value = config["linter"]["icarus"]["arguments"];
    document.getElementById("linter-modelsim-vhdl_arguments").value = config["linter"]["modelsim"]["vhdl_arguments"];
    document.getElementById("linter-modelsim-verilog_arguments").value = config["linter"]["modelsim"]["verilog_arguments"];
    document.getElementById("linter-verible-arguments").value = config["linter"]["verible"]["arguments"];
    document.getElementById("linter-verilator-arguments").value = config["linter"]["verilator"]["arguments"];
    document.getElementById("linter-vivado-vhdl_arguments").value = config["linter"]["vivado"]["vhdl_arguments"];
    document.getElementById("linter-vivado-verilog_arguments").value = config["linter"]["vivado"]["verilog_arguments"];
    document.getElementById("linter-vsg-arguments").value = config["linter"]["vsg"]["arguments"];
    document.getElementById("schematic-general-backend").value = config["schematic"]["general"]["backend"];
    document.getElementById("templates-general-header_file_path").value = config["templates"]["general"]["header_file_path"];
    document.getElementById("templates-general-indent").value = config["templates"]["general"]["indent"];
    document.getElementById("templates-general-clock_generation_style").value = config["templates"]["general"]["clock_generation_style"];
    document.getElementById("templates-general-instance_style").value = config["templates"]["general"]["instance_style"];
    document.getElementById("tools-general-select_tool").value = config["tools"]["general"]["select_tool"];
    document.getElementById("tools-general-execution_mode").value = config["tools"]["general"]["execution_mode"];
    document.getElementById("tools-general-waveform_viewer").value = config["tools"]["general"]["waveform_viewer"];
    document.getElementById("tools-osvvm-installation_path").value = config["tools"]["osvvm"]["installation_path"];
    document.getElementById("tools-osvvm-tclsh_binary").value = config["tools"]["osvvm"]["tclsh_binary"];
    document.getElementById("tools-osvvm-simulator_name").value = config["tools"]["osvvm"]["simulator_name"];
    document.getElementById("tools-ascenlint-installation_path").value = config["tools"]["ascenlint"]["installation_path"];
    element_value = document.getElementById("tools-ascenlint-ascentlint_options").value = String(config["tools"]["ascenlint"]["ascentlint_options"]);
    document.getElementById("tools-cocotb-installation_path").value = config["tools"]["cocotb"]["installation_path"];
    document.getElementById("tools-cocotb-simulator_name").value = config["tools"]["cocotb"]["simulator_name"];
    document.getElementById("tools-cocotb-compile_args").value = config["tools"]["cocotb"]["compile_args"];
    document.getElementById("tools-cocotb-run_args").value = config["tools"]["cocotb"]["run_args"];
    document.getElementById("tools-cocotb-plusargs").value = config["tools"]["cocotb"]["plusargs"];
    document.getElementById("tools-diamond-installation_path").value = config["tools"]["diamond"]["installation_path"];
    document.getElementById("tools-diamond-part").value = config["tools"]["diamond"]["part"];
    document.getElementById("tools-ghdl-installation_path").value = config["tools"]["ghdl"]["installation_path"];
    document.getElementById("tools-ghdl-waveform").value = config["tools"]["ghdl"]["waveform"];
    element_value = document.getElementById("tools-ghdl-analyze_options").value = String(config["tools"]["ghdl"]["analyze_options"]);
    element_value = document.getElementById("tools-ghdl-run_options").value = String(config["tools"]["ghdl"]["run_options"]);
    document.getElementById("tools-icarus-installation_path").value = config["tools"]["icarus"]["installation_path"];
    document.getElementById("tools-icarus-timescale").value = config["tools"]["icarus"]["timescale"];
    element_value = document.getElementById("tools-icarus-iverilog_options").value = String(config["tools"]["icarus"]["iverilog_options"]);
    document.getElementById("tools-icestorm-installation_path").value = config["tools"]["icestorm"]["installation_path"];
    document.getElementById("tools-icestorm-pnr").value = config["tools"]["icestorm"]["pnr"];
    document.getElementById("tools-icestorm-arch").value = config["tools"]["icestorm"]["arch"];
    document.getElementById("tools-icestorm-output_format").value = config["tools"]["icestorm"]["output_format"];
    document.getElementById("tools-icestorm-yosys_as_subtool").checked = config["tools"]["icestorm"]["yosys_as_subtool"];
    document.getElementById("tools-icestorm-makefile_name").value = config["tools"]["icestorm"]["makefile_name"];
    element_value = document.getElementById("tools-icestorm-arachne_pnr_options").value = String(config["tools"]["icestorm"]["arachne_pnr_options"]);
    element_value = document.getElementById("tools-icestorm-nextpnr_options").value = String(config["tools"]["icestorm"]["nextpnr_options"]);
    element_value = document.getElementById("tools-icestorm-yosys_synth_options").value = String(config["tools"]["icestorm"]["yosys_synth_options"]);
    document.getElementById("tools-ise-installation_path").value = config["tools"]["ise"]["installation_path"];
    document.getElementById("tools-ise-family").value = config["tools"]["ise"]["family"];
    document.getElementById("tools-ise-device").value = config["tools"]["ise"]["device"];
    document.getElementById("tools-ise-package").value = config["tools"]["ise"]["package"];
    document.getElementById("tools-ise-speed").value = config["tools"]["ise"]["speed"];
    document.getElementById("tools-isem-installation_path").value = config["tools"]["isem"]["installation_path"];
    element_value = document.getElementById("tools-isem-fuse_options").value = String(config["tools"]["isem"]["fuse_options"]);
    element_value = document.getElementById("tools-isem-isim_options").value = String(config["tools"]["isem"]["isim_options"]);
    document.getElementById("tools-modelsim-installation_path").value = config["tools"]["modelsim"]["installation_path"];
    element_value = document.getElementById("tools-modelsim-vcom_options").value = String(config["tools"]["modelsim"]["vcom_options"]);
    element_value = document.getElementById("tools-modelsim-vlog_options").value = String(config["tools"]["modelsim"]["vlog_options"]);
    element_value = document.getElementById("tools-modelsim-vsim_options").value = String(config["tools"]["modelsim"]["vsim_options"]);
    document.getElementById("tools-morty-installation_path").value = config["tools"]["morty"]["installation_path"];
    element_value = document.getElementById("tools-morty-morty_options").value = String(config["tools"]["morty"]["morty_options"]);
    document.getElementById("tools-quartus-installation_path").value = config["tools"]["quartus"]["installation_path"];
    document.getElementById("tools-quartus-family").value = config["tools"]["quartus"]["family"];
    document.getElementById("tools-quartus-device").value = config["tools"]["quartus"]["device"];
    document.getElementById("tools-quartus-cable").value = config["tools"]["quartus"]["cable"];
    document.getElementById("tools-quartus-board_device_index").value = config["tools"]["quartus"]["board_device_index"];
    document.getElementById("tools-quartus-pnr").value = config["tools"]["quartus"]["pnr"];
    element_value = document.getElementById("tools-quartus-dse_options").value = String(config["tools"]["quartus"]["dse_options"]);
    element_value = document.getElementById("tools-quartus-quartus_options").value = String(config["tools"]["quartus"]["quartus_options"]);
    document.getElementById("tools-radiant-installation_path").value = config["tools"]["radiant"]["installation_path"];
    document.getElementById("tools-radiant-part").value = config["tools"]["radiant"]["part"];
    document.getElementById("tools-rivierapro-installation_path").value = config["tools"]["rivierapro"]["installation_path"];
    document.getElementById("tools-rivierapro-compilation_mode").value = config["tools"]["rivierapro"]["compilation_mode"];
    element_value = document.getElementById("tools-rivierapro-vlog_options").value = String(config["tools"]["rivierapro"]["vlog_options"]);
    element_value = document.getElementById("tools-rivierapro-vsim_options").value = String(config["tools"]["rivierapro"]["vsim_options"]);
    document.getElementById("tools-siliconcompiler-installation_path").value = config["tools"]["siliconcompiler"]["installation_path"];
    document.getElementById("tools-siliconcompiler-target").value = config["tools"]["siliconcompiler"]["target"];
    document.getElementById("tools-siliconcompiler-server_enable").checked = config["tools"]["siliconcompiler"]["server_enable"];
    document.getElementById("tools-siliconcompiler-server_address").value = config["tools"]["siliconcompiler"]["server_address"];
    document.getElementById("tools-siliconcompiler-server_username").value = config["tools"]["siliconcompiler"]["server_username"];
    document.getElementById("tools-siliconcompiler-server_password").value = config["tools"]["siliconcompiler"]["server_password"];
    document.getElementById("tools-spyglass-installation_path").value = config["tools"]["spyglass"]["installation_path"];
    document.getElementById("tools-spyglass-methodology").value = config["tools"]["spyglass"]["methodology"];
    element_value = document.getElementById("tools-spyglass-goals").value = String(config["tools"]["spyglass"]["goals"]);
    element_value = document.getElementById("tools-spyglass-spyglass_options").value = String(config["tools"]["spyglass"]["spyglass_options"]);
    element_value = document.getElementById("tools-spyglass-rule_parameters").value = String(config["tools"]["spyglass"]["rule_parameters"]);
    document.getElementById("tools-symbiyosys-installation_path").value = config["tools"]["symbiyosys"]["installation_path"];
    element_value = document.getElementById("tools-symbiyosys-tasknames").value = String(config["tools"]["symbiyosys"]["tasknames"]);
    document.getElementById("tools-symbiflow-installation_path").value = config["tools"]["symbiflow"]["installation_path"];
    document.getElementById("tools-symbiflow-package").value = config["tools"]["symbiflow"]["package"];
    document.getElementById("tools-symbiflow-part").value = config["tools"]["symbiflow"]["part"];
    document.getElementById("tools-symbiflow-vendor").value = config["tools"]["symbiflow"]["vendor"];
    document.getElementById("tools-symbiflow-pnr").value = config["tools"]["symbiflow"]["pnr"];
    document.getElementById("tools-symbiflow-vpr_options").value = config["tools"]["symbiflow"]["vpr_options"];
    document.getElementById("tools-symbiflow-environment_script").value = config["tools"]["symbiflow"]["environment_script"];
    document.getElementById("tools-trellis-installation_path").value = config["tools"]["trellis"]["installation_path"];
    document.getElementById("tools-trellis-arch").value = config["tools"]["trellis"]["arch"];
    document.getElementById("tools-trellis-output_format").value = config["tools"]["trellis"]["output_format"];
    document.getElementById("tools-trellis-yosys_as_subtool").checked = config["tools"]["trellis"]["yosys_as_subtool"];
    document.getElementById("tools-trellis-makefile_name").value = config["tools"]["trellis"]["makefile_name"];
    document.getElementById("tools-trellis-script_name").value = config["tools"]["trellis"]["script_name"];
    element_value = document.getElementById("tools-trellis-nextpnr_options").value = String(config["tools"]["trellis"]["nextpnr_options"]);
    element_value = document.getElementById("tools-trellis-yosys_synth_options").value = String(config["tools"]["trellis"]["yosys_synth_options"]);
    document.getElementById("tools-vcs-installation_path").value = config["tools"]["vcs"]["installation_path"];
    element_value = document.getElementById("tools-vcs-vcs_options").value = String(config["tools"]["vcs"]["vcs_options"]);
    element_value = document.getElementById("tools-vcs-run_options").value = String(config["tools"]["vcs"]["run_options"]);
    document.getElementById("tools-veriblelint-installation_path").value = config["tools"]["veriblelint"]["installation_path"];
    document.getElementById("tools-verilator-installation_path").value = config["tools"]["verilator"]["installation_path"];
    document.getElementById("tools-verilator-mode").value = config["tools"]["verilator"]["mode"];
    element_value = document.getElementById("tools-verilator-libs").value = String(config["tools"]["verilator"]["libs"]);
    element_value = document.getElementById("tools-verilator-verilator_options").value = String(config["tools"]["verilator"]["verilator_options"]);
    element_value = document.getElementById("tools-verilator-make_options").value = String(config["tools"]["verilator"]["make_options"]);
    element_value = document.getElementById("tools-verilator-run_options").value = String(config["tools"]["verilator"]["run_options"]);
    document.getElementById("tools-vivado-installation_path").value = config["tools"]["vivado"]["installation_path"];
    document.getElementById("tools-vivado-part").value = config["tools"]["vivado"]["part"];
    document.getElementById("tools-vivado-synth").value = config["tools"]["vivado"]["synth"];
    document.getElementById("tools-vivado-pnr").value = config["tools"]["vivado"]["pnr"];
    document.getElementById("tools-vivado-jtag_freq").value = config["tools"]["vivado"]["jtag_freq"];
    document.getElementById("tools-vivado-hw_target").value = config["tools"]["vivado"]["hw_target"];
    document.getElementById("tools-vunit-installation_path").value = config["tools"]["vunit"]["installation_path"];
    document.getElementById("tools-vunit-simulator_name").value = config["tools"]["vunit"]["simulator_name"];
    document.getElementById("tools-vunit-runpy_mode").value = config["tools"]["vunit"]["runpy_mode"];
    element_value = document.getElementById("tools-vunit-extra_options").value = String(config["tools"]["vunit"]["extra_options"]);
    document.getElementById("tools-vunit-enable_array_util_lib").checked = config["tools"]["vunit"]["enable_array_util_lib"];
    document.getElementById("tools-vunit-enable_com_lib").checked = config["tools"]["vunit"]["enable_com_lib"];
    document.getElementById("tools-vunit-enable_json4vhdl_lib").checked = config["tools"]["vunit"]["enable_json4vhdl_lib"];
    document.getElementById("tools-vunit-enable_osvvm_lib").checked = config["tools"]["vunit"]["enable_osvvm_lib"];
    document.getElementById("tools-vunit-enable_random_lib").checked = config["tools"]["vunit"]["enable_random_lib"];
    document.getElementById("tools-vunit-enable_verification_components_lib").checked = config["tools"]["vunit"]["enable_verification_components_lib"];
    document.getElementById("tools-xcelium-installation_path").value = config["tools"]["xcelium"]["installation_path"];
    element_value = document.getElementById("tools-xcelium-xmvhdl_options").value = String(config["tools"]["xcelium"]["xmvhdl_options"]);
    element_value = document.getElementById("tools-xcelium-xmvlog_options").value = String(config["tools"]["xcelium"]["xmvlog_options"]);
    element_value = document.getElementById("tools-xcelium-xmsim_options").value = String(config["tools"]["xcelium"]["xmsim_options"]);
    element_value = document.getElementById("tools-xcelium-xrun_options").value = String(config["tools"]["xcelium"]["xrun_options"]);
    document.getElementById("tools-xsim-installation_path").value = config["tools"]["xsim"]["installation_path"];
    element_value = document.getElementById("tools-xsim-xelab_options").value = String(config["tools"]["xsim"]["xelab_options"]);
    element_value = document.getElementById("tools-xsim-xsim_options").value = String(config["tools"]["xsim"]["xsim_options"]);
    document.getElementById("tools-yosys-installation_path").value = config["tools"]["yosys"]["installation_path"];
    document.getElementById("tools-yosys-arch").value = config["tools"]["yosys"]["arch"];
    document.getElementById("tools-yosys-output_format").value = config["tools"]["yosys"]["output_format"];
    document.getElementById("tools-yosys-yosys_as_subtool").checked = config["tools"]["yosys"]["yosys_as_subtool"];
    document.getElementById("tools-yosys-makefile_name").value = config["tools"]["yosys"]["makefile_name"];
    document.getElementById("tools-yosys-script_name").value = config["tools"]["yosys"]["script_name"];
    element_value = document.getElementById("tools-yosys-yosys_synth_options").value = String(config["tools"]["yosys"]["yosys_synth_options"]);
    document.getElementById("tools-openfpga-installation_path").value = config["tools"]["openfpga"]["installation_path"];
    document.getElementById("tools-openfpga-arch").value = config["tools"]["openfpga"]["arch"];
    document.getElementById("tools-openfpga-output_format").value = config["tools"]["openfpga"]["output_format"];
    document.getElementById("tools-openfpga-yosys_as_subtool").checked = config["tools"]["openfpga"]["yosys_as_subtool"];
    document.getElementById("tools-openfpga-makefile_name").value = config["tools"]["openfpga"]["makefile_name"];
    document.getElementById("tools-openfpga-script_name").value = config["tools"]["openfpga"]["script_name"];
    element_value = document.getElementById("tools-openfpga-yosys_synth_options").value = String(config["tools"]["openfpga"]["yosys_synth_options"]);
    document.getElementById("tools-activehdl-installation_path").value = config["tools"]["activehdl"]["installation_path"];
    document.getElementById("tools-nvc-installation_path").value = config["tools"]["nvc"]["installation_path"];
    document.getElementById("tools-questa-installation_path").value = config["tools"]["questa"]["installation_path"];
  }

  function open_submenu_icon(x) {
    x.classList.toggle("change");
  }
</script>

</body>
</html> 
`;