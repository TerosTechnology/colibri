

library	IEEE;
use			IEEE.std_logic_1164.all;
use			IEEE.numeric_std.all;


--! module description

{"name": "andGate_timed", "test" : "andgate_failing", 
 "description": "a full AND-gate test designed to fail", 
 "signal": [
  ["CLK",
   {"name": "CLK", "wave": "p......", "type":"std_logic", "period":"2"}],
  ["IN",
   {"name": "A", "wave": "0.1.0.1.0.....", "type": "std_logic"},
   {"name": "B", "wave": "0.1.0.....1.0.", "type": "std_logic"}],
  ["OUT",
   {"name": "F", "wave": "0.....1.0.....", "type": "std_logic"}]
]}


entity counter is
	generic (
		number : integer														--! Number
	);
	port (
		clk : in	std_logic;
		rst : out	std_logic											
	);
end entity;


architecture rtl of counter is

begin

end architecture;
