
library	IEEE;
use			IEEE.std_logic_1164.all;
use			IEEE.numeric_std.all;


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
