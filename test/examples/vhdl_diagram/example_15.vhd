
library	IEEE;
use			IEEE.std_logic_1164.all;
use			IEEE.numeric_std.all;


entity counter is
	generic (
		number : integer														--! Number
	);
	port (
		very_large_name_in_the_input_port_in_this_module : in	std_logic;
		rst : in	std_logic;												
		inc : in	std_logic
	);
end entity;


architecture rtl of counter is

begin

end architecture;
