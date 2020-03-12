-- Copyright 2020 Teros Tech
--
-- Ismael Perez Rojo
-- Carlos Alberto Ruiz Naranjo
-- Alfredo Enrique Sáez
--
-- This file is part of Colibri.
--
-- Colibri is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- Colibri is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with Colibri.  If not, see <https://www.gnu.org/licenses/>.

-- Languagues
INSERT INTO languague(code, name, created_at, updated_at) values
('vhdl', 'VHDL', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO languague(code, name, created_at, updated_at) values
('verilog', 'Verilog', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Standard
insert into standard(languague_id, code, name, created_at, updated_at)
values ((select id from languague where code like 'vhdl'), 'vhdl08', '2008', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
insert into standard(languague_id, code, name, created_at, updated_at)
values ((select id from languague where code like 'verilog'), 'verilog01', '2001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Parser
INSERT INTO parser(code, name, created_at, updated_at) values
('vhdl_parser', 'VHDLParser', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO parser(code, name, created_at, updated_at) values
('verilog_parser', 'VerilogParser', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ParserStandard
INSERT INTO parser_standard(parser_id, standard_id, created_at, updated_at) values
((select id from parser where code like 'vhdl_parser'), (select id from standard where code like 'vhdl08'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO parser_standard(parser_id, standard_id, created_at, updated_at) values
((select id from parser where code like 'verilog_parser'), (select id from standard where code like 'verilog01'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Linter
INSERT INTO linter(code, name, external, created_at, updated_at) values
('ghdl', 'GHDL', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO linter(code, name, external, created_at, updated_at) values
('icarus', 'Icarus', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO linter(code, name, external, created_at, updated_at) values
('modelsim', 'Modelsim', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO linter(code, name, external, created_at, updated_at) values
('verilator', 'Verilator', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- LinterStandard
INSERT INTO linter_standard(linter_id, standard_id, created_at, updated_at) values
((select id from linter where code like 'ghdl'), (select id from standard where code like 'vhdl08'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO linter_standard(linter_id, standard_id, created_at, updated_at) values
((select id from linter where code like 'modelsim'), (select id from standard where code like 'vhdl08'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO linter_standard(linter_id, standard_id, created_at, updated_at) values
((select id from linter where code like 'icarus'), (select id from standard where code like 'verilog01'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO linter_standard(linter_id, standard_id, created_at, updated_at) values
((select id from linter where code like 'verilator'), (select id from standard where code like 'verilog01'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Editor
INSERT INTO editor(code, name, created_at, updated_at) values
('vhdl_editor', 'VHDLEditor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO editor(code, name, created_at, updated_at) values
('verilog_editor', 'VerilogEditor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- EditorStandard
INSERT INTO editor_standard(editor_id, standard_id, created_at, updated_at) values
((select id from editor where code like 'vhdl_editor'), (select id from standard where code like 'vhdl08'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO editor_standard(editor_id, standard_id, created_at, updated_at) values
((select id from editor where code like 'verilog_editor'), (select id from standard where code like 'verilog01'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Documenter
INSERT INTO documenter(code, name, created_at, updated_at) values
('vhdl_documenter', 'VHDLDocumenter', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO documenter(code, name, created_at, updated_at) values
('verilog_documenter', 'VerilogDocumenter', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- DocumenterStandard
INSERT INTO documenter_standard(documenter_id, standard_id, created_at, updated_at) values
((select id from documenter where code like 'vhdl_documenter'), (select id from standard where code like 'vhdl08'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO documenter_standard(documenter_id, standard_id, created_at, updated_at) values
((select id from documenter where code like 'verilog_documenter'), (select id from standard where code like 'verilog01'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
